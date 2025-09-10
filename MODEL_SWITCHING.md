# Model Switching Guide

To switch between different AI models in Valora, you only need to change **2 files**:

## Quick Switch

### 1. Frontend (TypeScript)
Edit: `src/config/model-config.ts`
```typescript
export const MODEL_CONFIG = {
  // Change this line to switch models:
  model: 'gemma3:1b' as const,  // ← Change this
  
  // Alternative models (uncomment one to use):
  // model: 'gpt-oss:20b' as const,
  // model: 'llama3.2:3b' as const,
  // model: 'qwen2.5:3b' as const,
} as const;
```

### 2. Backend (Rust)
Edit: `src-tauri/src/main.rs`
```rust
// Model Configuration - Change this to switch models easily
const MODEL_NAME: &str = "gemma3:1b";  // ← Change this
```

## Available Models

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| `gemma3:1b` | ~1.3GB | Fast | Good | Testing, quick analysis |
| `gpt-oss:20b` | ~20GB | Slow | Excellent | Production, detailed analysis |
| `llama3.2:3b` | ~3GB | Medium | Good | Balanced performance |
| `qwen2.5:3b` | ~3GB | Medium | Good | Alternative option |

## Steps to Switch

1. **Stop the app** if it's running
2. **Change both files** above to use the new model name
3. **Restart the app** - it will automatically download the new model
4. **Wait for download** - first time using a model will take time to download

## Notes

- The app will automatically download the new model when you start it
- First-time downloads can take several minutes depending on model size
- All existing functionality remains the same regardless of model
- Models are cached locally, so switching back is instant

## Troubleshooting

If a model doesn't work:
1. Check the model name is correct (case-sensitive)
2. Ensure you have enough disk space
3. Try a smaller model first (like `gemma3:1b`)
4. Check the console for error messages
