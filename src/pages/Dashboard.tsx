import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import type { SurveyResponse } from '@/lib/types';
import {
  BarChart3,
  ClipboardList,
  CheckCircle2,
  Hash,
  Calendar,
  MapPin,
  Loader2,
  Shield,
  TrendingUp,
} from 'lucide-react';

interface ResponseWithSurvey extends SurveyResponse {
  surveys?: { title: string; category: string } | null;
}

export default function Dashboard() {
  const { session, profile } = useAuth();
  const [responses, setResponses] = useState<ResponseWithSurvey[]>([]);
  const [totalSurveys, setTotalSurveys] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;

      const [respRes, surveyRes] = await Promise.all([
        supabase
          .from('survey_responses')
          .select('*, surveys(title, category)')
          .eq('respondent_id', session.user.id)
          .order('submitted_at', { ascending: false }),
        supabase
          .from('surveys')
          .select('id', { count: 'exact' })
          .eq('is_active', true),
      ]);

      if (respRes.data) setResponses(respRes.data as ResponseWithSurvey[]);
      if (surveyRes.count !== null) setTotalSurveys(surveyRes.count);
      setLoading(false);
    };

    fetchData();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 sm:pl-48">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const completionRate = totalSurveys > 0 ? Math.round((responses.length / totalSurveys) * 100) : 0;

  return (
    <div className="sm:pl-48">
      <div className="max-w-2xl mx-auto animate-slide-up">
        <h1 className="text-xl font-display font-bold text-foreground mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Tu actividad y estadisticas de recoleccion
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon={ClipboardList}
            label="Completadas"
            value={responses.length.toString()}
          />
          <StatCard
            icon={TrendingUp}
            label="Progreso"
            value={`${completionRate}%`}
          />
          <StatCard
            icon={Shield}
            label="Verificadas"
            value={responses.filter(r => r.data_hash).length.toString()}
          />
          <StatCard
            icon={MapPin}
            label="Ubicacion"
            value={profile?.state || '-'}
          />
        </div>

        {/* Profile summary */}
        {profile && (
          <div className="bg-card border border-border/80 rounded-xl p-5 mb-8">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Perfil del encuestador
            </h2>
            <div className="grid grid-cols-2 gap-y-2 gap-x-6">
              <ProfileField label="Nombre" value={profile.full_name} />
              <ProfileField label="Edad" value={profile.age_range} />
              <ProfileField label="Educacion" value={profile.education_level} />
              <ProfileField label="Ocupacion" value={profile.occupation} />
              <ProfileField label="Municipio" value={profile.municipality} />
              <ProfileField label="Estado" value={profile.state} />
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span className="text-[11px] text-green-700 font-medium">GPS verificado</span>
              {profile.gps_verified_at && (
                <span className="text-[11px] text-muted-foreground ml-1">
                  &middot; {new Date(profile.gps_verified_at).toLocaleDateString('es-MX')}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Response history */}
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Historial de respuestas
          </h2>

          {responses.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border/80 rounded-xl">
              <BarChart3 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aun no has completado ninguna encuesta</p>
            </div>
          ) : (
            <div className="space-y-2">
              {responses.map(response => (
                <div
                  key={response.id}
                  className="bg-card border border-border/80 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {response.surveys?.title || 'Encuesta'}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(response.submitted_at).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {response.municipality}, {response.state}
                        </span>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  </div>

                  {response.data_hash && (
                    <div className="mt-3 pt-3 border-t border-border/60">
                      <div className="flex items-center gap-1.5">
                        <Hash className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-mono text-muted-foreground truncate">
                          {response.data_hash.slice(0, 16)}...{response.data_hash.slice(-16)}
                        </span>
                      </div>
                      {response.solana_tx_signature ? (
                        <span className="text-[10px] text-green-600 font-medium mt-1 block">
                          Verificado on-chain
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 font-medium mt-1 block">
                          Pendiente verificacion on-chain
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof BarChart3; label: string; value: string }) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-4">
      <Icon className="w-4 h-4 text-primary mb-2" />
      <p className="text-lg font-display font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <p className="text-xs font-medium text-foreground truncate">{value}</p>
    </div>
  );
}