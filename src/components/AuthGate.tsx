import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/contexts/LocaleProvider';
import { Database, Shield, MapPin, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import MobileWalletConnect from '@/components/MobileWalletConnect';
import { useIsMobile } from '@/hooks/useIsMobile';

function usePhantomAvailable(): boolean {
  return typeof window !== 'undefined' &&
    (window as unknown as { phantom?: { solana?: { isPhantom?: boolean } } })
      .phantom?.solana?.isPhantom === true;
}

export default function AuthGate() {
  const { connected, isAuthenticated, authLoading, authError, signIn } = useAuth();
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const hasPhantom = usePhantomAvailable();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch {
      // Error is already captured in authError state
    }
  };

  const featurePills = [
    { icon: Shield, label: t('auth.pillOnChain') },
    { icon: MapPin, label: t('auth.pillGps') },
    { icon: Database, label: t('auth.pillData') },
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Database className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            MicroBlink
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 text-center max-w-xs">
            {t('auth.tagline')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {featurePills.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/60 text-accent-foreground text-xs font-medium"
            >
              <Icon className="w-3 h-3" />
              {label}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-6 shadow-sm">
          {!connected ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground text-center">
                {t('auth.connectWallet')}
              </p>
              {/* Desktop / Phantom in-app browser: standard multi-wallet modal
                  Mobile (no Phantom): deep links to open dApp inside Phantom */}
              {isMobile && !hasPhantom ? <MobileWalletConnect /> : <WalletMultiButton />}
              <p className="text-[11px] text-muted-foreground/70 text-center">
                {t('auth.walletCompat')}
              </p>
            </div>
          ) : !isAuthenticated ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-1">
                  {t('auth.walletConnected')}
                </p>
                <p className="text-xs text-muted-foreground">{t('auth.signMessage')}</p>
              </div>

              {authError && (
                <div className="w-full flex items-start gap-2 px-3 py-2.5 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive">{authError}</p>
                </div>
              )}

              <button
                onClick={handleSignIn}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {t('auth.signIn')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <a
            href="#documentacion"
            className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            {t('auth.viewDocs')}
          </a>
          <p className="text-[10px] text-muted-foreground/50 text-center">{t('auth.beta')}</p>
        </div>
      </div>
    </div>
  );
}
