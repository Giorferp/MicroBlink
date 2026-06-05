import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/contexts/LocaleProvider';
import { translateStoredValue } from '@/lib/i18n';
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
  const { t, locale, dateLocale: dateLoc } = useLocale();
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
        <h1 className="text-xl font-display font-bold text-foreground mb-1">{t('dashboard.title')}</h1>
        <p className="text-sm text-muted-foreground mb-6">{t('dashboard.subtitle')}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon={ClipboardList}
            label={t('dashboard.statCompleted')}
            value={responses.length.toString()}
          />
          <StatCard
            icon={TrendingUp}
            label={t('dashboard.statProgress')}
            value={`${completionRate}%`}
          />
          <StatCard
            icon={Shield}
            label={t('dashboard.statVerified')}
            value={responses.filter(r => r.data_hash).length.toString()}
          />
          <StatCard
            icon={MapPin}
            label={t('dashboard.statLocation')}
            value={profile?.state || '-'}
          />
        </div>

        {/* Profile summary */}
        {profile && (
          <div className="bg-card border border-border/80 rounded-xl p-5 mb-8">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t('dashboard.profileTitle')}
            </h2>
            <div className="grid grid-cols-2 gap-y-2 gap-x-6">
              <ProfileField label={t('profile.name')} value={profile.full_name} />
              <ProfileField label={t('profile.ageRange')} value={profile.age_range} />
              <ProfileField label={t('profile.education')} value={translateStoredValue(profile.education_level, locale)} />
              <ProfileField label={t('profile.occupation')} value={translateStoredValue(profile.occupation, locale)} />
              <ProfileField label={t('profile.municipality')} value={profile.municipality} />
              <ProfileField label={t('profile.state')} value={profile.state} />
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span className="text-[11px] text-green-700 font-medium">{t('dashboard.gpsVerified')}</span>
              {profile.gps_verified_at && (
                <span className="text-[11px] text-muted-foreground ml-1">
                  &middot; {new Date(profile.gps_verified_at).toLocaleDateString(dateLoc)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Response history */}
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {t('dashboard.historyTitle')}
          </h2>

          {responses.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border/80 rounded-xl">
              <BarChart3 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t('dashboard.historyEmpty')}</p>
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
                        {response.surveys?.title || t('dashboard.defaultSurvey')}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(response.submitted_at).toLocaleDateString(dateLoc, {
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
                          {t('dashboard.onChain')}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 font-medium mt-1 block">
                          {t('dashboard.pendingOnChain')}
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