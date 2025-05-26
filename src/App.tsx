
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import { useAuth } from "./hooks/useAuth";
import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";
import CentersPage from "./pages/Centers";
import CenterDetailPage from "./pages/CenterDetail";
import CenterProfilePage from "./pages/CenterProfile";
import ManagerDashboard from "./pages/ManagerDashboard";
import ReportSubmission from "./pages/ReportSubmission";
import CenterSettings from "./pages/CenterSettings";
import EvaluatorDashboard from "./pages/EvaluatorDashboard";
import ReportsHub from "./pages/ReportsHub";
import ComparisonTool from "./pages/ComparisonTool";
import ReportReview from "./pages/ReportReview";
import KpiApprovals from "./pages/KpiApprovals";
import AnalyticsPage from "./pages/AnalyticsPage";
import IntegratedDashboard from "./pages/IntegratedDashboard";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { userRole } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Common routes for both roles */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="centers" element={<CentersPage />} />
        <Route path="centers/:centerId" element={<CenterDetailPage />} />
        <Route path="centers/:centerId/profile" element={<CenterProfilePage />} />
        
        {/* Role-based dashboard routing */}
        <Route 
          path="dashboard" 
          element={userRole === 'evaluator' ? <EvaluatorDashboard /> : <ManagerDashboard />} 
        />
        
        {/* Evaluator specific routes */}
        {userRole === 'evaluator' && (
          <>
            <Route path="reports" element={<ReportsHub />} />
            <Route path="reports/:reportId/review" element={<ReportReview />} />
            <Route path="kpi-approvals" element={<KpiApprovals />} />
            <Route path="compare" element={<ComparisonTool />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="integrated-dashboard" element={<IntegratedDashboard />} />
          </>
        )}
        
        {/* Manager specific routes */}
        {userRole === 'manager' && (
          <>
            <Route path="my-center" element={<ManagerDashboard />} />
            <Route path="submit-report" element={<ReportSubmission />} />
            <Route path="center-settings" element={<CenterSettings />} />
          </>
        )}
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthGuard>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthGuard>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
