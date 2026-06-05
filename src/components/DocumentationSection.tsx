import type { LucideIcon } from 'lucide-react';
import {
  Blocks,
  Users,
  ShieldAlert,
  Fingerprint,
  Flag,
  Activity,
  Rocket,
  ChevronRight,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLocale } from '@/contexts/LocaleProvider';
import { cn } from '@/lib/utils';

interface DocItem {
  id: string;
  icon: LucideIcon;
  questionKey: string;
  answerKey: string;
}

interface StatusCard {
  id: string;
  icon: LucideIcon;
  titleKey: string;
  contentKey: string;
  accent: 'primary' | 'accent';
}

const DOC_ITEMS: DocItem[] = [
  { id: 'building', icon: Blocks, questionKey: 'doc.qBuilding', answerKey: 'doc.aBuilding' },
  { id: 'audience', icon: Users, questionKey: 'doc.qAudience', answerKey: 'doc.aAudience' },
  { id: 'problem', icon: ShieldAlert, questionKey: 'doc.qProblem', answerKey: 'doc.aProblem' },
  { id: 'action', icon: Fingerprint, questionKey: 'doc.qAction', answerKey: 'doc.aAction' },
  { id: 'mvp', icon: Flag, questionKey: 'doc.qMvp', answerKey: 'doc.aMvp' },
];

const STATUS_CARDS: StatusCard[] = [
  {
    id: 'status',
    icon: Activity,
    titleKey: 'doc.statusCurrent',
    contentKey: 'doc.statusCurrentText',
    accent: 'primary',
  },
  {
    id: 'next',
    icon: Rocket,
    titleKey: 'doc.statusNext',
    contentKey: 'doc.statusNextText',
    accent: 'accent',
  },
];

export default function DocumentationSection() {
  const { t } = useLocale();

  return (
    <section
      id="documentacion"
      className="relative scroll-mt-20 overflow-hidden py-20 sm:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[320px] w-[320px] rounded-full bg-accent/6 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl sm:mb-14">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ChevronRight className="h-3 w-3" />
            {t('doc.badge')}
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('doc.title')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t('doc.subtitle')}
          </p>
        </div>

        <div className="mb-8 overflow-hidden rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm sm:p-6">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {t('doc.projectLabel')}
          </p>
          <p className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              MicroBlink
            </span>
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm">
          <Accordion type="single" collapsible defaultValue="building" className="px-4 sm:px-6">
            {DOC_ITEMS.map(({ id, icon: Icon, questionKey, answerKey }) => (
              <AccordionItem key={id} value={id} className="border-border/50 last:border-b-0">
                <AccordionTrigger className="group gap-3 py-5 text-left hover:no-underline sm:py-6 [&[data-state=open]]:text-primary">
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-secondary/80 text-primary transition-colors group-data-[state=open]:border-primary/40 group-data-[state=open]:bg-primary/10">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold leading-snug sm:text-base">
                      {t(questionKey)}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-12 text-sm leading-relaxed text-muted-foreground sm:pb-6 sm:text-[15px]">
                  {t(answerKey)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
          {STATUS_CARDS.map(({ id, icon: Icon, titleKey, contentKey, accent }) => (
            <article
              key={id}
              className={cn(
                'group relative overflow-hidden rounded-xl border p-5 transition-colors sm:p-6',
                accent === 'primary'
                  ? 'border-primary/25 bg-primary/5 hover:border-primary/40'
                  : 'border-accent/25 bg-accent/5 hover:border-accent/40'
              )}
            >
              <div
                aria-hidden
                className={cn(
                  'absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-opacity group-hover:opacity-100',
                  accent === 'primary' ? 'bg-primary/15 opacity-60' : 'bg-accent/15 opacity-60'
                )}
              />
              <div className="relative">
                <div className="mb-3 flex items-center gap-2.5">
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                      accent === 'primary'
                        ? 'bg-primary/15 text-primary'
                        : 'bg-accent/15 text-accent'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-display text-sm font-semibold text-foreground sm:text-base">
                    {t(titleKey)}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(contentKey)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
