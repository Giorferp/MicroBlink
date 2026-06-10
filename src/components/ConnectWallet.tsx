import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ExternalLink } from 'lucide-react';

function phantomAvailable(): boolean {
  return typeof window !== 'undefined' &&
    (window as unknown as { phantom?: { solana?: { isPhantom?: boolean } } })
      .phantom?.solana?.isPhantom === true;
}

export default function ConnectWallet() {
  const hasPhantom = phantomAvailable();

  const isMobile = typeof navigator !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|Samsung/i.test(
      navigator.userAgent
    );

  if (!isMobile || hasPhantom) {
    return <WalletMultiButton />;
  }

  const dappUrl = window.location.href;
  const universalLink = `https://phantom.app/ul/browse/${encodeURIComponent(dappUrl)}?ref=${encodeURIComponent(dappUrl)}`;

  return (
    <a
      href={universalLink}
      className="flex items-center gap-1.5 text-xs font-medium text-primary px-3 py-2 rounded-md hover:bg-secondary transition-colors w-full justify-center"
    >
      <ExternalLink className="w-3.5 h-3.5" />
      <span>Connect Wallet</span>
    </a>
  );
}
