import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/contexts/LocaleProvider';
import { translateStoredValue } from '@/lib/i18n';
import {
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  CheckCircle2,
  Wallet,
  Copy,
  Check,
} from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const { profile } = useAuth();
  const { t, locale, dateLocale: dateLoc } = useLocale();
  const [copied, setCopied] = useState(false);

  if (!profile) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sm:pl-48">
      <div className="max-w-lg mx-auto animate-slide-up">
        <h1 className="text-xl font-display font-bold text-foreground mb-6">{t('profile.title')}</h1>

        <div className="bg-primary rounded-xl p-5 mb-6 text-primary-foreground">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 opacity-80" />
            <span className="text-xs font-medium opacity-80">{t('profile.walletConnected')}</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm truncate flex-1">{profile.wallet_address}</p>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 p-1.5 rounded-md hover:bg-white/10 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 opacity-70" />}
            </button>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-xl divide-y divide-border/60">
          <ProfileRow icon={User} label={t('profile.name')} value={profile.full_name} />
          <ProfileRow icon={Calendar} label={t('profile.ageRange')} value={profile.age_range} />
          <ProfileRow icon={User} label={t('profile.gender')} value={translateStoredValue(profile.gender, locale)} />
          <ProfileRow icon={GraduationCap} label={t('profile.education')} value={translateStoredValue(profile.education_level, locale)} />
          <ProfileRow icon={Briefcase} label={t('profile.occupation')} value={translateStoredValue(profile.occupation, locale)} />
          <ProfileRow icon={MapPin} label={t('profile.municipality')} value={profile.municipality} />
          <ProfileRow icon={MapPin} label={t('profile.state')} value={profile.state} />
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-foreground">{t('profile.gpsVerified')}</span>
            </div>
            {profile.gps_verified_at && (
              <span className="text-xs text-muted-foreground">
                {new Date(profile.gps_verified_at).toLocaleDateString(dateLoc, {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 bg-accent/40 rounded-lg p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">{t('profile.privacyTitle')}</strong>{' '}
            {t('profile.privacyText')}
          </p>
        </div>

        <p className="text-[10px] text-muted-foreground/50 text-center mt-6">
          {t('profile.createdAt', {
            date: new Date(profile.created_at).toLocaleDateString(dateLoc),
          })}
        </p>
      </div>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="px-5 py-4 flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-[11px] text-muted-foreground block">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}
