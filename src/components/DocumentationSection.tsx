import { useState } from 'react';
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
import { cn } from '@/lib/utils';

type Locale = 'es' | 'en';

interface DocItem {
  id: string;
  icon: LucideIcon;
  question: Record<Locale, string>;
  answer: Record<Locale, string>;
}

interface StatusCard {
  id: string;
  icon: LucideIcon;
  title: Record<Locale, string>;
  content: Record<Locale, string>;
  accent: 'primary' | 'accent';
}

const DOC_ITEMS: DocItem[] = [
  {
    id: 'building',
    icon: Blocks,
    question: {
      es: '¿Qué estamos construyendo?',
      en: 'What are we building?',
    },
    answer: {
      es: 'Una dApp descentralizada enfocada en la recolección de datos macroeconómicos y demográficos. El núcleo técnico emplea cNFTs como credenciales demográficas para verificar la identidad sin comprometer la privacidad. Se apoya en Solana Actions y Blinks para distribuir los cuestionarios y permitir la interacción directa desde redes sociales.',
      en: 'A decentralized dApp focused on collecting macroeconomic and demographic data. The technical core uses cNFTs as demographic credentials to verify identity without compromising privacy. It leverages Solana Actions and Blinks to distribute questionnaires and enable direct interaction from social media.',
    },
  },
  {
    id: 'audience',
    icon: Users,
    question: {
      es: '¿Para quién es?',
      en: 'Who is it for?',
    },
    answer: {
      es: 'Para investigadores, instituciones y organizaciones que requieren conjuntos de datos estadísticos de alta pureza y verificables. Del otro lado, es para usuarios dispuestos a compartir su información económica a través de un canal seguro y anónimo que no requiere contraseñas tradicionales.',
      en: 'For researchers, institutions, and organizations that require high-purity, verifiable statistical datasets. On the other side, it is for users willing to share their economic information through a secure, anonymous channel that does not require traditional passwords.',
    },
  },
  {
    id: 'problem',
    icon: ShieldAlert,
    question: {
      es: '¿Qué problema resuelve?',
      en: 'What problem does it solve?',
    },
    answer: {
      es: 'La manipulación de datos en encuestas y la vulnerabilidad a ataques Sybil (donde un usuario falsifica múltiples identidades para alterar los resultados). Al generar un hash criptográfico de las respuestas y validarlo on-chain, se crea una pista inmutable de auditoría. Además, resuelve la ineficiencia de almacenamiento en blockchain mediante el uso de identificadores numéricos en lugar de texto plano.',
      en: 'Data manipulation in surveys and vulnerability to Sybil attacks (where a user fakes multiple identities to skew results). By generating a cryptographic hash of responses and validating it on-chain, an immutable audit trail is created. It also solves blockchain storage inefficiency by using numeric identifiers instead of plain text.',
    },
  },
  {
    id: 'action',
    icon: Fingerprint,
    question: {
      es: '¿Cuál es la acción principal de la app?',
      en: 'What is the main action of the app?',
    },
    answer: {
      es: 'La captura de respuestas estructuradas vinculadas a una verificación geográfica aproximada (municipio y estado), culminando en el sellado criptográfico (hash SHA-256) de dicha información en la red de Solana.',
      en: 'Capturing structured responses linked to approximate geographic verification (municipality and state), culminating in the cryptographic sealing (SHA-256 hash) of that information on the Solana network.',
    },
  },
  {
    id: 'mvp',
    icon: Flag,
    question: {
      es: '¿Cuál es la versión mínima que vamos a terminar?',
      en: 'What is the minimum version we will deliver?',
    },
    answer: {
      es: 'Un flujo cerrado en Solana Devnet donde un usuario puede: autenticarse mediante su wallet Web3, superar la verificación de ubicación, completar un cuestionario base, obtener su cNFT como credencial de participación y registrar el hash de sus respuestas de forma inmutable en la base de datos (Supabase) y en la blockchain.',
      en: 'A closed flow on Solana Devnet where a user can: authenticate via their Web3 wallet, pass location verification, complete a base questionnaire, obtain their cNFT as a participation credential, and immutably register the hash of their responses in the database (Supabase) and on the blockchain.',
    },
  },
];

const STATUS_CARDS: StatusCard[] = [
  {
    id: 'status',
    icon: Activity,
    title: { es: 'Estado actual', en: 'Current status' },
    content: {
      es: 'Desarrollo activo de la arquitectura en React/Vite y Supabase. Se están realizando ajustes de infraestructura y configuración de entorno para estabilizar el paso a producción, solucionando los errores recientes de despliegue en plataformas como Vercel.',
      en: 'Active development of the React/Vite and Supabase architecture. Infrastructure and environment configuration adjustments are underway to stabilize the move to production, addressing recent deployment errors on platforms such as Vercel.',
    },
    accent: 'primary',
  },
  {
    id: 'next',
    icon: Rocket,
    title: { es: 'Próximos pasos', en: 'Next steps' },
    content: {
      es: 'Consolidar el despliegue exitoso de la aplicación web, perfeccionar la distribución masiva de encuestas mediante la integración total de los Blinks, y estructurar la integración de agentes inteligentes para el procesamiento y análisis de los datos recolectados.',
      en: 'Consolidate successful web app deployment, refine mass survey distribution through full Blinks integration, and structure the integration of intelligent agents for processing and analyzing collected data.',
    },
    accent: 'accent',
  },
];

const UI_TEXT = {
  badge: { es: 'Sobre el proyecto', en: 'About the project' },
  title: { es: 'Documentación', en: 'Documentation' },
  subtitle: {
    es: 'Arquitectura, propósito y hoja de ruta de MicroBlink — una dApp de integridad de datos sobre Solana.',
    en: 'Architecture, purpose, and roadmap of MicroBlink — a data-integrity dApp on Solana.',
  },
  projectLabel: { es: 'Nombre del proyecto', en: 'Project name' },
  projectName: 'MicroBlink',
  langEs: 'ES',
  langEn: 'EN',
};

export default function DocumentationSection() {
  const [locale, setLocale] = useState<Locale>('es');

  return (
    <section
      id="documentacion"
      className="relative scroll-mt-20 overflow-hidden py-20 sm:py-28"
    >
      {/* Background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
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
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ChevronRight className="h-3 w-3" />
              {UI_TEXT.badge[locale]}
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {UI_TEXT.title[locale]}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {UI_TEXT.subtitle[locale]}
            </p>
          </div>

          {/* Language toggle */}
          <div
            role="group"
            aria-label="Language"
            className="flex shrink-0 self-start rounded-lg border border-border/60 bg-secondary/50 p-1 backdrop-blur-sm sm:self-auto"
          >
            {(['es', 'en'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLocale(lang)}
                className={cn(
                  'rounded-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all',
                  locale === lang
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {lang === 'es' ? UI_TEXT.langEs : UI_TEXT.langEn}
              </button>
            ))}
          </div>
        </div>

        {/* Project name card */}
        <div className="mb-8 overflow-hidden rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm sm:p-6">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {UI_TEXT.projectLabel[locale]}
          </p>
          <p className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              {UI_TEXT.projectName}
            </span>
          </p>
        </div>

        {/* Accordion */}
        <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm">
          <Accordion
            type="single"
            collapsible
            defaultValue="building"
            className="px-4 sm:px-6"
          >
            {DOC_ITEMS.map(({ id, icon: Icon, question, answer }) => (
              <AccordionItem
                key={id}
                value={id}
                className="border-border/50 last:border-b-0"
              >
                <AccordionTrigger className="group gap-3 py-5 text-left hover:no-underline sm:py-6 [&[data-state=open]]:text-primary">
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-secondary/80 text-primary transition-colors group-data-[state=open]:border-primary/40 group-data-[state=open]:bg-primary/10">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold leading-snug sm:text-base">
                      {question[locale]}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-12 text-sm leading-relaxed text-muted-foreground sm:pb-6 sm:text-[15px]">
                  {answer[locale]}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Status cards grid */}
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
          {STATUS_CARDS.map(({ id, icon: Icon, title, content, accent }) => (
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
                    {title[locale]}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {content[locale]}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
