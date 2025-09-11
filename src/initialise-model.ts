import { invoke } from '@tauri-apps/api/core';

// Call this on app startup or when user wants to use the model
export async function initializeOllama() {
    try {
        // // This will download Ollama + model if not present
        // const result = await invoke('ensure_ollama_and_model');
        // console.log(result);
        
        // Start the Ollama server
        await invoke('start_ollama');
        
        // Now you can use your regular API calls
        return true;
    } catch (error) {
        console.error('Failed to initialize Ollama:', error);
        return false;
    }
}
