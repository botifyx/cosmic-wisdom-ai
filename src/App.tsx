
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Astrology from "./pages/Astrology";
import Palmistry from "./pages/Palmistry";

// Create a client outside of the component
const queryClient = new QueryClient();

// Make sure App is defined as a function component
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/astrology" element={<Astrology />} />
            <Route path="/palmistry" element={<Palmistry />} />
            {/* These routes will be implemented in the future */}
            <Route path="/moleology" element={<NotFound />} />
            <Route path="/zodiac" element={<NotFound />} />
            <Route path="/kamasutra" element={<NotFound />} />
            <Route path="/ancient-wisdom" element={<NotFound />} />
            <Route path="/chat" element={<NotFound />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
