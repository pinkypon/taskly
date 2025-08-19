// src/guard/GuestGuard.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or a loading spinner

  if (user) return <Navigate to="/home" replace />;

  return <>{children}</>;
}
