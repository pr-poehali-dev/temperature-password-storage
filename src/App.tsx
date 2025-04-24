
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TwoFactorAuth from "./components/TwoFactorAuth";
import Settings from "./pages/Settings";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Защищенный маршрут, который проверяет аутентификацию
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, pendingTwoFactor } = useAuth();
  
  if (!isAuthenticated) {
    // Если включена 2FA но еще не подтверждена, перенаправляем на страницу 2FA
    if (pendingTwoFactor) {
      return <Navigate to="/2fa" replace />;
    }
    // Иначе перенаправляем на страницу входа
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Маршрут для аутентификации, который запрещает доступ аутентифицированным пользователям
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, pendingTwoFactor } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (pendingTwoFactor) {
    return <Navigate to="/2fa" replace />;
  }
  
  return <>{children}</>;
};

// Компонент для маршрутов с проверкой 2FA
const TwoFactorRoute = ({ children }: { children: React.ReactNode }) => {
  const { pendingTwoFactor } = useAuth();
  
  if (!pendingTwoFactor) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
      <Route path="/2fa" element={<TwoFactorRoute><TwoFactorAuth /></TwoFactorRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
