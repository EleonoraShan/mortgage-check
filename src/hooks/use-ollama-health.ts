import ollama from 'ollama/browser';
import { useCallback, useEffect, useState } from 'react';
import { getModelName } from '../config/model-config';

interface OllamaHealthState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useOllamaHealth = () => {
  const [healthState, setHealthState] = useState<OllamaHealthState>({
    isConnected: false,
    isLoading: true,
    error: null,
    lastChecked: null
  });

  const checkOllamaHealth = useCallback(async () => {
    setHealthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Test basic Ollama connection
      const testResponse = await ollama.chat({
        model: getModelName(),
        stream: false,
        messages: [{ role: "user", content: "Hello, respond with just 'OK'" }]
      });

      if (testResponse && testResponse.message) {
        setHealthState({
          isConnected: true,
          isLoading: false,
          error: null,
          lastChecked: new Date()
        });
      } else {
        throw new Error('Invalid response from Ollama');
      }
    } catch (error) {
      console.error('Ollama health check failed:', error);
      setHealthState({
        isConnected: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date()
      });
    }
  }, []);

  // Check health on mount
  useEffect(() => {
    checkOllamaHealth();
  }, [checkOllamaHealth]);

  // // Periodic health checks (every 5 minutes)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!healthState.isLoading) {
  //       checkOllamaHealth();
  //     }
  //   }, 3000000);

  //   return () => clearInterval(interval);
  // }, [checkOllamaHealth, healthState.isLoading]);

  return {
    ...healthState,
    retry: checkOllamaHealth
  };
};
