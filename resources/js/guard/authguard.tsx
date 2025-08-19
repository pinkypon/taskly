// src/guard/AuthGuard.tsx
import { ReactNode } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    // 👇 This replaces the whole `/home` attempt with `/login`
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
