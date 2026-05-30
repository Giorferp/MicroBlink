import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useGeolocation } from '@/hooks/useGeolocation';
import { hashResponseData } from '@/lib/hashUtils';
import { useToast } from '@/hooks/use-toast';
import type { Survey, SurveyQuestion } from '@/lib/types';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Send,
  Shield,
  Hash,
} from 'lucide-react';

export default function SurveyResponse() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const { requestLocation } = useGeolocation();
  const { toast } = useToast();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dataHash, setDataHash] = useState('');

  useEffect(() => {
    const fetchSurvey = async () => {
      if (!id) return;
      const { data } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      setSurvey(data as Survey | null);
      setLoading(false);
    };
    fetchSurvey();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 sm:pl-48">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="sm:pl-48 text-center py-20">
        <p className="text-sm text-muted-foreground">Encuesta no encontrada</p>
      </div>
    );
  }

  const questions = survey.questions;
  const question = questions[currentQ];
  const totalQ = questions.length;
  const progress = ((currentQ + 1) / totalQ) * 100;
  const currentAnswer = answers[question?.id];
  const isLastQuestion = currentQ === totalQ - 1;
  const allAnswered = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== '');

  const setAnswer = (value: string | number) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const handleSubmit = async () => {
    if (!session?.user?.id || !profile) return;

    setSubmitting(true);
    try {
      // Get current location for the response
      const geo = await requestLocation();
      const now = new Date().toISOString();

      // Generate data hash for on-chain integrity
      const hash = await hashResponseData(answers, session.user.id, survey.id, now);
      setDataHash(hash);

      const { error } = await supabase.from('survey_responses').insert({
        survey_id: survey.id,
        respondent_id: session.user.id,
        answers,
        data_hash: hash,
        municipality: geo?.municipality || profile.municipality,
        state: geo?.state || profile.state,
        submitted_at: now,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: 'Respuestas enviadas',
        description: 'Tus datos han sido registrados con hash de integridad.',
      });
    } catch (err) {
      toast({
        title: 'Error al enviar',
        description: err instanceof Error ? err.message : 'Intenta de nuevo',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="sm:pl-48">
        <div className="max-w-lg mx-auto py-12 animate-scale-in">
          <div className="bg-card border border-border/80 rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-lg font-display font-bold text-foreground mb-1">
              Respuestas registradas
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tus datos han sido almacenados con un hash de integridad que sera verificable on-chain.
            </p>

            {dataHash && (
              <div className="bg-secondary/50 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-1.5 justify-center mb-1">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Hash SHA-256
                  </span>
                </div>
                <p className="text-[11px] font-mono text-foreground break-all leading-relaxed">
                  {dataHash}
                </p>
              </div>
            )}

            <button
              onClick={() => navigate('/encuestas')}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Volver a encuestas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:pl-48">
      <div className="max-w-lg mx-auto animate-slide-up">
        {/* Header */}
        <button
          onClick={() => navigate('/encuestas')}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <div className="mb-6">
          <h1 className="text-lg font-display font-bold text-foreground">{survey.title}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Pregunta {currentQ + 1} de {totalQ}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-border rounded-full h-1.5 mb-8 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className="bg-card border border-border/80 rounded-xl p-6 mb-6 min-h-[280px] flex flex-col">
          <p className="text-sm font-medium text-foreground mb-5 leading-relaxed">
            {question.text}
          </p>

          <div className="flex-1">
            <QuestionInput
              question={question}
              value={currentAnswer}
              onChange={setAnswer}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
            disabled={currentQ === 0}
            className="flex items-center gap-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <div className="flex-1" />

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Enviar respuestas
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQ(prev => Math.min(totalQ - 1, prev + 1))}
              disabled={currentAnswer === undefined || currentAnswer === ''}
              className="flex items-center gap-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: SurveyQuestion;
  value: string | number | undefined;
  onChange: (v: string | number) => void;
}) {
  switch (question.type) {
    case 'select':
      return (
        <div className="space-y-2">
          {question.options?.map(option => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                value === option
                  ? 'border-primary bg-accent text-accent-foreground font-medium'
                  : 'border-border/80 hover:border-primary/30 hover:bg-secondary/50 text-foreground'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      );

    case 'scale':
      return (
        <div className="space-y-2">
          {question.options?.map((option, i) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center gap-3 ${
                value === option
                  ? 'border-primary bg-accent text-accent-foreground font-medium'
                  : 'border-border/80 hover:border-primary/30 hover:bg-secondary/50 text-foreground'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${
                value === option ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
                {i + 1}
              </span>
              {option}
            </button>
          ))}
        </div>
      );

    case 'number':
      return (
        <input
          type="number"
          value={value ?? ''}
          onChange={e => onChange(e.target.value ? Number(e.target.value) : '')}
          placeholder="Ingresa un numero"
          className="w-full px-4 py-3 border border-border/80 rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
        />
      );

    case 'text':
      return (
        <textarea
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder="Escribe tu respuesta..."
          rows={4}
          className="w-full px-4 py-3 border border-border/80 rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors resize-none"
        />
      );

    default:
      return null;
  }
}
