import type { Profile, Survey, SurveyQuestion, SurveyResponse } from '@/lib/types';

export interface ResponseWithProfile extends SurveyResponse {
  profiles?: Pick<
    Profile,
    'age_range' | 'gender' | 'education_level' | 'occupation' | 'municipality' | 'state'
  > | null;
}

export interface QuestionAggregation {
  questionId: string;
  questionText: string;
  type: SurveyQuestion['type'];
  distribution: { label: string; count: number; percent: number }[];
  numericSummary?: { min: number; max: number; avg: number };
}

export function aggregateQuestion(
  question: SurveyQuestion,
  responses: ResponseWithProfile[]
): QuestionAggregation {
  const base: QuestionAggregation = {
    questionId: question.id,
    questionText: question.text,
    type: question.type,
    distribution: [],
  };

  if (question.type === 'select' && question.options) {
    const counts = new Map<string, number>();
    for (const opt of question.options) counts.set(opt, 0);

    for (const r of responses) {
      const val = r.answers[question.id];
      if (val !== undefined && val !== '') {
        const key = String(val);
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }

    const total = responses.length || 1;
    base.distribution = question.options.map(label => ({
      label,
      count: counts.get(label) || 0,
      percent: Math.round(((counts.get(label) || 0) / total) * 100),
    }));
    return base;
  }

  if (question.type === 'number' || question.type === 'scale') {
    const nums = responses
      .map(r => Number(r.answers[question.id]))
      .filter(n => !Number.isNaN(n));

    if (nums.length > 0) {
      base.numericSummary = {
        min: Math.min(...nums),
        max: Math.max(...nums),
        avg: Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10,
      };
    }
    return base;
  }

  const textCounts = new Map<string, number>();
  for (const r of responses) {
    const val = r.answers[question.id];
    if (val !== undefined && String(val).trim()) {
      const key = String(val).trim();
      textCounts.set(key, (textCounts.get(key) || 0) + 1);
    }
  }

  const total = responses.length || 1;
  base.distribution = [...textCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([label, count]) => ({
      label,
      count,
      percent: Math.round((count / total) * 100),
    }));

  return base;
}

export function exportResponsesCsv(
  survey: Survey,
  responses: ResponseWithProfile[],
  filename: string
): void {
  const headers = [
    'response_id',
    'submitted_at',
    'municipality',
    'state',
    'data_hash',
    'age_range',
    'gender',
    'education_level',
    'occupation',
    ...survey.questions.map(q => q.id),
  ];

  const rows = responses.map(r => [
    r.id,
    r.submitted_at,
    r.municipality,
    r.state,
    r.data_hash,
    r.profiles?.age_range ?? '',
    r.profiles?.gender ?? '',
    r.profiles?.education_level ?? '',
    r.profiles?.occupation ?? '',
    ...survey.questions.map(q => {
      const val = r.answers[q.id];
      return val !== undefined ? String(val) : '';
    }),
  ]);

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map(row => row.map(escape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
