import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import type { Survey, SurveyResponse } from '@/lib/types';
import {
  ClipboardList,
  Clock,
  ChevronRight,
  CheckCircle2,
  BarChart3,
  Briefcase,
  Loader2,
  Zap,
} from 'lucide-react';

const CATEGORY_META: Record<string, { icon: typeof BarChart3; color: string }> = {
  ingreso: { icon: BarChart3, color: 'text-emerald-600' },
  empleo: { icon: Briefcase, color: 'text-blue-600' },
  servicios: { icon: Zap, color: 'text-amber-600' },
};

export default function Surveys() {
  const { session } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [surveyRes, responseRes] = await Promise.all([
        supabase.from('surveys').select('*').eq('is_active', true).order('created_at'),
        session?.user?.id
          ? supabase.from('survey_responses').select('survey_id').eq('respondent_id', session.user.id)
          : Promise.resolve({ data: [] }),
      ]);

      if (surveyRes.data) setSurveys(surveyRes.data as Survey[]);
      if (responseRes.data) {
        const ids = new Set((responseRes.data as Pick<SurveyResponse, 'survey_id'>[]).map(r => r.survey_id));
        setCompletedIds(ids);
      }
      setLoading(false);
    };

    fetchData();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const pending = surveys.filter(s => !completedIds.has(s.id));
  const completed = surveys.filter(s => completedIds.has(s.id));

  return (
    <div className="sm:pl-48">
      <div className="max-w-2xl mx-auto animate-slide-up">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-display font-bold text-foreground">Encuestas disponibles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pending.length} pendiente{pending.length !== 1 ? 's' : ''} &middot; {completed.length} completada{completed.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-6 p-3 bg-accent/40 rounded-lg">
          <div className="flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground">{surveys.length} total</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex-1 bg-border rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${surveys.length ? (completed.length / surveys.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {surveys.length ? Math.round((completed.length / surveys.length) * 100) : 0}%
          </span>
        </div>

        {/* Pending surveys */}
        {pending.length > 0 && (
          <div className="space-y-3 mb-8">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pendientes
            </h2>
            {pending.map(survey => (
              <SurveyCard key={survey.id} survey={survey} completed={false} />
            ))}
          </div>
        )}

        {/* Completed surveys */}
        {completed.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Completadas
            </h2>
            {completed.map(survey => (
              <SurveyCard key={survey.id} survey={survey} completed={true} />
            ))}
          </div>
        )}

        {surveys.length === 0 && (
          <div className="text-center py-16">
            <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No hay encuestas disponibles en este momento</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SurveyCard({ survey, completed }: { survey: Survey; completed: boolean }) {
  const meta = CATEGORY_META[survey.category] || { icon: ClipboardList, color: 'text-muted-foreground' };
  const Icon = meta.icon;

  return (
    <Link
      to={completed ? '#' : `/encuestas/${survey.id}`}
      className={`block bg-card border border-border/80 rounded-xl p-4 transition-all ${
        completed
          ? 'opacity-60 cursor-default'
          : 'hover:border-primary/30 hover:shadow-sm cursor-pointer'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 ${meta.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground truncate">{survey.title}</h3>
            {completed && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{survey.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              ~{survey.estimated_minutes} min
            </span>
            <span className="text-[11px] text-muted-foreground">
              {survey.questions.length} preguntas
            </span>
            <span className="text-[11px] px-1.5 py-0.5 bg-secondary rounded text-muted-foreground capitalize">
              {survey.category}
            </span>
          </div>
        </div>
        {!completed && <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />}
      </div>
    </Link>
  );
}
