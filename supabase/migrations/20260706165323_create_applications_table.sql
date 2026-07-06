/*
# Create applications table for Credit Card Approval Prediction System

## Purpose
Stores credit card application submissions along with the AI prediction results,
probability scores, risk levels, and AI-generated recommendations.

## New Tables
- `applications`
  - `id` (uuid, primary key)
  - `applicant_name` (text, full name of applicant)
  - `age` (integer)
  - `gender` (text)
  - `marital_status` (text)
  - `education` (text)
  - `employment_type` (text)
  - `annual_income` (numeric, in USD)
  - `monthly_salary` (numeric, in USD)
  - `existing_loan_amount` (numeric, in USD)
  - `credit_score` (integer, 300-850)
  - `dependents` (integer)
  - `years_employment` (numeric)
  - `existing_credit_cards` (integer)
  - `monthly_expenses` (numeric, in USD)
  - `debt_to_income_ratio` (numeric, percentage 0-100)
  - `residential_status` (text)
  - `property_ownership` (text)
  - `loan_history` (text)
  - `previous_defaults` (text, Yes/No)
  - `prediction` (text, Approved/Rejected)
  - `probability` (numeric, 0-100 approval probability)
  - `risk_level` (text, Low/Medium/High)
  - `confidence_score` (numeric, 0-100)
  - `recommendation` (text, AI-generated recommendation)
  - `reasons` (jsonb, array of reasons affecting prediction)
  - `feature_contributions` (jsonb, feature importance breakdown)
  - `created_at` (timestamptz, default now())

## Security
- Enable RLS on `applications`.
- This is a single-tenant demo app (no sign-in required for core prediction flow),
  so allow anon + authenticated CRUD. The admin panel reads/writes via the same anon key.
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL,
  marital_status text NOT NULL,
  education text NOT NULL,
  employment_type text NOT NULL,
  annual_income numeric NOT NULL,
  monthly_salary numeric NOT NULL,
  existing_loan_amount numeric NOT NULL DEFAULT 0,
  credit_score integer NOT NULL,
  dependents integer NOT NULL DEFAULT 0,
  years_employment numeric NOT NULL DEFAULT 0,
  existing_credit_cards integer NOT NULL DEFAULT 0,
  monthly_expenses numeric NOT NULL DEFAULT 0,
  debt_to_income_ratio numeric NOT NULL DEFAULT 0,
  residential_status text NOT NULL,
  property_ownership text NOT NULL,
  loan_history text NOT NULL,
  previous_defaults text NOT NULL,
  prediction text NOT NULL,
  probability numeric NOT NULL,
  risk_level text NOT NULL,
  confidence_score numeric NOT NULL,
  recommendation text,
  reasons jsonb DEFAULT '[]'::jsonb,
  feature_contributions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_applications" ON applications;
CREATE POLICY "anon_select_applications" ON applications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_applications" ON applications;
CREATE POLICY "anon_insert_applications" ON applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_applications" ON applications;
CREATE POLICY "anon_update_applications" ON applications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_applications" ON applications;
CREATE POLICY "anon_delete_applications" ON applications FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_prediction ON applications (prediction);
