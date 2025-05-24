
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
import AppLayout from "./components/AppLayout";
import ManagerDashboard from "./pages/ManagerDashboard";
import ReportSubmission from "./pages/ReportSubmission";
import CenterSettings from "./pages/CenterSettings";
import EvaluatorDashboard from "./pages/EvaluatorDashboard";
import ReportsHub from "./pages/ReportsHub";
import ComparisonTool from "./pages/ComparisonTool";
import ReportReview from "./pages/ReportReview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/role-switcher" element={<RoleSwitcher />} />
            
            <Route path="/" element={<AppLayout />}>
              {/* Common routes for both roles */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="centers" element={<CentersPage />} />
              <Route path="centers/:centerId" element={<CenterDetailPage />} />
              <Route path="centers/:centerId/profile" element={<CenterProfilePage />} />
              
              {/* Evaluator specific routes */}
              <Route path="dashboard" element={<EvaluatorDashboard />} />
              <Route path="reports" element={<ReportsHub />} />
              <Route path="reports/:reportId/review" element={<ReportReview />} />
              <Route path="compare" element={<ComparisonTool />} />
              
              {/* Manager specific routes */}
              <Route path="my-center" element={<ManagerDashboard />} />
              <Route path="submit-report" element={<ReportSubmission />} />
              <Route path="center-settings" element={<CenterSettings />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
