import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLocale } from '@/contexts/LocaleProvider';
import { useToast } from '@/hooks/use-toast';
import type { Survey } from '@/lib/types';
import {
  aggregateQuestion,
  exportResponsesCsv,
  type ResponseWithProfile,
} from '@/lib/researcherUtils';
import { getDialBlinkUrl, getSurveyActionUrl } from '@/lib/blinkUtils';
import {
  BarChart3,
  ClipboardList,
  Copy,
  Download,
  ExternalLink,
  Link2,
  Loader2,
  MapPin,
  Save,
  Users,
} from 'lucide-react';

interface SurveyWithCount extends Survey {
  response_count: number;
}

export default function ResearcherDashboard() {
  const { t } = useLocale();
  const { toast } = useToast();

  const [surveys, setSurveys] = useState<SurveyWithCount[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [responses, setResponses] = useState<ResponseWithProfile[]>([]);
  const [incentiveDraft, setIncentiveDraft] = useState('');
  const [savingIncentive, setSavingIncentive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const selectedSurvey = surveys.find(s => s.id === selectedId) ?? null;
  const totalResponses = surveys.reduce((sum, s) => sum + s.response_count, 0);

  const fetchSurveys = useCallback(async () => {
    const [surveyRes, responseRes] = await Promise.all([
      supabase.from('surveys').select('*').order('created_at'),
      supabase.from('survey_responses').select('survey_id'),
    ]);

    if (surveyRes.data) {
      const counts = new Map<string, number>();
      for (const r of responseRes.data ?? []) {
        counts.set(r.survey_id, (counts.get(r.survey_id) || 0) + 1);
      }
      const withCounts = (surveyRes.data as Survey[]).map(s => ({
        ...s,
        response_count: counts.get(s.id) || 0,
      }));
      setSurveys(withCounts);
      if (!selectedId && withCounts.length > 0) {
        setSelectedId(withCounts[0].id);
      }
    }
    setLoading(false);
  }, [selectedId]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  useEffect(() => {
    if (!selectedId) return;

    const loadDetail = async () => {
      setLoadingDetail(true);
      const { data } = await supabase
        .from('survey_responses')
        .select(
          '*, profiles(age_range, gender, education_level, occupation, municipality, state)'
        )
        .eq('survey_id', selectedId)
        .order('submitted_at', { ascending: false });

      setResponses((data as ResponseWithProfile[]) ?? []);
      const survey = surveys.find(s => s.id === selectedId);
      setIncentiveDraft(survey?.incentive_description ?? '');
      setLoadingDetail(false);
    };

    loadDetail();
  }, [selectedId, surveys]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: t('researcher.copied'), description: label });
    } catch {
      toast({ title: t('researcher.copyError'), variant: 'destructive' });
    }
  };

  const saveIncentive = async () => {
    if (!selectedId) return;
    setSavingIncentive(true);
    const { error } = await supabase
      .from('surveys')
      .update({ incentive_description: incentiveDraft.trim() })
      .eq('id', selectedId);

    if (error) {
      toast({ title: t('researcher.saveError'), description: error.message, variant: 'destructive' });
    } else {
      setSurveys(prev =>
        prev.map(s => (s.id === selectedId ? { ...s, incentive_description: incentiveDraft.trim() } : s))
      );
      toast({ title: t('researcher.incentiveSaved') });
    }
    setSavingIncentive(false);
  };

  const handleExport = () => {
    if (!selectedSurvey) return;
    const slug = selectedSurvey.title.replace(/\s+/g, '_').slice(0, 30);
    exportResponsesCsv(selectedSurvey, responses, `microblink_${slug}.csv`);
    toast({ title: t('researcher.exported') });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 sm:pl-48">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="sm:pl-48">
      <div className="max-w-4xl mx-auto animate-slide-up">
        <h1 className="text-xl font-display font-bold text-foreground mb-1">
          {t('researcher.title')}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">{t('researcher.subtitle')}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          <StatCard icon={ClipboardList} label={t('researcher.statSurveys')} value={surveys.length} />
          <StatCard icon={Users} label={t('researcher.statResponses')} value={totalResponses} />
          <StatCard
            icon={BarChart3}
            label={t('researcher.statActive')}
            value={surveys.filter(s => s.is_active).length}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Survey list */}
          <div className="lg:col-span-2 space-y-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {t('researcher.surveyList')}
            </h2>
            {surveys.map(survey => (
              <button
                key={survey.id}
                type="button"
                onClick={() => setSelectedId(survey.id)}
                className={`w-full text-left bg-card border rounded-xl p-4 transition-colors ${
                  selectedId === survey.id
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border/80 hover:border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{survey.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {survey.response_count} {t('researcher.responses')} · {survey.estimated_minutes} min
                    </p>
                  </div>
                  {!survey.is_active && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                      {t('researcher.inactive')}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Survey detail */}
          <div className="lg:col-span-3">
            {!selectedSurvey ? (
              <p className="text-sm text-muted-foreground">{t('researcher.selectSurvey')}</p>
            ) : loadingDetail ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-card border border-border/80 rounded-xl p-5">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {selectedSurvey.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">{selectedSurvey.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      type="button"
                      onClick={handleExport}
                      disabled={responses.length === 0}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {t('researcher.exportCsv')}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(getSurveyActionUrl(selectedSurvey.id), t('researcher.blinkUrl'))
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-secondary"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      {t('researcher.copyBlink')}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(getDialBlinkUrl(selectedSurvey.id), t('researcher.dialUrl'))
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-secondary"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {t('researcher.copyDial')}
                    </button>
                    <a
                      href={getDialBlinkUrl(selectedSurvey.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-secondary"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {t('researcher.previewBlink')}
                    </a>
                  </div>

                  {/* Incentive (researcher-defined, no on-chain payment) */}
                  <div className="border-t border-border/60 pt-4">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {t('researcher.incentiveLabel')}
                    </label>
                    <p className="text-[11px] text-muted-foreground mt-1 mb-2">
                      {t('researcher.incentiveHint')}
                    </p>
                    <textarea
                      value={incentiveDraft}
                      onChange={e => setIncentiveDraft(e.target.value)}
                      placeholder={t('researcher.incentivePlaceholder')}
                      rows={2}
                      className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      type="button"
                      onClick={saveIncentive}
                      disabled={savingIncentive}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50"
                    >
                      {savingIncentive ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      {t('researcher.saveIncentive')}
                    </button>
                  </div>
                </div>

                {/* Geographic breakdown */}
                {responses.length > 0 && (
                  <div className="bg-card border border-border/80 rounded-xl p-5">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {t('researcher.geoBreakdown')}
                    </h4>
                    <div className="space-y-2">
                      {topStates(responses).map(({ state, count, percent }) => (
                        <div key={state}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-foreground">{state}</span>
                            <span className="text-muted-foreground">
                              {count} ({percent}%)
                            </span>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question aggregations */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t('researcher.questionStats')}
                  </h4>
                  {responses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t('researcher.noResponses')}</p>
                  ) : (
                    selectedSurvey.questions.map(q => {
                      const agg = aggregateQuestion(q, responses);
                      return (
                        <div
                          key={q.id}
                          className="bg-card border border-border/80 rounded-xl p-4"
                        >
                          <p className="text-sm font-medium text-foreground mb-3">{q.text}</p>
                          {agg.numericSummary ? (
                            <p className="text-xs text-muted-foreground">
                              Min: {agg.numericSummary.min} · Max: {agg.numericSummary.max} ·{' '}
                              {t('researcher.avg')}: {agg.numericSummary.avg}
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {agg.distribution.map(d => (
                                <div key={d.label}>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-foreground truncate pr-2">{d.label}</span>
                                    <span className="text-muted-foreground shrink-0">
                                      {d.count} ({d.percent}%)
                                    </span>
                                  </div>
                                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary/70 rounded-full"
                                      style={{ width: `${d.percent}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BarChart3;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-4">
      <Icon className="w-4 h-4 text-primary mb-2" />
      <p className="text-lg font-display font-bold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function topStates(responses: ResponseWithProfile[]) {
  const counts = new Map<string, number>();
  for (const r of responses) {
    const state = r.state || r.profiles?.state || '—';
    counts.set(state, (counts.get(state) || 0) + 1);
  }
  const total = responses.length || 1;
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([state, count]) => ({
      state,
      count,
      percent: Math.round((count / total) * 100),
    }));
}
