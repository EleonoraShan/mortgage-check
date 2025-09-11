import { invoke } from '@tauri-apps/api/core';

// Call this on app startup or when user wants to use the model
export async function initializeOllama() {
  console.log('Called initializeOllama')
    try {
        // This will download Ollama + model if not present
        console.log('Ensuring ollama and model exist')
        const result = await invoke('ensure_ollama_and_model');
        console.log(result);

        console.log('Starting ollama')
        
        // Start the Ollama server
        await invoke('start_ollama');
        
        // Now you can use your regular API calls
        console.log("Ollama started")
        return true;
    } catch (error) {
        console.error('Failed to initialize Ollama:', error);
        return false;
    }
}
