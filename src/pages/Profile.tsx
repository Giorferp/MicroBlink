import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/contexts/LocaleProvider';
import { translateStoredValue } from '@/lib/i18n';
import { supabase, supabaseUrl, supabaseAnonKey } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import {
  User, MapPin, GraduationCap, Briefcase, Calendar,
  CheckCircle2, Wallet, Copy, Check, Trash2, Loader2, AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const { profile, signOut } = useAuth();
  const { t, locale, dateLocale: dateLoc } = useLocale();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!profile) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ wallet_address: profile.wallet_address }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Error deleting account');
      }

      toast({ title: t('profile.deletedTitle'), description: t('profile.deletedDesc') });
      await signOut();
    } catch (err) {
      toast({
        title: t('profile.deleteError'),
        description: err instanceof Error ? err.message : undefined,
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
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

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-destructive/30 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {t('profile.deleteAccount')}
          </button>
        ) : (
          <div className="mt-6 bg-destructive/5 border border-destructive/20 rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">{t('profile.deleteConfirm')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('profile.deleteWarning')}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('profile.deleteCancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t('profile.deleteConfirmButton')
                )}
              </button>
            </div>
          </div>
        )}

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
