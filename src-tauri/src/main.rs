// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    morgage_check_lib::run()
}

use serde::{Deserialize, Serialize};
use tauri::{command, Builder};

#[derive(Serialize, Deserialize)]
struct OllamaReq {
    model: String,
    prompt: String,
}

#[derive(Serialize, Deserialize)]
struct OllamaResp {
    response: String,
}

#[command]
async fn askOllama(prompt: String) -> Result<String, String> {
    // Use reqwest (or curl) to POST to Ollama
    let client = reqwest::Client::new();
    let payload = OllamaReq {
        model: "gpt-oss:20b".into(),
        prompt,
    };

    let res = client
        .post("http://localhost:11434/v1/chat")
        .json(&payload)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        return Err(format!("Ollama error: {}", res.text().await.unwrap_or_default()));
    }

    let body: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
    let answer = body
        .get("response")
        .and_then(|v| v.as_str())
        .ok_or_else(|| "Missing 'response' field".to_string())?;
    Ok(answer.to_string())
}

fn main() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![askOllama])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}