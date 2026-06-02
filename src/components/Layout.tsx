import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, ClipboardList, User, LogOut, Database } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { path: '/encuestas', label: 'Encuestas', icon: ClipboardList },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/perfil', label: 'Perfil', icon: User },
];

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, isRegistered, profile, signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Database className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-[15px] tracking-tight text-foreground">
              MicroBlink
            </span>
          </Link>

          <div className="flex items-center gap-3">
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
                <span className="hidden sm:inline">Salir</span>
              </button>
            ) : (
              <WalletMultiButton />
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6">
        {children}
      </main>

      {/* Bottom nav for authenticated users */}
      {isAuthenticated && isRegistered && (
        <nav className="sticky bottom-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-sm sm:hidden">
          <div className="flex items-center justify-around h-14">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
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

      {/* Desktop sidebar nav */}
      {isAuthenticated && isRegistered && (
        <div className="hidden sm:block fixed left-0 top-14 bottom-0 w-48 border-r border-border/60 bg-background p-3">
          <nav className="flex flex-col gap-1 mt-2">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
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
