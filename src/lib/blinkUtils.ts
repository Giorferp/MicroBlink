const DIAL_BASE = 'https://dial.to/?action=solana-action:';

export function getSurveyBlinkPath(surveyId: string): string {
  return `/encuesta/${surveyId}`;
}

export function getSurveyActionUrl(surveyId: string, baseUrl?: string): string {
  const origin = (baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')).replace(
    /\/$/,
    ''
  );
  return `${origin}${getSurveyBlinkPath(surveyId)}`;
}

/** Full dial.to URL for sharing on social media */
export function getDialBlinkUrl(surveyId: string, baseUrl?: string): string {
  const actionUrl = getSurveyActionUrl(surveyId, baseUrl);
  return `${DIAL_BASE}${encodeURIComponent(actionUrl)}`;
}
