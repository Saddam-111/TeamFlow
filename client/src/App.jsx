import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './features/auth/LoginForm';
import { RegisterForm } from './features/auth/RegisterForm';
import { LandingPage } from './features/landing/LandingPage';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { useAuthStore } from './store/auth.store';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route
        path="/auth/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />}
      />
      <Route
        path="/auth/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterForm />}
      />
      
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
