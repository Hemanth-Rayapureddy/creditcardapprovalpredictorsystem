import { useState } from 'react';
import {
  CreditCard, User, DollarSign, Home, FileText, RotateCcw, Sparkles,
  CheckCircle2, XCircle, TrendingUp, AlertTriangle, Shield, Brain,
  Lightbulb, Download, Loader2, ChevronRight, BarChart3, LogIn
} from 'lucide-react';
import { ApplicationInput, PredictionResult } from '../types';
import { predictApproval } from '../lib/predictionEngine';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Page } from '../types';

interface PredictPageProps {
  onNavigate: (page: Page) => void;
}

const initialForm: ApplicationInput = {
  applicant_name: '',
  age: 30,
  gender: 'Male',
  marital_status: 'Single',
  education: 'Graduate',
  employment_type: 'Salaried',
  annual_income: 60000,
  monthly_salary: 5000,
  existing_loan_amount: 10000,
  credit_score: 700,
  dependents: 0,
  years_employment: 5,
  existing_credit_cards: 1,
  monthly_expenses: 2000,
  debt_to_income_ratio: 20,
  residential_status: 'Permanent',
  property_ownership: 'Rented',
  loan_history: 'Good History',
  previous_defaults: 'No',
};

const selectOptions = {
  gender: ['Male', 'Female', 'Other'],
  marital_status: ['Single', 'Married', 'Divorced', 'Widowed'],
  education: ['High School', 'Undergraduate', 'Graduate', 'Postgraduate'],
  employment_type: ['Salaried', 'Self-Employed', 'Government', 'Business Owner', 'Freelancer', 'Unemployed'],
  residential_status: ['Permanent', 'Temporary', 'Student'],
  property_ownership: ['Owned', 'Mortgaged', 'Rented', 'Other'],
  loan_history: ['No History', 'Good History', 'Poor History', 'Excellent History'],
  previous_defaults: ['No', 'Yes'],
};

export default function PredictPage({ onNavigate }: PredictPageProps) {
  const { user } = useAuth();
  const [form, setForm] = useState<ApplicationInput>(initialForm);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="animate-fade-in pt-20">
        <div className="section-padding py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-neutral-900 dark:text-white mb-3">
              Sign In Required
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Please sign in to your account to make credit card approval predictions.
              Your predictions are saved securely to your account.
            </p>
            <button onClick={() => onNavigate('auth')} className="btn-primary">
              <LogIn className="w-5 h-5" />
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (field: keyof ApplicationInput, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setForm(initialForm);
    setResult(null);
    setError(null);
    setSavedId(null);
  };

  const handlePredict = async () => {
    if (!form.applicant_name.trim()) {
      setError('Please enter the applicant name');
      return;
    }
    if (form.age < 18 || form.age > 100) {
      setError('Age must be between 18 and 100');
      return;
    }
    if (form.credit_score < 300 || form.credit_score > 850) {
      setError('Credit score must be between 300 and 850');
      return;
    }

    setLoading(true);
    setError(null);
    setSavedId(null);

    try {
      const prediction = predictApproval(form);
      setResult(prediction);

      const { data, error: dbError } = await supabase
        .from('applications')
        .insert({
          ...form,
          prediction: prediction.prediction,
          probability: prediction.probability,
          risk_level: prediction.risk_level,
          confidence_score: prediction.confidence_score,
          recommendation: prediction.recommendation,
          reasons: prediction.reasons,
          feature_contributions: Object.fromEntries(
            prediction.feature_contributions.map((c) => [c.feature, c.contribution])
          ),
        })
        .select('id')
        .single();

      if (dbError) throw dbError;
      if (data) setSavedId(data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const report = `
CREDIT CARD APPROVAL PREDICTION REPORT
=======================================

Applicant: ${form.applicant_name}
Date: ${new Date().toLocaleString()}

PREDICTION: ${result.prediction}
Approval Probability: ${result.probability}%
Risk Level: ${result.risk_level}
Confidence Score: ${result.confidence_score}%
Model Used: ${result.model_used} (Accuracy: ${(result.model_accuracy * 100).toFixed(2)}%)

APPLICANT DETAILS:
- Age: ${form.age}
- Gender: ${form.gender}
- Marital Status: ${form.marital_status}
- Education: ${form.education}
- Employment Type: ${form.employment_type}
- Annual Income: $${form.annual_income.toLocaleString()}
- Monthly Salary: $${form.monthly_salary.toLocaleString()}
- Credit Score: ${form.credit_score}
- Debt-to-Income Ratio: ${form.debt_to_income_ratio}%
- Years of Employment: ${form.years_employment}
- Previous Defaults: ${form.previous_defaults}

KEY FACTORS AFFECTING DECISION:
${result.reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}

AI RECOMMENDATION:
${result.recommendation}

---
This report is generated by CreditAI. For demonstration purposes only.
Not financial advice.
`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-prediction-${form.applicant_name.replace(/\s/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in pt-20">
      <div className="section-padding py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-4">
            <CreditCard className="w-4 h-4" />
            <span className="text-sm font-medium">Prediction Form</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            Credit Card Approval Prediction
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Enter the applicant's information below to get an AI-powered approval prediction.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-400 text-sm flex items-center gap-2 animate-fade-in">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label-field">Full Name</label>
                  <input
                    type="text"
                    value={form.applicant_name}
                    onChange={(e) => handleChange('applicant_name', e.target.value)}
                    placeholder="John Doe"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">Age</label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                    min="18"
                    max="100"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="input-field"
                  >
                    {selectOptions.gender.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Marital Status</label>
                  <select
                    value={form.marital_status}
                    onChange={(e) => handleChange('marital_status', e.target.value)}
                    className="input-field"
                  >
                    {selectOptions.marital_status.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Education</label>
                  <select
                    value={form.education}
                    onChange={(e) => handleChange('education', e.target.value)}
                    className="input-field"
                  >
                    {selectOptions.education.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Employment Type</label>
                  <select
                    value={form.employment_type}
                    onChange={(e) => handleChange('employment_type', e.target.value)}
                    className="input-field"
                  >
                    {selectOptions.employment_type.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Number of Dependents</label>
                  <input
                    type="number"
                    value={form.dependents}
                    onChange={(e) => handleChange('dependents', parseInt(e.target.value) || 0)}
                    min="0"
                    max="10"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">
                  Financial Information
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Annual Income ($)</label>
                  <input
                    type="number"
                    value={form.annual_income}
                    onChange={(e) => handleChange('annual_income', parseFloat(e.target.value) || 0)}
                    min="0"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">Monthly Salary ($)</label>
                  <input
                    type="number"
                    value={form.monthly_salary}
                    onChange={(e) => handleChange('monthly_salary', parseFloat(e.target.value) || 0)}
                    min="0"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">Existing Loan Amount ($)</label>
                  <input
                    type="number"
                    value={form.existing_loan_amount}
                    onChange={(e) => handleChange('existing_loan_amount', parseFloat(e.target.value) || 0)}
                    min="0"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">Credit Score (300-850)</label>
                  <input
                    type="number"
                    value={form.credit_score}
                    onChange={(e) => handleChange('credit_score', parseInt(e.target.value) || 0)}
                    min="300"
                    max="850"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">Years of Employment</label>
                  <input
                    type="number"
                    value={form.years_employment}
                    onChange={(e) => handleChange('years_employment', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.5"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">Existing Credit Cards</label>
                  <input
                    type="number"
                    value={form.existing_credit_cards}
                    onChange={(e) => handleChange('existing_credit_cards', parseInt(e.target.value) || 0)}
                    min="0"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">Monthly Expenses ($)</label>
                  <input
                    type="number"
                    value={form.monthly_expenses}
                    onChange={(e) => handleChange('monthly_expenses', parseFloat(e.target.value) || 0)}
                    min="0"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">Debt-to-Income Ratio (%)</label>
                  <input
                    type="number"
                    value={form.debt_to_income_ratio}
                    onChange={(e) => handleChange('debt_to_income_ratio', parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Other Details */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-warning-50 dark:bg-warning-900/30 flex items-center justify-center">
                  <Home className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                </div>
                <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">
                  Other Details
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Residential Status</label>
                  <select
                    value={form.residential_status}
                    onChange={(e) => handleChange('residential_status', e.target.value)}
                    className="input-field"
                  >
                    {selectOptions.residential_status.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Property Ownership</label>
                  <select
                    value={form.property_ownership}
                    onChange={(e) => handleChange('property_ownership', e.target.value)}
                    className="input-field"
                  >
                    {selectOptions.property_ownership.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Loan History</label>
                  <select
                    value={form.loan_history}
                    onChange={(e) => handleChange('loan_history', e.target.value)}
                    className="input-field"
                  >
                    {selectOptions.loan_history.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Previous Credit Defaults</label>
                  <select
                    value={form.previous_defaults}
                    onChange={(e) => handleChange('previous_defaults', e.target.value)}
                    className="input-field"
                  >
                    {selectOptions.previous_defaults.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Predict Approval
                  </>
                )}
              </button>
              <button onClick={handleReset} className="btn-secondary">
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>

          {/* Result Panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            {!result && !loading && (
              <div className="glass-card p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-neutral-400" />
                </div>
                <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">
                  Awaiting Prediction
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                  Fill out the form and click "Predict Approval" to get an AI-powered
                  credit card approval prediction with detailed analysis.
                </p>
              </div>
            )}

            {loading && (
              <div className="glass-card p-12 text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-primary-100 dark:border-primary-900/30" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-10 h-10 text-primary-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">
                  AI Analyzing Your Application
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Processing 19+ factors with XGBoost model...
                </p>
                <div className="mt-6 space-y-2">
                  {['Evaluating credit score', 'Analyzing debt-to-income ratio', 'Checking employment history', 'Computing approval probability'].map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 justify-center" style={{ animationDelay: `${i * 0.3}s` }}>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4 animate-scale-in">
                {/* Main Result */}
                <div className={`glass-card p-6 border-2 ${
                  result.prediction === 'Approved'
                    ? 'border-accent-200 dark:border-accent-800'
                    : 'border-danger-200 dark:border-danger-800'
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary-500" />
                      <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        AI Prediction Result
                      </span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium">
                      {result.model_used}
                    </span>
                  </div>

                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                      result.prediction === 'Approved'
                        ? 'bg-accent-50 dark:bg-accent-900/30'
                        : 'bg-danger-50 dark:bg-danger-900/30'
                    }`}>
                      {result.prediction === 'Approved' ? (
                        <CheckCircle2 className="w-12 h-12 text-accent-500" />
                      ) : (
                        <XCircle className="w-12 h-12 text-danger-500" />
                      )}
                    </div>
                    <h2 className={`font-display text-3xl font-bold mb-2 ${
                      result.prediction === 'Approved'
                        ? 'text-accent-600 dark:text-accent-400'
                        : 'text-danger-600 dark:text-danger-400'
                    }`}>
                      {result.prediction}
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {result.prediction === 'Approved'
                        ? 'Application likely to be approved'
                        : 'Application likely to be rejected'}
                    </p>
                  </div>

                  {/* Probability Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-neutral-600 dark:text-neutral-400">Approval Probability</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{result.probability}%</span>
                    </div>
                    <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          result.probability >= 75 ? 'bg-accent-500' : result.probability >= 50 ? 'bg-warning-500' : 'bg-danger-500'
                        }`}
                        style={{ width: `${result.probability}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                      <div className={`text-lg font-bold ${
                        result.risk_level === 'Low' ? 'text-accent-600 dark:text-accent-400' :
                        result.risk_level === 'Medium' ? 'text-warning-600 dark:text-warning-400' :
                        'text-danger-600 dark:text-danger-400'
                      }`}>
                        {result.risk_level}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Risk Level</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                      <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {result.confidence_score}%
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Confidence</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                      <div className="text-lg font-bold text-neutral-900 dark:text-white">
                        {(result.model_accuracy * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Model Acc.</div>
                    </div>
                  </div>
                </div>

                {/* Key Factors */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary-500" />
                    <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
                      Key Factors Affecting Decision
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {result.feature_contributions.slice(0, 6).map((c, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-600 dark:text-neutral-400">{c.feature}</span>
                          <span className={c.direction === 'positive' ? 'text-accent-600 dark:text-accent-400' : 'text-danger-600 dark:text-danger-400'}>
                            {c.direction === 'positive' ? '+' : '-'}{(c.contribution * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${c.direction === 'positive' ? 'bg-accent-500' : 'bg-danger-500'}`}
                            style={{ width: `${Math.min(c.contribution * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reasons */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-primary-500" />
                    <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
                      Reasons
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {result.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <ChevronRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Recommendation */}
                <div className="glass-card p-6 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-warning-500" />
                    <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
                      AI Recommendation
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {result.recommendation}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleDownloadReport} className="btn-secondary flex-1">
                    <Download className="w-5 h-5" />
                    Download Report
                  </button>
                  <button onClick={() => onNavigate('dashboard')} className="btn-secondary flex-1">
                    <BarChart3 className="w-5 h-5" />
                    View Dashboard
                  </button>
                </div>

                {savedId && (
                  <p className="text-xs text-center text-neutral-400 dark:text-neutral-500">
                    <Shield className="w-3 h-3 inline mr-1" />
                    Application saved securely (ID: {savedId.slice(0, 8)}...)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
