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

// Model Configuration - Change this to switch models easily
// Available models: 'gemma3:1b', 'gpt-oss:20b', 'llama3.2:3b', 'qwen2.5:3b'
const MODEL_NAME: &str = "gemma3:1b";

#[derive(Default)]
struct OllamaProcess(Mutex<Option<Child>>);

#[tauri::command]
async fn ensure_ollama_and_model(app_handle: AppHandle) -> Result<String, String> {
    // Check if Ollama is installed
    let ollama_check = Command::new("ollama")
        .arg("--version")
        .output();
    
    match ollama_check {
        Ok(_) => {
            // Ollama is installed, check for model
            let model_check = Command::new("ollama")
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
            // Ollama not installed, install it first
            install_ollama_and_model(app_handle).await
        }
    }
}

#[tauri::command] 
async fn download_model() -> Result<String, String> {
    let mut cmd = Command::new("ollama");
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

#[tauri::command]
async fn install_ollama_and_model(app_handle: AppHandle) -> Result<String, String> {
    // Get app data directory for storing Ollama
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    let ollama_dir = app_data_dir.join("ollama");
    fs::create_dir_all(&ollama_dir)
        .map_err(|e| format!("Failed to create ollama directory: {}", e))?;
    
    // Download Ollama binary
    let ollama_path = ollama_dir.join("ollama");
    
    // Download Ollama for macOS
    let download_result = download_ollama_binary(&ollama_path).await?;
    
    // Make executable
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mut perms = fs::metadata(&ollama_path)
            .map_err(|e| format!("Failed to get permissions: {}", e))?
            .permissions();
        perms.set_mode(0o755);
        fs::set_permissions(&ollama_path, perms)
            .map_err(|e| format!("Failed to set permissions: {}", e))?;
    }
    
    // Now download the model using our local Ollama
    let model_result = download_model_with_local_ollama(&ollama_path).await?;
    
    Ok(format!("Ollama installed and model downloaded: {}", model_result))
}

async fn download_ollama_binary(ollama_path: &PathBuf) -> Result<String, String> {
    // This would use reqwest or similar to download
    // For now, using curl as a simple example
    let output = Command::new("curl")
        .args(["-L", "https://ollama.ai/download/darwin", "-o", ollama_path.to_str().unwrap()])
        .output()
        .map_err(|e| format!("Failed to download Ollama: {}", e))?;
    
    if output.status.success() {
        Ok("Ollama binary downloaded".to_string())
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        Err(format!("Failed to download Ollama binary: {}", error))
    }
}

async fn download_model_with_local_ollama(ollama_path: &PathBuf) -> Result<String, String> {
    // Start Ollama server in background
    let mut server_cmd = Command::new(ollama_path);
    server_cmd.arg("serve")
              .stdout(Stdio::null())
              .stderr(Stdio::null());
    
    let server_process = server_cmd.spawn()
        .map_err(|e| format!("Failed to start Ollama server: {}", e))?;
    
    // Wait for server to start
    thread::sleep(Duration::from_secs(3));
    
    // Download model
    let mut model_cmd = Command::new(ollama_path);
    model_cmd.args(["pull", MODEL_NAME]);
    
    let output = model_cmd.output()
        .map_err(|e| format!("Failed to download model: {}", e))?;
    
    if output.status.success() {
        Ok("Model downloaded successfully".to_string())
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        Err(format!("Failed to download model: {}", error))
    }
}

#[tauri::command]
async fn start_ollama(app_handle: AppHandle) -> Result<String, String> {
    // First ensure Ollama and model are available
    ensure_ollama_and_model(app_handle.clone()).await?;
    
    // Try system Ollama first, fall back to bundled
    let ollama_cmd = if Command::new("ollama").arg("--version").output().is_ok() {
        "ollama".to_string()
    } else {
        // Use bundled Ollama from app data directory
        let app_data_dir = app_handle
            .path()
            .app_data_dir()
            .map_err(|e| format!("Failed to get app data directory: {}", e))?;
        
        app_data_dir.join("ollama").join("ollama").to_string_lossy().to_string()
    };
    
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