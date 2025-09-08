
// import { invoke } from '@tauri-apps/api/core';

// const ask = async () => {
//   const answer = await invoke<string>('ask_ollama', { prompt: userPrompt });
//   setAnswer(answer);
// };

import { fetch } from '@tauri-apps/plugin-http';


export const ask = async (prompt: string) => {
  const payload = { model: 'gpt-oss:20b', 
    stream: false,
    messages: [
      {
        role: "system",
        content: prompt
      }
    ], };

  const response = await fetch('http://localhost:11434/v1/chat', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return await response.json();
};

