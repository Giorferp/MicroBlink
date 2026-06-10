import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/contexts/LocaleProvider';
import LanguageToggle from '@/components/LanguageToggle';
import { BarChart3, ClipboardList, User, LogOut, Database, FlaskConical, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

function usePhantomAvailable(): boolean {
  return typeof window !== 'undefined' &&
    (window as unknown as { phantom?: { solana?: { isPhantom?: boolean } } })
      .phantom?.solana?.isPhantom === true;
}

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, isRegistered, isResearcher, profile, signOut } = useAuth();
  const { t } = useLocale();
  const location = useLocation();
  const isMobile = useIsMobile();
  const hasPhantom = usePhantomAvailable();
  const isLanding = location.pathname === '/' && !isAuthenticated;

  const navItems = [
    { path: '/encuestas', label: t('nav.surveys'), icon: ClipboardList },
    { path: '/dashboard', label: t('nav.dashboard'), icon: BarChart3 },
    { path: '/perfil', label: t('nav.profile'), icon: User },
    ...(isResearcher
      ? [{ path: '/investigador', label: t('nav.researcher'), icon: FlaskConical }]
      : []),
  ];

  const scrollToDoc = () => {
    document.getElementById('documentacion')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Database className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-[15px] tracking-tight text-foreground">
                MicroBlink
              </span>
            </Link>

            {isLanding && (
              <button
                type="button"
                onClick={scrollToDoc}
                className="hidden text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                {t('nav.documentation')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            {isAuthenticated && isRegistered && profile && (
              <span className="hidden sm:block text-xs text-muted-foreground font-mono truncate max-w-[120px]">
                {profile.wallet_address.slice(0, 4)}...{profile.wallet_address.slice(-4)}
              </span>
            )}
            {isAuthenticated ? (
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-secondary"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('nav.signOut')}</span>
              </button>
            ) : isMobile && !hasPhantom ? (
              <a
                href={`https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}?ref=${encodeURIComponent(window.location.href)}`}
                className="flex items-center gap-1.5 text-xs font-medium text-primary px-3 py-2 rounded-md hover:bg-secondary transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Phantom</span>
              </a>
            ) : (
              <WalletMultiButton />
            )}
          </div>
        </div>
      </header>

      <main
        className={
          isLanding ? 'flex-1 w-full' : 'mx-auto w-full max-w-5xl flex-1 px-4 py-6'
        }
      >
        {children}
      </main>

      {isAuthenticated && isRegistered && (
        <nav className="sticky bottom-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-sm sm:hidden">
          <div className="flex items-center justify-around h-14">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {isAuthenticated && isRegistered && (
        <div className="hidden sm:block fixed left-0 top-14 bottom-0 w-48 border-r border-border/60 bg-background p-3">
          <nav className="flex flex-col gap-1 mt-2">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
