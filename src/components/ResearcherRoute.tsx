import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/contexts/LocaleProvider';
import { Loader2, ShieldX } from 'lucide-react';

interface ResearcherRouteProps {
  children: React.ReactNode;
}

export default function ResearcherRoute({ children }: ResearcherRouteProps) {
  const { session, loading, isRegistered, isResearcher } = useAuth();
  const { t } = useLocale();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (!isRegistered) {
    return <Navigate to="/registro" replace />;
  }

  if (!isResearcher) {
    return (
      <div className="sm:pl-48 flex items-center justify-center py-20">
        <div className="text-center max-w-sm">
          <ShieldX className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">{t('researcher.accessDenied')}</p>
          <p className="text-xs text-muted-foreground">{t('researcher.accessDeniedDesc')}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
