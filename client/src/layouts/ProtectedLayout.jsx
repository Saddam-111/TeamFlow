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
        <div className="text-lime-accent heading-hero animate-pulse">LOADING...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="h-screen overflow-hidden bg-bg-black flex flex-col">
      <header className="h-14 glass border-b border-white/[0.06] flex items-center justify-between px-3 sm:px-4 lg:px-6 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-lime-accent">
            TEAMFLOW
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-xs sm:text-sm font-mono uppercase text-white/50 hidden sm:block">{user?.username}</span>
          <button
            onClick={handleLogout}
            className="text-xs sm:text-sm font-bold uppercase text-white/50 hover:text-lime-accent transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}