/**
 * Generates a SHA-256 hash of survey response data.
 * This hash will be stored on-chain for data integrity verification.
 */
export async function hashResponseData(
  data: Record<string, unknown>,
  respondentId: string,
  surveyId: string,
  timestamp: string
): Promise<string> {
  const payload = JSON.stringify({
    respondent_id: respondentId,
    survey_id: surveyId,
    answers: data,
    timestamp,
  });

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
