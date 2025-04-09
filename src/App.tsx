
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppHeader from "./components/AppHeader";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateOrderSession from "./pages/admin/CreateOrderSession";
import OrderSessionDetail from "./pages/admin/OrderSessionDetail";

// Member Pages
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberOrderDetail from "./pages/member/MemberOrderDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <AppHeader />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/create-order"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <CreateOrderSession />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/order/:sessionId"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <OrderSessionDetail />
                    </ProtectedRoute>
                  }
                />
                
                {/* Member Routes */}
                <Route
                  path="/member"
                  element={
                    <ProtectedRoute allowedRoles={["member"]}>
                      <MemberDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/member/order/:sessionId"
                  element={
                    <ProtectedRoute allowedRoles={["member"]}>
                      <MemberOrderDetail />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
