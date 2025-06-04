
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import { UserProvider } from "./contexts/UserContext";
import { useAuth } from "./hooks/useAuth";
import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";
import CentersPage from "./pages/Centers";
import DepartmentsPage from "./pages/DepartmentsPage";
import FacultiesPage from "./pages/FacultiesPage";
import CenterDetailPage from "./pages/CenterDetail";
import CenterProfilePage from "./pages/CenterProfile";
import ManagerDashboard from "./pages/ManagerDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import ReportSubmission from "./pages/ReportSubmission";
import CenterSettings from "./pages/CenterSettings";
import EvaluatorDashboard from "./pages/EvaluatorDashboard";
import ReportsHub from "./pages/ReportsHub";
import ComparisonTool from "./pages/ComparisonTool";
import ReportReview from "./pages/ReportReview";
import KpiApprovals from "./pages/KpiApprovals";
import AnalyticsPage from "./pages/AnalyticsPage";
import IntegratedDashboard from "./pages/IntegratedDashboard";
import KpiManagement from "./pages/KpiManagement";
import AdvancedAnalyticsPage from "./pages/AdvancedAnalyticsPage";
import ReportGeneratorPage from "./pages/ReportGeneratorPage";
import UserProfilePage from "./pages/UserProfilePage";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { profile, loading } = useAuth();
  
  console.log('AppRoutes - Current profile:', profile);
  console.log('AppRoutes - Loading state:', loading);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }
  
  const userRole = profile?.role;
  console.log('AppRoutes - User role:', userRole);

  // Role-based dashboard routing with proper role checking
  const getDashboardComponent = () => {
    console.log('AppRoutes - Getting dashboard for role:', userRole);
    switch (userRole) {
      case 'evaluator':
        return <EvaluatorDashboard />;
      case 'faculty_dean':
        return <FacultyDashboard />;
      case 'department_head':
        return <DepartmentDashboard />;
      case 'manager':
      default:
        return <ManagerDashboard />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Default route - redirect to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Unified dashboard route for all roles */}
        <Route path="dashboard" element={getDashboardComponent()} />
        
        {/* Common routes for all roles */}
        <Route path="centers" element={<CentersPage />} />
        <Route path="centers/:centerId" element={<CenterDetailPage />} />
        <Route path="centers/:centerId/profile" element={<CenterProfilePage />} />
        
        {/* Evaluator specific routes - comprehensive access */}
        {userRole === 'evaluator' && (
          <>
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="faculties" element={<FacultiesPage />} />
            <Route path="reports" element={<ReportsHub />} />
            <Route path="reports/:reportId/review" element={<ReportReview />} />
            <Route path="kpi-approvals" element={<KpiApprovals />} />
            <Route path="kpi-management" element={<KpiManagement />} />
            <Route path="compare" element={<ComparisonTool />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="advanced-analytics" element={<AdvancedAnalyticsPage />} />
            <Route path="report-generator" element={<ReportGeneratorPage />} />
            <Route path="integrated-dashboard" element={<IntegratedDashboard />} />
          </>
        )}
        
        {/* Faculty Dean specific routes */}
        {userRole === 'faculty_dean' && (
          <>
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="reports" element={<ReportsHub />} />
            <Route path="kpi-approvals" element={<KpiApprovals />} />
          </>
        )}
        
        {/* Department Head specific routes */}
        {userRole === 'department_head' && (
          <>
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="reports" element={<ReportsHub />} />
            <Route path="kpi-approvals" element={<KpiApprovals />} />
          </>
        )}
        
        {/* Manager specific routes */}
        {userRole === 'manager' && (
          <>
            <Route path="my-center" element={<Navigate to="/dashboard" replace />} />
            <Route path="submit-report" element={<ReportSubmission />} />
            <Route path="center-settings" element={<CenterSettings />} />
          </>
        )}
        
        {/* User profile route for all roles */}
        <Route path="profile" element={<UserProfilePage />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AuthenticatedApp = () => {
  return (
    <UserProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthGuard>
        <AuthenticatedApp />
      </AuthGuard>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
