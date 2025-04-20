
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
import Zodiac from "./pages/Zodiac";
import Moleology from "./pages/Moleology";
import Kamasutra from "./pages/Kamasutra";
import Chat from "./pages/Chat";
import AncientWisdom from "./pages/AncientWisdom";

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
            <Route path="/zodiac" element={<Zodiac />} />
            <Route path="/moleology" element={<Moleology />} />
            <Route path="/kamasutra" element={<Kamasutra />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/ancient-wisdom" element={<AncientWisdom />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
