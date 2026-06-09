export type Locale = 'es' | 'en';

export const LOCALE_STORAGE_KEY = 'microblink-locale';

export interface SelectOption {
  value: string;
  label: string;
}

const es = {
  nav: {
    surveys: 'Encuestas',
    dashboard: 'Dashboard',
    profile: 'Perfil',
    researcher: 'Investigador',
    documentation: 'Documentación',
    signOut: 'Salir',
  },
  auth: {
    tagline: 'Plataforma descentralizada de recolección de datos macroeconómicos con integridad verificable',
    pillOnChain: 'Verificable on-chain',
    pillGps: 'GPS verificado',
    pillData: 'Datos de alta pureza',
    connectWallet: 'Conecta tu wallet de Solana para comenzar',
    walletCompat: 'Compatible con Phantom y otras wallets Solana',
    walletConnected: 'Wallet conectada',
    signMessage: 'Firma un mensaje para verificar tu identidad. No se realizará ninguna transacción.',
    signIn: 'Iniciar sesión',
    viewDocs: 'Ver documentación del proyecto ↓',
    beta: 'Beta v0.1 · Solana Devnet · Datos de prueba',
  },
  doc: {
    badge: 'Sobre el proyecto',
    title: 'Documentación',
    subtitle:
      'Arquitectura, propósito y hoja de ruta de MicroBlink — una dApp de integridad de datos sobre Solana.',
    projectLabel: 'Nombre del proyecto',
    statusCurrent: 'Estado actual',
    statusCurrentText:
      'Desarrollo activo de la arquitectura en React/Vite y Supabase. Se están realizando ajustes de infraestructura y configuración de entorno para estabilizar el paso a producción, solucionando los errores recientes de despliegue en plataformas como Vercel.',
    statusNext: 'Próximos pasos',
    statusNextText:
      'Consolidar el despliegue exitoso de la aplicación web, perfeccionar la distribución masiva de encuestas mediante la integración total de los Blinks, y estructurar la integración de agentes inteligentes para el procesamiento y análisis de los datos recolectados.',
    qBuilding: '¿Qué estamos construyendo?',
    aBuilding:
      'Una dApp descentralizada enfocada en la recolección de datos macroeconómicos y demográficos. El núcleo técnico emplea cNFTs como credenciales demográficas para verificar la identidad sin comprometer la privacidad. Se apoya en Solana Actions y Blinks para distribuir los cuestionarios y permitir la interacción directa desde redes sociales.',
    qAudience: '¿Para quién es?',
    aAudience:
      'Para investigadores, instituciones y organizaciones que requieren conjuntos de datos estadísticos de alta pureza y verificables. Del otro lado, es para usuarios dispuestos a compartir su información económica a través de un canal seguro y anónimo que no requiere contraseñas tradicionales.',
    qProblem: '¿Qué problema resuelve?',
    aProblem:
      'La manipulación de datos en encuestas y la vulnerabilidad a ataques Sybil (donde un usuario falsifica múltiples identidades para alterar los resultados). Al generar un hash criptográfico de las respuestas y validarlo on-chain, se crea una pista inmutable de auditoría. Además, resuelve la ineficiencia de almacenamiento en blockchain mediante el uso de identificadores numéricos en lugar de texto plano.',
    qAction: '¿Cuál es la acción principal de la app?',
    aAction:
      'La captura de respuestas estructuradas vinculadas a una verificación geográfica aproximada (municipio y estado), culminando en el sellado criptográfico (hash SHA-256) de dicha información en la red de Solana.',
    qMvp: '¿Cuál es la versión mínima que vamos a terminar?',
    aMvp:
      'Un flujo cerrado en Solana Devnet donde un usuario puede: autenticarse mediante su wallet Web3, superar la verificación de ubicación, completar un cuestionario base, obtener su cNFT como credencial de participación y registrar el hash de sus respuestas de forma inmutable en la base de datos (Supabase) y en la blockchain.',
  },
  register: {
    personalTitle: 'Datos demográficos',
    personalSubtitle: 'Esta información es necesaria para categorizar tus respuestas',
    locationTitle: 'Verificación GPS',
    locationSubtitle:
      'Verificamos tu ubicación aproximada (municipio y estado) para validar tus datos demográficos',
    confirmTitle: 'Confirmar registro',
    confirmSubtitle: 'Revisa que tu información sea correcta',
    fullName: 'Nombre completo',
    fullNamePlaceholder: 'Tu nombre',
    ageRange: 'Rango de edad',
    gender: 'Género',
    education: 'Nivel educativo',
    occupation: 'Ocupación',
    select: 'Selecciona...',
    years: 'años',
    next: 'Siguiente',
    back: 'Atrás',
    locationNeeded: 'Permiso de ubicación necesario',
    locationPrivacy:
      'Solo registramos tu municipio y estado. Las coordenadas exactas no se almacenan.',
    verifyLocation: 'Verificar ubicación',
    gettingLocation: 'Obteniendo ubicación...',
    retry: 'Reintentar',
    locationVerified: 'Ubicación verificada',
    confirmRegister: 'Confirmar y registrar',
    name: 'Nombre',
    age: 'Edad',
    municipality: 'Municipio',
    state: 'Estado',
    gpsVerified: 'GPS Verificado',
    successTitle: 'Registro exitoso',
    successDesc: 'Tu perfil ha sido creado y verificado.',
    errorTitle: 'Error al registrar',
    tryAgain: 'Intenta de nuevo',
  },
  surveys: {
    title: 'Encuestas disponibles',
    pending: 'pendiente',
    pendings: 'pendientes',
    completed: 'completada',
    completeds: 'completadas',
    total: 'total',
    sectionPending: 'Pendientes',
    sectionCompleted: 'Completadas',
    empty: 'No hay encuestas disponibles en este momento',
    questions: 'preguntas',
    categories: {
      ingreso: 'ingreso',
      empleo: 'empleo',
      servicios: 'servicios',
    },
  },
  researcher: {
    title: 'Panel de investigador',
    subtitle: 'Consulta resultados agregados, exporta datos y distribuye encuestas vía Blinks',
    accessDenied: 'Acceso restringido',
    accessDeniedDesc:
      'Tu wallet no tiene rol de investigador. Contacta al administrador para solicitar acceso.',
    statSurveys: 'Encuestas',
    statResponses: 'Respuestas totales',
    statActive: 'Activas',
    surveyList: 'Encuestas',
    responses: 'respuestas',
    inactive: 'Inactiva',
    selectSurvey: 'Selecciona una encuesta para ver detalles',
    exportCsv: 'Exportar CSV',
    copyBlink: 'Copiar URL Blink',
    copyDial: 'Copiar link dial.to',
    blinkUrl: 'URL del Blink',
    dialUrl: 'Link de dial.to',
    previewBlink: 'Vista previa',
    copied: 'Copiado al portapapeles',
    copyError: 'No se pudo copiar',
    incentiveLabel: 'Incentivo para participantes',
    incentiveHint:
      'Texto opcional que verán los participantes. Cada investigador define su propio incentivo (transferencia, sorteo, etc.) — MicroBlink no procesa pagos.',
    incentivePlaceholder: 'Ej: Sorteo de $50 USD entre participantes que completen la encuesta',
    saveIncentive: 'Guardar incentivo',
    incentiveSaved: 'Incentivo actualizado',
    saveError: 'Error al guardar',
    exported: 'Archivo CSV descargado',
    geoBreakdown: 'Distribución geográfica',
    questionStats: 'Resultados por pregunta',
    noResponses: 'Aún no hay respuestas para esta encuesta',
    avg: 'Promedio',
  },
  survey: {
    notFound: 'Encuesta no encontrada',
    incentive: 'Incentivo del investigador',
    back: 'Volver',
    questionOf: 'Pregunta {current} de {total}',
    previous: 'Anterior',
    next: 'Siguiente',
    submit: 'Enviar respuestas',
    numberPlaceholder: 'Ingresa un número',
    textPlaceholder: 'Escribe tu respuesta...',
    submittedTitle: 'Respuestas registradas',
    submittedDesc:
      'Tus datos han sido almacenados con un hash de integridad que será verificable on-chain.',
    hashLabel: 'Hash SHA-256',
    backToSurveys: 'Volver a encuestas',
    toastSuccessTitle: 'Respuestas enviadas',
    toastSuccessDesc: 'Tus datos han sido registrados con hash de integridad.',
    toastErrorTitle: 'Error al enviar',
  },
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Tu actividad y estadísticas de recolección',
    statCompleted: 'Completadas',
    statProgress: 'Progreso',
    statVerified: 'Verificadas',
    statLocation: 'Ubicación',
    profileTitle: 'Perfil del encuestador',
    historyTitle: 'Historial de respuestas',
    historyEmpty: 'Aún no has completado ninguna encuesta',
    defaultSurvey: 'Encuesta',
    onChain: 'Verificado on-chain',
    pendingOnChain: 'Hash registrado (Local)',
    gpsVerified: 'GPS verificado',
  },
  profile: {
    title: 'Mi perfil',
    walletConnected: 'Wallet conectada',
    name: 'Nombre',
    ageRange: 'Rango de edad',
    gender: 'Género',
    education: 'Educación',
    occupation: 'Ocupación',
    municipality: 'Municipio',
    state: 'Estado',
    gpsVerified: 'GPS Verificado',
    privacyTitle: 'Sobre tu privacidad:',
    privacyText:
      'Solo almacenamos tu municipio y estado, nunca las coordenadas GPS exactas. Tus datos demográficos se usan exclusivamente para categorizar las respuestas a encuestas macroeconómicas.',
    createdAt: 'Registro creado el {date}',
  },
  notFound: {
    message: '¡Ups! Página no encontrada',
    home: 'Volver al inicio',
  },
  geo: {
    unavailable: 'Geolocalización no disponible en este navegador',
    ipError: 'Error al consultar geolocalización por IP',
    generic: 'Error al obtener ubicación',
    denied: 'Permiso de ubicación denegado. Habilita el GPS en tu dispositivo.',
    unavailablePosition: 'No se pudo determinar tu ubicación. Verifica tu conexión.',
    timeout: 'La solicitud de ubicación tardó demasiado. Intenta de nuevo.',
    unknown: 'Error desconocido al obtener ubicación.',
    unknownPlace: 'Desconocido',
  },
  common: {
    tryAgain: 'Intenta de nuevo',
  },
} as const;

const en: typeof es = {
  nav: {
    surveys: 'Surveys',
    dashboard: 'Dashboard',
    profile: 'Profile',
    researcher: 'Researcher',
    documentation: 'Documentation',
    signOut: 'Sign out',
  },
  auth: {
    tagline: 'Decentralized platform for macroeconomic data collection with verifiable integrity',
    pillOnChain: 'On-chain verifiable',
    pillGps: 'GPS verified',
    pillData: 'High-purity data',
    connectWallet: 'Connect your Solana wallet to get started',
    walletCompat: 'Compatible with Phantom and other Solana wallets',
    walletConnected: 'Wallet connected',
    signMessage: 'Sign a message to verify your identity. No transaction will be made.',
    signIn: 'Sign in',
    viewDocs: 'View project documentation ↓',
    beta: 'Beta v0.1 · Solana Devnet · Test data',
  },
  doc: {
    badge: 'About the project',
    title: 'Documentation',
    subtitle:
      'Architecture, purpose, and roadmap of MicroBlink — a data-integrity dApp on Solana.',
    projectLabel: 'Project name',
    statusCurrent: 'Current status',
    statusCurrentText:
      'Active development of the React/Vite and Supabase architecture. Infrastructure and environment configuration adjustments are underway to stabilize the move to production, addressing recent deployment errors on platforms such as Vercel.',
    statusNext: 'Next steps',
    statusNextText:
      'Consolidate successful web app deployment, refine mass survey distribution through full Blinks integration, and structure the integration of intelligent agents for processing and analyzing collected data.',
    qBuilding: 'What are we building?',
    aBuilding:
      'A decentralized dApp focused on collecting macroeconomic and demographic data. The technical core uses cNFTs as demographic credentials to verify identity without compromising privacy. It leverages Solana Actions and Blinks to distribute questionnaires and enable direct interaction from social media.',
    qAudience: 'Who is it for?',
    aAudience:
      'For researchers, institutions, and organizations that require high-purity, verifiable statistical datasets. On the other side, it is for users willing to share their economic information through a secure, anonymous channel that does not require traditional passwords.',
    qProblem: 'What problem does it solve?',
    aProblem:
      'Data manipulation in surveys and vulnerability to Sybil attacks (where a user fakes multiple identities to skew results). By generating a cryptographic hash of responses and validating it on-chain, an immutable audit trail is created. It also solves blockchain storage inefficiency by using numeric identifiers instead of plain text.',
    qAction: 'What is the main action of the app?',
    aAction:
      'Capturing structured responses linked to approximate geographic verification (municipality and state), culminating in the cryptographic sealing (SHA-256 hash) of that information on the Solana network.',
    qMvp: 'What is the minimum version we will deliver?',
    aMvp:
      'A closed flow on Solana Devnet where a user can: authenticate via their Web3 wallet, pass location verification, complete a base questionnaire, obtain their cNFT as a participation credential, and immutably register the hash of their responses in the database (Supabase) and on the blockchain.',
  },
  register: {
    personalTitle: 'Demographic data',
    personalSubtitle: 'This information is required to categorize your responses',
    locationTitle: 'GPS verification',
    locationSubtitle:
      'We verify your approximate location (municipality and state) to validate your demographic data',
    confirmTitle: 'Confirm registration',
    confirmSubtitle: 'Review that your information is correct',
    fullName: 'Full name',
    fullNamePlaceholder: 'Your name',
    ageRange: 'Age range',
    gender: 'Gender',
    education: 'Education level',
    occupation: 'Occupation',
    select: 'Select...',
    years: 'years',
    next: 'Next',
    back: 'Back',
    locationNeeded: 'Location permission required',
    locationPrivacy:
      'We only record your municipality and state. Exact coordinates are not stored.',
    verifyLocation: 'Verify location',
    gettingLocation: 'Getting location...',
    retry: 'Retry',
    locationVerified: 'Location verified',
    confirmRegister: 'Confirm and register',
    name: 'Name',
    age: 'Age',
    municipality: 'Municipality',
    state: 'State',
    gpsVerified: 'GPS Verified',
    successTitle: 'Registration successful',
    successDesc: 'Your profile has been created and verified.',
    errorTitle: 'Registration error',
    tryAgain: 'Try again',
  },
  surveys: {
    title: 'Available surveys',
    pending: 'pending',
    pendings: 'pending',
    completed: 'completed',
    completeds: 'completed',
    total: 'total',
    sectionPending: 'Pending',
    sectionCompleted: 'Completed',
    empty: 'No surveys available at this time',
    questions: 'questions',
    categories: {
      ingreso: 'income',
      empleo: 'employment',
      servicios: 'services',
    },
  },
  researcher: {
    title: 'Researcher panel',
    subtitle: 'View aggregated results, export data, and distribute surveys via Blinks',
    accessDenied: 'Access restricted',
    accessDeniedDesc:
      'Your wallet does not have researcher role. Contact the administrator to request access.',
    statSurveys: 'Surveys',
    statResponses: 'Total responses',
    statActive: 'Active',
    surveyList: 'Surveys',
    responses: 'responses',
    inactive: 'Inactive',
    selectSurvey: 'Select a survey to view details',
    exportCsv: 'Export CSV',
    copyBlink: 'Copy Blink URL',
    copyDial: 'Copy dial.to link',
    blinkUrl: 'Blink URL',
    dialUrl: 'dial.to link',
    previewBlink: 'Preview',
    copied: 'Copied to clipboard',
    copyError: 'Could not copy',
    incentiveLabel: 'Participant incentive',
    incentiveHint:
      'Optional text participants will see. Each researcher defines their own incentive (transfer, raffle, etc.) — MicroBlink does not process payments.',
    incentivePlaceholder: 'E.g. $50 USD raffle among participants who complete the survey',
    saveIncentive: 'Save incentive',
    incentiveSaved: 'Incentive updated',
    saveError: 'Error saving',
    exported: 'CSV file downloaded',
    geoBreakdown: 'Geographic distribution',
    questionStats: 'Results by question',
    noResponses: 'No responses for this survey yet',
    avg: 'Average',
  },
  survey: {
    notFound: 'Survey not found',
    incentive: 'Researcher incentive',
    back: 'Back',
    questionOf: 'Question {current} of {total}',
    previous: 'Previous',
    next: 'Next',
    submit: 'Submit responses',
    numberPlaceholder: 'Enter a number',
    textPlaceholder: 'Write your answer...',
    submittedTitle: 'Responses recorded',
    submittedDesc:
      'Your data has been stored with an integrity hash that will be verifiable on-chain.',
    hashLabel: 'SHA-256 Hash',
    backToSurveys: 'Back to surveys',
    toastSuccessTitle: 'Responses submitted',
    toastSuccessDesc: 'Your data has been recorded with an integrity hash.',
    toastErrorTitle: 'Submission error',
  },
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Your activity and collection statistics',
    statCompleted: 'Completed',
    statProgress: 'Progress',
    statVerified: 'Verified',
    statLocation: 'Location',
    profileTitle: 'Respondent profile',
    historyTitle: 'Response history',
    historyEmpty: 'You have not completed any surveys yet',
    defaultSurvey: 'Survey',
    onChain: 'Verified on-chain',
    pendingOnChain: 'Hash registered (Local)',
    gpsVerified: 'GPS verified',
  },
  profile: {
    title: 'My profile',
    walletConnected: 'Wallet connected',
    name: 'Name',
    ageRange: 'Age range',
    gender: 'Gender',
    education: 'Education',
    occupation: 'Occupation',
    municipality: 'Municipality',
    state: 'State',
    gpsVerified: 'GPS Verified',
    privacyTitle: 'About your privacy:',
    privacyText:
      'We only store your municipality and state, never exact GPS coordinates. Your demographic data is used exclusively to categorize responses to macroeconomic surveys.',
    createdAt: 'Registered on {date}',
  },
  notFound: {
    message: 'Oops! Page not found',
    home: 'Return to Home',
  },
  geo: {
    unavailable: 'Geolocation is not available in this browser',
    ipError: 'Error fetching IP geolocation',
    generic: 'Error getting location',
    denied: 'Location permission denied. Enable GPS on your device.',
    unavailablePosition: 'Could not determine your location. Check your connection.',
    timeout: 'Location request timed out. Try again.',
    unknown: 'Unknown error getting location.',
    unknownPlace: 'Unknown',
  },
  common: {
    tryAgain: 'Try again',
  },
};

export const translations = { es, en } as const;

type TranslationTree = typeof es;

export type TranslationKey = {
  [K in keyof TranslationTree]: TranslationTree[K] extends string
    ? K
    : {
        [K2 in keyof TranslationTree[K]]: TranslationTree[K][K2] extends string
          ? `${K & string}.${K2 & string}`
          : {
              [K3 in keyof TranslationTree[K][K2]]: `${K & string}.${K2 & string}.${K3 & string}`;
            }[keyof TranslationTree[K][K2]];
      }[keyof TranslationTree[K]];
}[keyof TranslationTree];

function resolve(obj: Record<string, unknown>, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : path;
}

export function t(locale: Locale, key: string, params?: Record<string, string | number>): string {
  let text = resolve(translations[locale] as unknown as Record<string, unknown>, key);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export function dateLocale(locale: Locale): string {
  return locale === 'es' ? 'es-MX' : 'en-US';
}

const GENDER_OPTIONS = [
  { value: 'Masculino', es: 'Masculino', en: 'Male' },
  { value: 'Femenino', es: 'Femenino', en: 'Female' },
  { value: 'No binario', es: 'No binario', en: 'Non-binary' },
  { value: 'Prefiero no decir', es: 'Prefiero no decir', en: 'Prefer not to say' },
];

const EDUCATION_OPTIONS = [
  { value: 'Sin educación formal', es: 'Sin educación formal', en: 'No formal education' },
  { value: 'Primaria', es: 'Primaria', en: 'Primary school' },
  { value: 'Secundaria', es: 'Secundaria', en: 'Middle school' },
  { value: 'Preparatoria / Bachillerato', es: 'Preparatoria / Bachillerato', en: 'High school' },
  { value: 'Licenciatura / Ingeniería', es: 'Licenciatura / Ingeniería', en: "Bachelor's / Engineering" },
  { value: 'Posgrado (Maestría / Doctorado)', es: 'Posgrado (Maestría / Doctorado)', en: 'Graduate (Master / PhD)' },
];

const OCCUPATION_OPTIONS = [
  { value: 'Empleado(a)', es: 'Empleado(a)', en: 'Employee' },
  { value: 'Trabajador(a) independiente', es: 'Trabajador(a) independiente', en: 'Self-employed' },
  { value: 'Empresario(a)', es: 'Empresario(a)', en: 'Business owner' },
  { value: 'Estudiante', es: 'Estudiante', en: 'Student' },
  { value: 'Jubilado(a) / Pensionado(a)', es: 'Jubilado(a) / Pensionado(a)', en: 'Retired' },
  { value: 'Desempleado(a)', es: 'Desempleado(a)', en: 'Unemployed' },
  { value: 'Labores del hogar', es: 'Labores del hogar', en: 'Homemaker' },
  { value: 'Otro', es: 'Otro', en: 'Other' },
];

export function getGenderOptions(locale: Locale): SelectOption[] {
  return GENDER_OPTIONS.map((o) => ({ value: o.value, label: o[locale] }));
}

export function getEducationOptions(locale: Locale): SelectOption[] {
  return EDUCATION_OPTIONS.map((o) => ({ value: o.value, label: o[locale] }));
}

export function getOccupationOptions(locale: Locale): SelectOption[] {
  return OCCUPATION_OPTIONS.map((o) => ({ value: o.value, label: o[locale] }));
}

const STORED_LABEL_MAPS = [GENDER_OPTIONS, EDUCATION_OPTIONS, OCCUPATION_OPTIONS];

export function translateStoredValue(value: string, locale: Locale): string {
  if (locale === 'es') return value;
  for (const list of STORED_LABEL_MAPS) {
    const match = list.find((o) => o.value === value);
    if (match) return match.en;
  }
  return value;
}

export const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'] as const;
