
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import TrainerDashboard from "./pages/dashboards/TrainerDashboard";
import DSPDashboard from "./pages/dashboards/DSPDashboard";
import AgencyDashboard from "./pages/dashboards/AgencyDashboard";  
import CountyDashboard from "./pages/dashboards/CountyDashboard";
import CoursesPage from "./pages/CoursesPage";
import LearningPage from "./pages/LearningPage";
import ShiftBrowserPage from "./pages/ShiftBrowserPage";
import TransportationPage from "./pages/TransportationPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            {/* Redirect old auth routes to the unified auth page */}
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/register" element={<Navigate to="/auth" replace />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
            <Route path="/dashboard/dsp" element={<DSPDashboard />} />
            <Route path="/dashboard/agency" element={<AgencyDashboard />} />
            <Route path="/dashboard/county" element={<CountyDashboard />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/shifts" element={<ShiftBrowserPage />} />
            <Route path="/transportation" element={<TransportationPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
