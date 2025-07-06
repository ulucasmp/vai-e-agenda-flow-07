
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, session } = useAuth();

  console.log('ProtectedRoute - loading:', loading, 'user:', user?.email, 'session:', !!session);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>Carregando...</div>
        </div>
      </div>
    );
  }

  // Check both user and session for better reliability
  if (!user || !session) {
    console.log('ProtectedRoute - Redirecting to /auth - no user or session');
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
