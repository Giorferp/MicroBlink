import { Smartphone, ExternalLink } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleProvider';

/**
 * On regular mobile browsers (Chrome/Safari), `window.phantom` is never
 * injected, so PhantomWalletAdapter.readyState === "NotDetected" and
 * clicking it triggers window.open('https://phantom.app') — the download page.
 *
 * The correct solution is Phantom Universal Links:
 *   https://phantom.app/ul/browse/{encodedDappUrl}?ref={encodedDappUrl}
 *
 * This opens the dApp inside Phantom's in-app browser where window.phantom
 * IS injected, making the standard PhantomWalletAdapter work normally.
 */
export default function MobileWalletConnect() {
  const { t } = useLocale();

  // Current URL to reopen inside Phantom's browser
  const currentUrl = encodeURIComponent(window.location.href);
  const phantomUniversalLink = `https://phantom.app/ul/browse/${currentUrl}?ref=${currentUrl}`;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <Smartphone className="w-8 h-8 text-primary" />
        <p className="text-sm font-medium text-foreground">
          {t('mobile.openInPhantom') ?? 'Abrir en Phantom'}
        </p>
        <p className="text-xs text-muted-foreground max-w-xs">
          {t('mobile.openInPhantomDesc') ??
            'Los browsers móviles no detectan billeteras. Abre la app directamente desde Phantom.'}
        </p>
      </div>

      {/* Primary CTA: open dApp inside Phantom's in-app browser */}
      <a
        href={phantomUniversalLink}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <ExternalLink className="w-4 h-4" />
        {t('mobile.openInPhantomBtn') ?? 'Abrir con Phantom'}
      </a>

      {/* Secondary: manual fallback instructions */}
      <details className="w-full">
        <summary className="text-[11px] text-muted-foreground cursor-pointer text-center">
          {t('mobile.otherWallets') ?? '¿Otra billetera?'}
        </summary>
        <p className="mt-2 text-[11px] text-muted-foreground text-center leading-relaxed">
          {t('mobile.otherWalletsDesc') ??
            'Abre el browser integrado de tu billetera (Solflare, Backpack, etc.) y navega a esta URL manualmente.'}
          <br />
          <span className="font-mono break-all select-all text-foreground/70">
            {window.location.hostname}
          </span>
        </p>
      </details>
    </div>
  );
}
