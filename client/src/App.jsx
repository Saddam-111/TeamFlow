import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './features/auth/LoginForm';
import { RegisterForm } from './features/auth/RegisterForm';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginForm />} />
      <Route path="/auth/register" element={<RegisterForm />} />
      
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
