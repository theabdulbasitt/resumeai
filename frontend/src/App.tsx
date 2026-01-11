import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Builder from "./pages/Builder";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthSync } from "@/components/AuthSync";

import { ThemeProvider } from "@/components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthSync />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/builder"
              element={
                <ProtectedRoute>
                  <Builder />
                </ProtectedRoute>
              }
            />
            <Route path="/login/*" element={<SignInPage />} />
            <Route path="/signup/*" element={<SignUpPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes >
        </BrowserRouter >
      </TooltipProvider >
    </ThemeProvider>
  </QueryClientProvider >
);

export default App;
