import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { Toaster } from "../src/components/ui/toaster";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { initializeOllama } from "./initialise-model";
import { useOllamaHealth } from "./hooks/use-ollama-health";
import { OllamaErrorScreen } from "./components/OllamaErrorScreen";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAppLoading, setIsAppLoading] = useState(false)
  const [isAppReady, setIsAppReady] = useState(false)
  const [errorLoadingApp, setErrorLoadingApp] = useState<string | null>(null)
  
  // Use Ollama health check
  const { isConnected, isLoading: isHealthLoading, retry } = useOllamaHealth()
  
  useEffect(() => {
    console.log('App useEffect running...')
    
    // Start a timer to show loading after 1 second
    const loadingTimer = setTimeout(() => {
      setIsAppLoading(true)
    }, 1000)
    
    initializeOllama().then((success) => { 
      console.log('Ollama init result:', success)
      setIsAppReady(true)
      if (!success) {
        setErrorLoadingApp("Ollama initialization failed, but app will continue to work")
      }
    }).catch((e) => {
      console.error('Ollama init error:', e)
      setErrorLoadingApp(JSON.stringify(e))
      setIsAppReady(true) // Still show the app even if Ollama fails
    }).finally(() => {
      console.log('Ollama init finished, setting loading to false')
      clearTimeout(loadingTimer) // Clear the timer if Ollama finishes before 1 second
      setIsAppLoading(false)
    })
    
    // Cleanup function to clear timer if component unmounts
    return () => {
      clearTimeout(loadingTimer)
    }
  }, [])
  
  console.log('App render - isAppLoading:', isAppLoading, 'isAppReady:', isAppReady, 'error:', errorLoadingApp, 'isConnected:', isConnected, 'isHealthLoading:', isHealthLoading)
  
  // Show Ollama error screen if not connected and not loading
  if (isAppReady && !isHealthLoading && !isConnected) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OllamaErrorScreen onRetry={retry} isRetrying={isHealthLoading} />
        </TooltipProvider>
      </QueryClientProvider>
    )
  }
  
  return <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={errorLoadingApp ? <p>{errorLoadingApp}</p> : <Index isAppReady={isAppReady} isAppLoading={isAppLoading} />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
};

export default App;
