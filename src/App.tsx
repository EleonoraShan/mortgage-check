import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { Toaster } from "../src/components/ui/toaster";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { OllamaErrorScreen } from "./components/OllamaErrorScreen";
import { SplashScreen } from "./components/SplashScreen";
import { useOllamaHealth } from "./hooks/use-ollama-health";
import { initializeOllama } from "./initialise-model";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const [isAppLoading, setIsAppLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  // Use Ollama health check
  const { isConnected, isLoading: isHealthLoading, retry } = useOllamaHealth()

  // Hide splash after 5 seconds if Ollama is not initialised by then
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplashScreen(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const attemptToInitialise = () => {
    setIsError(false)
    setIsAppLoading(true)
    initializeOllama().then(async (success) => {
      console.log('Ollama init result:', success)
      if (!success) {
        setIsError(true)
      }

      // Check if the correct model is running
      const { error } = await retry();
      if (error !== null) {
        setIsError(true)
      }
    }).catch((e) => {
      console.error('Ollama init error:', e)
      setIsError(true)
    }).finally(() => {
      console.log('Ollama init finished, setting loading to false')
      setIsAppLoading(false)
      setShowSplashScreen(false)
    })
  }

  useEffect(() => {
    console.log('App useEffect running...')

    attemptToInitialise()

  }, [])

  console.log('App render - isAppLoading:', isAppLoading, 'isConnected:', isConnected, 'isHealthLoading:', isHealthLoading)

  // Show Ollama error screen if there was an error connecting the model
  if (isError) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OllamaErrorScreen onRetry={attemptToInitialise} isRetrying={isHealthLoading} />
        </TooltipProvider>
      </QueryClientProvider>
    )
  }

  return <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {showSplashScreen && <SplashScreen />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index isAppReady={!isAppLoading && !isError} isAppLoading={isAppLoading} />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
};

export default App;
