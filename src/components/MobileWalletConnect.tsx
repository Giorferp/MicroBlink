import { Smartphone, ExternalLink, Copy, CheckCheck } from 'lucide-react';
import { useState } from 'react';

/**
 * Por qué este componente existe:
 * En browsers móviles normales (Chrome, Samsung Internet, Opera, Firefox Mobile),
 * window.phantom NUNCA se inyecta — solo existe dentro del in-app browser de Phantom.
 * Por eso PhantomWalletAdapter.readyState === "NotDetected" y al hacer click
 * la librería llama window.open('https://phantom.app') → página de descarga.
 *
 * Estrategia de enlaces (en orden de prioridad):
 *   1. intent://  → abre Phantom app nativa en Android via Android Intent
 *   2. phantom:// → deep link nativo (iOS + Android)
 *   3. https://phantom.app/ul/browse/ → Universal Link fallback
 */
export default function MobileWalletConnect() {
  const [copied, setCopied] = useState(false);

  const dappUrl    = window.location.href;
  const encoded    = encodeURIComponent(dappUrl);
  const hostname   = window.location.hostname;

  // Android Intent URI — abre la app nativa sin pasar por el browser
  // Si Phantom no está instalado, Android redirige a Play Store
  const androidIntent = `intent://browse/${encoded}?ref=${encoded}#Intent;scheme=phantom;package=app.phantom;S.browser_fallback_url=${encodeURIComponent('https://phantom.app/download')};end`;

  // Universal Link funciona en iOS y en browsers que soportan App Links
  const universalLink = `https://phantom.app/ul/browse/${encoded}?ref=${encoded}`;

  // Deep link scheme directo (fallback iOS)
  const phantomScheme = `phantom://browse/${encoded}?ref=${encoded}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(dappUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <Smartphone className="w-8 h-8 text-primary" />
        <p className="text-sm font-medium text-foreground">
          Conectar billetera en móvil
        </p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Los browsers móviles no pueden detectar billeteras directamente.
          Abre la app desde dentro de Phantom.
        </p>
      </div>

      {/* Opción 1: Intent Android (más fiable en Android) */}
      <a
        href={androidIntent}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <ExternalLink className="w-4 h-4" />
        Abrir en Phantom (Android)
      </a>

      {/* Opción 2: Universal Link (iOS + Android fallback) */}
      <a
        href={universalLink}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground border border-border rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <ExternalLink className="w-4 h-4" />
        Abrir en Phantom (iOS)
      </a>

      {/* Opción 3: copiar URL y abrir manualmente desde Phantom */}
      <div className="w-full border border-border rounded-lg p-3 flex flex-col gap-2">
        <p className="text-[11px] text-muted-foreground text-center">
          Si los botones no abren Phantom, copia esta URL, abre el{' '}
          <strong>browser de Phantom</strong> y pégala ahí:
        </p>
        <div className="flex items-center gap-2 bg-muted rounded px-3 py-2">
          <span className="font-mono text-[11px] text-foreground/80 flex-1 truncate">
            {hostname}
          </span>
          <button
            onClick={copyUrl}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <CheckCheck className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
