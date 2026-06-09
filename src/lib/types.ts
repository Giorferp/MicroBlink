export type UserRole = 'participant' | 'researcher';

export interface Profile {
  id: string;
  wallet_address: string;
  full_name: string;
  age_range: string;
  gender: string;
  education_level: string;
  occupation: string;
  municipality: string;
  state: string;
  gps_verified: boolean;
  gps_verified_at: string | null;
  is_registered: boolean;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'select' | 'number' | 'text' | 'scale';
  options?: string[];
  required: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: SurveyQuestion[];
  is_active: boolean;
  estimated_minutes: number;
  incentive_description: string;
  created_at: string;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  respondent_id: string;
  answers: Record<string, string | number>;
  data_hash: string;
  solana_tx_signature: string | null;
  municipality: string;
  state: string;
  submitted_at: string;
}

export interface GeoLocation {
  municipality: string;
  state: string;
  latitude: number;
  longitude: number;
}
