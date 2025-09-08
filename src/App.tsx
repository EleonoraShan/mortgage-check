import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { Toaster } from "../src/components/ui/toaster";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { initializeOllama } from "./initialise-model";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAppLoading, setIsAppLoading] = useState(false)
  const [isAppReady, setIsAppReady] = useState(false)
  const [errorLoadingApp, setErrorLoadingApp] = useState<string | null>(null)
  useEffect(() => {
    setIsAppLoading(true)
    initializeOllama().then(() => { setIsAppReady(true) }).catch((e) => setErrorLoadingApp(JSON.stringify(e))).finally(() => setIsAppLoading(false))
  }, [])
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
