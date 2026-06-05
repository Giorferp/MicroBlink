import { useLocale } from '@/contexts/LocaleProvider';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';

const LOCALES: Locale[] = ['es', 'en'];

export default function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        'flex rounded-lg border border-border/60 bg-secondary/50 p-1 backdrop-blur-sm',
        className
      )}
    >
      {LOCALES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLocale(lang)}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all sm:px-4 sm:py-1.5',
            locale === lang
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
