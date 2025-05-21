
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CentersPage from "./pages/Centers";
import CenterDetailPage from "./pages/CenterDetail";
import CenterProfilePage from "./pages/CenterProfile";
import RoleSwitcher from "./components/RoleSwitcher";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/centers" replace />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/centers" element={<CentersPage />} />
            <Route path="/centers/:centerId" element={<CenterDetailPage />} />
            <Route path="/centers/:centerId/profile" element={<CenterProfilePage />} />
            <Route path="/role-switcher" element={<RoleSwitcher />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
