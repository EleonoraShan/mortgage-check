import { AlertTriangle, RefreshCw, ExternalLink, Terminal } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface OllamaErrorScreenProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export const OllamaErrorScreen = ({ onRetry, isRetrying = false }: OllamaErrorScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Ollama Connection Failed
          </h1>
          <p className="text-muted-foreground text-lg">
          Lendomus requires Ollama to be running for document analysis and AI features.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            How to start Ollama:
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">1. Install Ollama (if not already installed):</p>
              <code className="bg-background px-2 py-1 rounded text-xs block">
                curl -fsSL https://ollama.ai/install.sh | sh
              </code>
            </div>
            <div>
              <p className="font-medium mb-1">2. Start the Ollama service:</p>
              <code className="bg-background px-2 py-1 rounded text-xs block">
                ollama serve
              </code>
            </div>
            <div>
              <p className="font-medium mb-1">3. Pull the required model (in a new terminal):</p>
              <code className="bg-background px-2 py-1 rounded text-xs block">
                ollama pull llama3.2:3b
              </code>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Quick Tips:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
            <li>• Make sure Ollama is running on <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">http://localhost:11434</code></li>
            <li>• Check that the model is downloaded and available</li>
            <li>• Restart Ollama if you're having persistent issues</li>
            <li>• Check the terminal for any error messages</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={onRetry} 
            disabled={isRetrying}
            className="flex items-center gap-2"
          >
            {isRetrying ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isRetrying ? 'Checking Connection...' : 'Retry Connection'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.open('https://ollama.ai/docs', '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Ollama Documentation
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-muted-foreground">
            If you continue to have issues, please check the Ollama documentation or restart your system.
          </p>
        </div>
      </Card>
    </div>
  );
};
