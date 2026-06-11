import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLocale } from '@/contexts/LocaleProvider';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import {
  AGE_RANGES,
  getEducationOptions,
  getGenderOptions,
  getOccupationOptions,
  translateStoredValue,
} from '@/lib/i18n';
import {
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  User,
  GraduationCap,
  Briefcase,
  MapPinned,
  FlaskConical,
  Users,
} from 'lucide-react';

type Step = 'role' | 'personal' | 'location' | 'confirm';

export default function Register() {
  const navigate = useNavigate();
  const { session, loading, isRegistered, publicKey, refreshProfile } = useAuth();
  const { location: geoLocation, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
  const { toast } = useToast();
  const { t, locale } = useLocale();

  const genders = getGenderOptions(locale);
  const educationLevels = getEducationOptions(locale);
  const occupations = getOccupationOptions(locale);

  const [step, setStep] = useState<Step>('role');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate('/', { replace: true });
    } else if (isRegistered) {
      navigate('/encuestas', { replace: true });
    }
  }, [loading, session, isRegistered, navigate]);

  const [form, setForm] = useState({
    full_name: '',
    age_range: '',
    gender: '',
    education_level: '',
    occupation: '',
    role: 'participant' as 'participant' | 'researcher',
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isPersonalComplete = form.full_name && form.age_range && form.gender && form.education_level && form.occupation;
  const isLocationVerified = !!geoLocation;

  const handleVerifyLocation = async () => {
    await requestLocation();
  };

  const handleSubmit = async () => {
    console.log("🔵 handleSubmit llamado");
    console.log("  session.user.id:", session?.user?.id ?? 'FALTANTE');
    console.log("  publicKey:", publicKey?.toBase58() ?? 'FALTANTE');
    console.log("  geoLocation:", geoLocation ? '✅ OK' : 'FALTANTE');

    if (!session?.user?.id || !publicKey || !geoLocation) {
      console.error("🔴 Guard falló — abortando envío");
      return;
    }

    console.log("🟢 Guard pasado — iniciando upsert en Supabase...");
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        wallet_address: publicKey.toBase58(),
        full_name: form.full_name,
        age_range: form.age_range,
        gender: form.gender,
        education_level: form.education_level,
        occupation: form.occupation,
        municipality: geoLocation.municipality,
        state: geoLocation.state,
        gps_verified: true,
        gps_verified_at: new Date().toISOString(),
        is_registered: true,
        role: form.role,
        updated_at: new Date().toISOString(),
      });

      console.log("📦 Respuesta de Supabase — error:", error);
      if (error) throw error;

      await refreshProfile();
      toast({
        title: t('register.successTitle'),
        description: t('register.successDesc'),
      });
      navigate('/encuestas');
    } catch (err) {
      console.error("🔴 Error en catch:", err);
      toast({
        title: t('register.errorTitle'),
        description: err instanceof Error ? err.message : t('register.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['role', 'personal', 'location', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : (['role', 'personal', 'location', 'confirm'] as Step[]).indexOf(step) > i
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              {i < 3 && (
                <div className={`w-12 h-0.5 rounded ${
                  (['role', 'personal', 'location', 'confirm'] as Step[]).indexOf(step) > i
                    ? 'bg-primary/40'
                    : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step: Role */}
        {step === 'role' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">{t('register.roleTitle')}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t('register.roleSubtitle')}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { updateField('role', 'participant'); setStep('personal'); }}
                className={`bg-card border-2 rounded-xl p-6 text-center transition-all hover:shadow-sm ${
                  form.role === 'participant'
                    ? 'border-primary bg-primary/5'
                    : 'border-border/80 hover:border-primary/30'
                }`}
              >
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">{t('register.participant')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('register.participantDesc')}</p>
              </button>

              <button
                type="button"
                onClick={() => { updateField('role', 'researcher'); setStep('personal'); }}
                className={`bg-card border-2 rounded-xl p-6 text-center transition-all hover:shadow-sm ${
                  form.role === 'researcher'
                    ? 'border-primary bg-primary/5'
                    : 'border-border/80 hover:border-primary/30'
                }`}
              >
                <FlaskConical className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">{t('register.researcher')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('register.researcherDesc')}</p>
              </button>
            </div>
          </div>
        )}

        {/* Step: Personal */}
        {step === 'personal' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">{t('register.personalTitle')}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t('register.personalSubtitle')}</p>
            </div>

            <div className="bg-card border border-border/80 rounded-xl p-5 space-y-4">
              <FieldWrapper icon={User} label={t('register.fullName')}>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => updateField('full_name', e.target.value)}
                  placeholder={t('register.fullNamePlaceholder')}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                />
              </FieldWrapper>

              <FieldWrapper icon={User} label={t('register.ageRange')}>
                <select
                  value={form.age_range}
                  onChange={e => updateField('age_range', e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none appearance-none cursor-pointer"
                >
                  <option value="">{t('register.select')}</option>
                  {AGE_RANGES.map(r => <option key={r} value={r}>{r} {t('register.years')}</option>)}
                </select>
              </FieldWrapper>

              <FieldWrapper icon={User} label={t('register.gender')}>
                <select
                  value={form.gender}
                  onChange={e => updateField('gender', e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none appearance-none cursor-pointer"
                >
                  <option value="">{t('register.select')}</option>
                  {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </FieldWrapper>

              <FieldWrapper icon={GraduationCap} label={t('register.education')}>
                <select
                  value={form.education_level}
                  onChange={e => updateField('education_level', e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none appearance-none cursor-pointer"
                >
                  <option value="">{t('register.select')}</option>
                  {educationLevels.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
              </FieldWrapper>

              <FieldWrapper icon={Briefcase} label={t('register.occupation')}>
                <select
                  value={form.occupation}
                  onChange={e => updateField('occupation', e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none appearance-none cursor-pointer"
                >
                  <option value="">{t('register.select')}</option>
                  {occupations.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </FieldWrapper>
            </div>

            <button
              onClick={() => setStep('location')}
              disabled={!isPersonalComplete}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('register.next')}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step: Location */}
        {step === 'location' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">{t('register.locationTitle')}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t('register.locationSubtitle')}</p>
            </div>

            <div className="bg-card border border-border/80 rounded-xl p-6">
              {!geoLocation && !geoLoading && !geoError && (
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{t('register.locationNeeded')}</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">{t('register.locationPrivacy')}</p>
                  </div>
                  <button
                    onClick={handleVerifyLocation}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <MapPinned className="w-4 h-4" />
                    {t('register.verifyLocation')}
                  </button>
                </div>
              )}

              {geoLoading && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">{t('register.gettingLocation')}</p>
                </div>
              )}

              {geoError && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <p className="text-sm text-destructive text-center">{geoError}</p>
                  <button
                    onClick={handleVerifyLocation}
                    className="text-sm text-primary hover:underline"
                  >
                    {t('register.retry')}
                  </button>
                </div>
              )}

              {geoLocation && (
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{t('register.locationVerified')}</p>
                    <div className="mt-2 flex items-center gap-2 justify-center">
                      <span className="px-2.5 py-1 bg-accent rounded-md text-xs font-medium text-accent-foreground">
                        {geoLocation.municipality}
                      </span>
                      <span className="px-2.5 py-1 bg-accent rounded-md text-xs font-medium text-accent-foreground">
                        {geoLocation.state}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('personal')}
                className="flex-1 px-4 py-3 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {t('register.back')}
              </button>
              <button
                onClick={() => setStep('confirm')}
                disabled={!isLocationVerified}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('register.next')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">{t('register.confirmTitle')}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t('register.confirmSubtitle')}</p>
            </div>

            <div className="bg-card border border-border/80 rounded-xl divide-y divide-border/60">
              <ConfirmRow label={t('register.name')} value={form.full_name} />
              <ConfirmRow label={t('register.age')} value={form.age_range} />
              <ConfirmRow label={t('register.gender')} value={translateStoredValue(form.gender, locale)} />
              <ConfirmRow label={t('register.education')} value={translateStoredValue(form.education_level, locale)} />
              <ConfirmRow label={t('register.occupation')} value={translateStoredValue(form.occupation, locale)} />
              <ConfirmRow
                label={t('register.role')}
                value={form.role === 'researcher' ? t('register.researcher') : t('register.participant')}
              />
              <ConfirmRow label={t('register.municipality')} value={geoLocation?.municipality || '-'} />
              <ConfirmRow label={t('register.state')} value={geoLocation?.state || '-'} />
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t('register.gpsVerified')}</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('location')}
                className="flex-1 px-4 py-3 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {t('register.back')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t('register.confirmRegister')
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldWrapper({ icon: Icon, label, children }: { icon: typeof User; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
        <Icon className="w-3 h-3" />
        {label}
      </label>
      <div className="px-3 py-2.5 border border-border/80 rounded-lg bg-background">
        {children}
      </div>
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-3 flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
