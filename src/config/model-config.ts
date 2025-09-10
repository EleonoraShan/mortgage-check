// Model Configuration
// Change this to switch between models easily

export const MODEL_CONFIG = {
  // Change this line to switch models:
  model: 'gpt-oss:20b' as const,
  
} as const;

export const getModelName = () => MODEL_CONFIG.model;
