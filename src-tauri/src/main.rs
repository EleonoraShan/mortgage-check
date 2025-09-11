// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::process::{Command, Child, Stdio};
use tauri::{Manager, AppHandle};
use std::thread;
use std::time::Duration;
use std::sync::Mutex;
use std::path::PathBuf;
use std::fs;
use tauri_plugin_dialog::DialogExt;

const MODEL_NAME: &str = "gpt-oss:20b";

#[derive(Default)]
struct OllamaProcess(Mutex<Option<Child>>);

#[tauri::command]
async fn ensure_ollama_and_model(app_handle: AppHandle) -> Result<String, String> {
    // Resolve Ollama binary
    let ollama_cmd = resolve_ollama_binary().ok_or_else(||
        "Ollama is not installed or not found in PATH. Install from https://ollama.com/download or set OLLAMA_PATH.".to_string()
    )?;
    
    // Check if Ollama is installed
    let ollama_check = Command::new(&ollama_cmd)
        .arg("--version")
        .output();

    match ollama_check {
        Ok(_) => {
            // Ollama is installed, check for model
            let model_check = Command::new(&ollama_cmd)
                .args(["list"])
                .output()
                .map_err(|e| format!("Failed to list models: {}", e))?;
            
            let output = String::from_utf8_lossy(&model_check.stdout);
            
            if output.contains(MODEL_NAME) {
                Ok("Model already available".to_string())
            } else {
                // Download the model
                download_model().await
            }
        },
        Err(_) => {
            // Ollama not installed. Don't attempt to self-install in production.
            Err("Ollama is not installed. Please install Ollama from https://ollama.com/download and try again.".to_string())
        }
    }
}

#[tauri::command] 
async fn download_model() -> Result<String, String> {
    let ollama_cmd = resolve_ollama_binary().ok_or_else(||
        "Ollama is not installed or not found in PATH. Install from https://ollama.com/download or set OLLAMA_PATH.".to_string()
    )?;
    let mut cmd = Command::new(ollama_cmd);
    cmd.args(["pull", MODEL_NAME])
       .stdout(Stdio::piped())
       .stderr(Stdio::piped());
    
    let output = cmd.output()
        .map_err(|e| format!("Failed to download model: {}", e))?;
    
    if output.status.success() {
        Ok("Model downloaded successfully".to_string())
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        Err(format!("Failed to download model: {}", error))
    }
}

// Note: We intentionally do not attempt to self-install Ollama in production.
// Installing third-party runtimes should be handled by the user or an installer.

#[tauri::command]
async fn start_ollama(app_handle: AppHandle) -> Result<String, String> {
    // First ensure Ollama and model are available
    ensure_ollama_and_model(app_handle.clone()).await?;
    
    // Use system Ollama
    let ollama_cmd = resolve_ollama_binary().ok_or_else(||
        "Ollama is not installed or not found in PATH. Install from https://ollama.com/download or set OLLAMA_PATH.".to_string()
    )?;
    
    let mut cmd = Command::new(ollama_cmd);
    cmd.env("OLLAMA_HOST", "127.0.0.1:11434")
       .arg("serve")
       .stdout(Stdio::piped())
       .stderr(Stdio::piped());
    
    match cmd.spawn() {
        Ok(child) => {
            let process_state = app_handle.state::<OllamaProcess>();
            *process_state.0.lock().unwrap() = Some(child);
            
            thread::sleep(Duration::from_secs(2));
            Ok("Ollama started successfully".to_string())
        },
        Err(e) => Err(format!("Failed to start Ollama: {}", e))
    }
}

#[tauri::command]
async fn stop_ollama(app_handle: AppHandle) -> Result<String, String> {
    let process_state = app_handle.state::<OllamaProcess>();
    let mut process = process_state.0.lock().unwrap();
    
    if let Some(mut child) = process.take() {
        match child.kill() {
            Ok(_) => Ok("Ollama stopped".to_string()),
            Err(e) => Err(format!("Failed to stop Ollama: {}", e))
        }
    } else {
        Ok("Ollama not running".to_string())
    }
}

#[tauri::command]
async fn save_pdf_file(app_handle: AppHandle, pdf_data: Vec<u8>, suggested_filename: String) -> Result<String, String> {
    use std::sync::mpsc;
    
    // Create a channel to receive the file path from the dialog
    let (tx, rx) = mpsc::channel();
    
    // Show save dialog
    app_handle.dialog()
        .file()
        .add_filter("PDF files", &["pdf"])
        .set_file_name(&suggested_filename)
        .save_file(move |file_path| {
            let _ = tx.send(file_path);
        });

    // Wait for the dialog result
    let file_path = rx.recv()
        .map_err(|_| "Failed to receive dialog result")?
        .ok_or("User cancelled file save dialog")?;

    // Convert FilePath to PathBuf
    let path_buf = file_path.into_path()
        .map_err(|e| format!("Failed to convert file path: {}", e))?;

    // Write the PDF data to the selected file
    fs::write(&path_buf, pdf_data)
        .map_err(|e| format!("Failed to write PDF file: {}", e))?;

    Ok(format!("PDF saved successfully to: {}", path_buf.display()))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(OllamaProcess::default())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            start_ollama, 
            stop_ollama, 
            ensure_ollama_and_model,
            download_model,
            save_pdf_file
        ])
        .setup(|app| {
            // Don't auto-start - let user trigger the download/setup first
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    run();
}

fn resolve_ollama_binary() -> Option<String> {
    // 1) Explicit env override
    if let Ok(explicit) = std::env::var("OLLAMA_PATH") {
        if !explicit.is_empty() {
            return Some(explicit);
        }
    }

    // 2) Use `which ollama`
    if Command::new("which").arg("ollama").output().ok().and_then(|o| {
        if o.status.success() { Some(String::from_utf8_lossy(&o.stdout).trim().to_string()) } else { None }
    }).filter(|s| !s.is_empty()).is_some() {
        let path = String::from_utf8_lossy(&Command::new("which").arg("ollama").output().ok()?.stdout).trim().to_string();
        if !path.is_empty() { return Some(path); }
    }

    // 3) Common macOS locations (Intel and Apple Silicon Homebrew)
    let candidates = [
        "/usr/local/bin/ollama",
        "/opt/homebrew/bin/ollama",
        "/usr/bin/ollama",
        "/bin/ollama",
    ];
    for candidate in candidates.iter() {
        if std::path::Path::new(candidate).exists() {
            return Some(candidate.to_string());
        }
    }

    None
}