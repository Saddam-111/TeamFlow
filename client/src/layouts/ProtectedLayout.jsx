import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import socketService from '../services/socket.js';

export function ProtectedLayout() {
  const { isAuthenticated, user, setUser, setAuth, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated) {
        socketService.connect();
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    initAuth();

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    socketService.disconnect();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-black flex items-center justify-center">
        <div className="text-acid-yellow heading-hero">LOADING...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="h-screen overflow-hidden bg-bg-black flex flex-col">
      <header className="h-14 bg-surface border-b border-surface-light flex items-center justify-between px-2 md:px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <h1 className="text-sm md:text-xl font-black uppercase tracking-wider text-acid-yellow">TEAMFLOW</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-xs md:text-sm font-bold uppercase hidden sm:block">{user?.username}</span>
          <button
            onClick={handleLogout}
            className="text-xs md:text-sm font-bold uppercase hover:text-acid-yellow transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
