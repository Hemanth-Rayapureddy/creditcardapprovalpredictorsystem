export interface ApplicationInput {
  applicant_name: string;
  age: number;
  gender: string;
  marital_status: string;
  education: string;
  employment_type: string;
  annual_income: number;
  monthly_salary: number;
  existing_loan_amount: number;
  credit_score: number;
  dependents: number;
  years_employment: number;
  existing_credit_cards: number;
  monthly_expenses: number;
  debt_to_income_ratio: number;
  residential_status: string;
  property_ownership: string;
  loan_history: string;
  previous_defaults: string;
}

export interface FeatureContribution {
  feature: string;
  contribution: number;
  direction: 'positive' | 'negative';
  description: string;
}

export interface PredictionResult {
  prediction: 'Approved' | 'Rejected';
  probability: number;
  risk_level: 'Low' | 'Medium' | 'High';
  confidence_score: number;
  recommendation: string;
  reasons: string[];
  feature_contributions: FeatureContribution[];
  model_used: string;
  model_accuracy: number;
}

export interface Application extends ApplicationInput {
  id: string;
  prediction: string;
  probability: number;
  risk_level: string;
  confidence_score: number;
  recommendation: string;
  reasons: string[];
  feature_contributions: Record<string, number>;
  created_at: string;
}

export type Page = 'home' | 'about' | 'predict' | 'dashboard' | 'admin' | 'auth';
