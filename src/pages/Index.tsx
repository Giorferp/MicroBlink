import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthGate from '@/components/AuthGate';
import { Loader2 } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { loading, isAuthenticated, isRegistered } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated && !isRegistered) {
      navigate('/registro', { replace: true });
    } else if (isAuthenticated && isRegistered) {
      navigate('/encuestas', { replace: true });
    }
  }, [loading, isAuthenticated, isRegistered, navigate]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthGate />;
  }

  return null;
}
