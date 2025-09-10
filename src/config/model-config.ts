// Model Configuration
// Change this to switch between models easily

// Available models:
// - 'gemma3:1b' (smaller, faster, good for testing)
// - 'gpt-oss:20b' (larger, more capable, production)

export const MODEL_CONFIG = {
  // Change this line to switch models:
  model: 'gemma3:1b' as const,
  
  // Alternative models (uncomment one to use):
  // model: 'gpt-oss:20b' as const,
  // model: 'llama3.2:3b' as const,
  // model: 'qwen2.5:3b' as const,
} as const;

export const getModelName = () => MODEL_CONFIG.model;
