import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useGeolocation } from '@/hooks/useGeolocation';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
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
} from 'lucide-react';

const AGE_RANGES = [
  '18-24', '25-34', '35-44', '45-54', '55-64', '65+',
];

const GENDERS = ['Masculino', 'Femenino', 'No binario', 'Prefiero no decir'];

const EDUCATION_LEVELS = [
  'Sin educación formal',
  'Primaria',
  'Secundaria',
  'Preparatoria / Bachillerato',
  'Licenciatura / Ingeniería',
  'Posgrado (Maestría / Doctorado)',
];

const OCCUPATIONS = [
  'Empleado(a)',
  'Trabajador(a) independiente',
  'Empresario(a)',
  'Estudiante',
  'Jubilado(a) / Pensionado(a)',
  'Desempleado(a)',
  'Labores del hogar',
  'Otro',
];

type Step = 'personal' | 'location' | 'confirm';

export default function Register() {
  const navigate = useNavigate();
  const { session, publicKey, refreshProfile } = useAuth();
  const { location: geoLocation, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('personal');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    age_range: '',
    gender: '',
    education_level: '',
    occupation: '',
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isPersonalComplete = form.full_name && form.age_range && form.gender && form.education_level && form.occupation;
  const isLocationVerified = !!geoLocation;

  const handleVerifyLocation = async () => {
    await requestLocation();
  };

  const handleSubmit = async () => {
    if (!session?.user?.id || !publicKey || !geoLocation) return;

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
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      await refreshProfile();
      toast({
        title: 'Registro exitoso',
        description: 'Tu perfil ha sido creado y verificado.',
      });
      navigate('/encuestas');
    } catch (err) {
      toast({
        title: 'Error al registrar',
        description: err instanceof Error ? err.message : 'Intenta de nuevo',
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
          {(['personal', 'location', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : ((['personal', 'location', 'confirm'] as Step[]).indexOf(step) > i)
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && (
                <div className={`w-12 h-0.5 rounded ${
                  (['personal', 'location', 'confirm'] as Step[]).indexOf(step) > i
                    ? 'bg-primary/40'
                    : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step: Personal */}
        {step === 'personal' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">Datos demograficos</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Esta informacion es necesaria para categorizar tus respuestas
              </p>
            </div>

            <div className="bg-card border border-border/80 rounded-xl p-5 space-y-4">
              <FieldWrapper icon={User} label="Nombre completo">
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => updateField('full_name', e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                />
              </FieldWrapper>

              <FieldWrapper icon={User} label="Rango de edad">
                <select
                  value={form.age_range}
                  onChange={e => updateField('age_range', e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none appearance-none cursor-pointer"
                >
                  <option value="">Selecciona...</option>
                  {AGE_RANGES.map(r => <option key={r} value={r}>{r} anios</option>)}
                </select>
              </FieldWrapper>

              <FieldWrapper icon={User} label="Genero">
                <select
                  value={form.gender}
                  onChange={e => updateField('gender', e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none appearance-none cursor-pointer"
                >
                  <option value="">Selecciona...</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </FieldWrapper>

              <FieldWrapper icon={GraduationCap} label="Nivel educativo">
                <select
                  value={form.education_level}
                  onChange={e => updateField('education_level', e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none appearance-none cursor-pointer"
                >
                  <option value="">Selecciona...</option>
                  {EDUCATION_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </FieldWrapper>

              <FieldWrapper icon={Briefcase} label="Ocupacion">
                <select
                  value={form.occupation}
                  onChange={e => updateField('occupation', e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none appearance-none cursor-pointer"
                >
                  <option value="">Selecciona...</option>
                  {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </FieldWrapper>
            </div>

            <button
              onClick={() => setStep('location')}
              disabled={!isPersonalComplete}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step: Location */}
        {step === 'location' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">Verificacion GPS</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Verificamos tu ubicacion aproximada (municipio y estado) para validar tus datos demograficos
              </p>
            </div>

            <div className="bg-card border border-border/80 rounded-xl p-6">
              {!geoLocation && !geoLoading && !geoError && (
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      Permiso de ubicacion necesario
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                      Solo registramos tu municipio y estado. Las coordenadas exactas no se almacenan.
                    </p>
                  </div>
                  <button
                    onClick={handleVerifyLocation}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <MapPinned className="w-4 h-4" />
                    Verificar ubicacion
                  </button>
                </div>
              )}

              {geoLoading && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Obteniendo ubicacion...</p>
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
                    Reintentar
                  </button>
                </div>
              )}

              {geoLocation && (
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Ubicacion verificada</p>
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
                Atras
              </button>
              <button
                onClick={() => setStep('confirm')}
                disabled={!isLocationVerified}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">Confirmar registro</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Revisa que tu informacion sea correcta
              </p>
            </div>

            <div className="bg-card border border-border/80 rounded-xl divide-y divide-border/60">
              <ConfirmRow label="Nombre" value={form.full_name} />
              <ConfirmRow label="Edad" value={form.age_range} />
              <ConfirmRow label="Genero" value={form.gender} />
              <ConfirmRow label="Educacion" value={form.education_level} />
              <ConfirmRow label="Ocupacion" value={form.occupation} />
              <ConfirmRow label="Municipio" value={geoLocation?.municipality || '-'} />
              <ConfirmRow label="Estado" value={geoLocation?.state || '-'} />
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">GPS Verificado</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('location')}
                className="flex-1 px-4 py-3 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                Atras
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Confirmar y registrar'
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
