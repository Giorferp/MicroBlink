import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useLocale } from '@/contexts/LocaleProvider';
import { useToast } from '@/hooks/use-toast';
import type { SurveyQuestion } from '@/lib/types';
import {
  Loader2, Plus, Trash2, ChevronLeft, ChevronRight,
} from 'lucide-react';

const CATEGORIES = ['ingreso', 'empleo', 'servicios'] as const;
const QUESTION_TYPES = ['select', 'number', 'text', 'scale'] as const;

export default function CreateSurvey() {
  const navigate = useNavigate();
  const { t, locale } = useLocale();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('ingreso');
  const [estimatedMinutes, setEstimatedMinutes] = useState(10);
  const [incentive, setIncentive] = useState('');
  const [questions, setQuestions] = useState<SurveyQuestion[]>([
    { id: crypto.randomUUID(), text: '', type: 'text', required: true },
  ]);
  const [saving, setSaving] = useState(false);

  const updateQuestion = (id: string, field: keyof SurveyQuestion, value: unknown) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { id: crypto.randomUUID(), text: '', type: 'text', required: true },
    ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const addOption = (qId: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== qId) return q;
        const options = [...(q.options || []), ''];
        return { ...q, options };
      })
    );
  };

  const updateOption = (qId: string, idx: number, value: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== qId) return q;
        const options = [...(q.options || [])];
        options[idx] = value;
        return { ...q, options };
      })
    );
  };

  const removeOption = (qId: string, idx: number) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== qId) return q;
        const options = (q.options || []).filter((_, i) => i !== idx);
        return { ...q, options };
      })
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: t('createSurvey.missingTitle'), variant: 'destructive' });
      return;
    }
    const validQuestions = questions.filter(q => q.text.trim());
    if (validQuestions.length === 0) {
      toast({ title: t('createSurvey.missingQuestions'), variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('surveys').insert({
        title: title.trim(),
        description: description.trim(),
        category,
        questions: validQuestions,
        is_active: true,
        estimated_minutes: estimatedMinutes,
        incentive_description: incentive.trim(),
      });

      if (error) throw error;

      toast({ title: t('createSurvey.success') });
      navigate('/investigador');
    } catch (err) {
      toast({
        title: t('createSurvey.error'),
        description: err instanceof Error ? err.message : undefined,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sm:pl-48">
      <div className="max-w-3xl mx-auto animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/investigador')}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">
              {t('createSurvey.title')}
            </h1>
            <p className="text-sm text-muted-foreground">{t('createSurvey.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic info */}
          <div className="bg-card border border-border/80 rounded-xl p-5 space-y-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('createSurvey.basicInfo')}
            </h2>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                {t('createSurvey.titleLabel')}
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={t('createSurvey.titlePlaceholder')}
                className="w-full px-3 py-2.5 border border-border/80 rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                {t('createSurvey.descLabel')}
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={t('createSurvey.descPlaceholder')}
                rows={3}
                className="w-full px-3 py-2.5 border border-border/80 rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground/50 outline-none resize-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t('createSurvey.categoryLabel')}
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border/80 rounded-lg bg-background text-sm text-foreground outline-none"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {t(`surveys.categories.${c}` as any)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {t('createSurvey.minutesLabel')}
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={estimatedMinutes}
                  onChange={e => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-border/80 rounded-lg bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                {t('createSurvey.incentiveLabel')}
              </label>
              <textarea
                value={incentive}
                onChange={e => setIncentive(e.target.value)}
                placeholder={t('createSurvey.incentivePlaceholder')}
                rows={2}
                className="w-full px-3 py-2.5 border border-border/80 rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground/50 outline-none resize-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Questions */}
          <div className="bg-card border border-border/80 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('createSurvey.questions')} ({questions.length})
              </h2>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90"
              >
                <Plus className="w-3.5 h-3.5" />
                {t('createSurvey.addQuestion')}
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="border border-border/80 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {t('createSurvey.question')} {idx + 1}
                    </span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(q.id)}
                        className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={q.text}
                    onChange={e => updateQuestion(q.id, 'text', e.target.value)}
                    placeholder={t('createSurvey.questionPlaceholder')}
                    className="w-full px-3 py-2 border border-border/80 rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30"
                  />

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-[11px] text-muted-foreground block mb-1">
                        {t('createSurvey.typeLabel')}
                      </label>
                      <select
                        value={q.type}
                        onChange={e => updateQuestion(q.id, 'type', e.target.value)}
                        className="w-full px-3 py-1.5 border border-border/80 rounded-lg bg-background text-xs text-foreground outline-none"
                      >
                        {QUESTION_TYPES.map(t => (
                          <option key={t} value={t}>
                            {t('createSurvey.type' + t.charAt(0).toUpperCase() + t.slice(1) as any)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <label className="flex items-center gap-1.5 pt-5">
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={e => updateQuestion(q.id, 'required', e.target.checked)}
                        className="rounded border-border"
                      />
                      <span className="text-[11px] text-muted-foreground">
                        {t('createSurvey.required')}
                      </span>
                    </label>
                  </div>

                  {(q.type === 'select') && (
                    <div className="space-y-2">
                      <label className="text-[11px] text-muted-foreground block">
                        {t('createSurvey.options')}
                      </label>
                      {(q.options || ['']).map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt}
                            onChange={e => updateOption(q.id, oi, e.target.value)}
                            placeholder={`${t('createSurvey.option')} ${oi + 1}`}
                            className="flex-1 px-3 py-1.5 border border-border/80 rounded-lg bg-background text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30"
                          />
                          {(q.options || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOption(q.id, oi)}
                              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(q.id)}
                        className="text-xs text-primary hover:underline"
                      >
                        + {t('createSurvey.addOption')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pb-8">
            <button
              onClick={() => navigate('/investigador')}
              className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {t('createSurvey.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {t('createSurvey.publish')}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
