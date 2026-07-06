import { useEffect, useState } from 'react';
import {
  BarChart3, TrendingUp, Users, CheckCircle2, XCircle, AlertTriangle,
  CreditCard, Activity, Brain, Award, LogIn
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getFeatureImportance, getModelMetrics } from '../lib/predictionEngine';
import { DonutChart, BarChart, LineChart, StatCard } from '../components/Charts';
import { useAuth } from '../context/AuthContext';
import { Page } from '../types';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

interface AppRecord {
  id: string;
  prediction: string;
  probability: number;
  risk_level: string;
  credit_score: number;
  annual_income: number;
  created_at: string;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user } = useAuth();
  const [records, setRecords] = useState<AppRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const featureImportance = getFeatureImportance();
  const modelMetrics = getModelMetrics();

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
              Sign in to view your prediction analytics dashboard.
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

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('id, prediction, probability, risk_level, credit_score, annual_income, created_at')
      .order('created_at', { ascending: false })
      .limit(500);

    if (!error && data) {
      setRecords(data as AppRecord[]);
    }
    setLoading(false);
  };

  const total = records.length;
  const approved = records.filter((r) => r.prediction === 'Approved').length;
  const rejected = total - approved;
  const avgProbability = total > 0 ? (records.reduce((sum, r) => sum + r.probability, 0) / total).toFixed(1) : '0';

  // Income distribution buckets
  const incomeBuckets = [
    { label: '<30K', min: 0, max: 30000 },
    { label: '30-50K', min: 30000, max: 50000 },
    { label: '50-80K', min: 50000, max: 80000 },
    { label: '80-120K', min: 80000, max: 120000 },
    { label: '120K+', min: 120000, max: Infinity },
  ];
  const incomeData = incomeBuckets.map((b) => ({
    label: b.label,
    value: records.filter((r) => r.annual_income >= b.min && r.annual_income < b.max).length,
  }));

  // Credit score distribution
  const creditBuckets = [
    { label: '300-579', min: 300, max: 580 },
    { label: '580-669', min: 580, max: 670 },
    { label: '670-739', min: 670, max: 740 },
    { label: '740-799', min: 740, max: 800 },
    { label: '800-850', min: 800, max: 851 },
  ];
  const creditData = creditBuckets.map((b) => ({
    label: b.label,
    value: records.filter((r) => r.credit_score >= b.min && r.credit_score < b.max).length,
  }));

  // Risk level distribution
  const riskData = [
    { label: 'Low', value: records.filter((r) => r.risk_level === 'Low').length, color: '#22c55e' },
    { label: 'Medium', value: records.filter((r) => r.risk_level === 'Medium').length, color: '#f59e0b' },
    { label: 'High', value: records.filter((r) => r.risk_level === 'High').length, color: '#ef4444' },
  ];

  // Monthly predictions (last 6 months)
  const monthlyData = (() => {
    const months: { label: string; value: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const count = records.filter((r) => {
        const rd = new Date(r.created_at);
        return rd >= d && rd <= monthEnd;
      }).length;
      months.push({
        label: d.toLocaleDateString('en', { month: 'short' }),
        value: count,
      });
    }
    return months;
  })();

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-neutral-500 dark:text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pt-20">
      <div className="section-padding py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-3">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Analytics Dashboard</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-neutral-900 dark:text-white">
              Prediction Analytics
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Real-time insights from AI credit card approval predictions
            </p>
          </div>
          <button onClick={() => onNavigate('predict')} className="btn-primary self-start">
            <CreditCard className="w-5 h-5" />
            New Prediction
          </button>
        </div>

        {total === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">
              No Predictions Yet
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-sm mx-auto">
              Make your first prediction to see analytics data here.
            </p>
            <button onClick={() => onNavigate('predict')} className="btn-primary">
              Make First Prediction
            </button>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Predictions" value={total} icon={Users} color="primary" />
              <StatCard label="Approved" value={approved} icon={CheckCircle2} color="accent" trend={`${((approved / total) * 100).toFixed(0)}%`} />
              <StatCard label="Rejected" value={rejected} icon={XCircle} color="danger" trend={`${((rejected / total) * 100).toFixed(0)}%`} />
              <StatCard label="Avg. Probability" value={`${avgProbability}%`} icon={TrendingUp} color="warning" />
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Approved vs Rejected */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-5 h-5 text-primary-500" />
                  <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
                    Approved vs Rejected
                  </h3>
                </div>
                <div className="flex items-center justify-center gap-8">
                  <DonutChart
                    data={[
                      { label: 'Approved', value: approved, color: '#22c55e' },
                      { label: 'Rejected', value: rejected, color: '#ef4444' },
                    ]}
                    centerValue={`${total}`}
                    centerLabel="Total"
                  />
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-accent-500" />
                      <div>
                        <div className="text-sm font-semibold text-neutral-900 dark:text-white">{approved} Approved</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{((approved / total) * 100).toFixed(1)}% of total</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-danger-500" />
                      <div>
                        <div className="text-sm font-semibold text-neutral-900 dark:text-white">{rejected} Rejected</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{((rejected / total) * 100).toFixed(1)}% of total</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Level */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-5 h-5 text-warning-500" />
                  <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
                    Risk Level Analysis
                  </h3>
                </div>
                <div className="flex items-center justify-center gap-8">
                  <DonutChart
                    data={riskData}
                    centerValue={`${total}`}
                    centerLabel="Applications"
                  />
                  <div className="space-y-4">
                    {riskData.map((r) => (
                      <div key={r.label} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: r.color }} />
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">{r.value} {r.label}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">{total > 0 ? ((r.value / total) * 100).toFixed(1) : 0}% of total</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Income & Credit Score Distribution */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-accent-500" />
                  <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
                    Income Distribution
                  </h3>
                </div>
                <BarChart data={incomeData} height={250} />
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-primary-500" />
                  <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
                    Credit Score Distribution
                  </h3>
                </div>
                <BarChart data={creditData} height={250} />
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-primary-500" />
                <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
                  Monthly Prediction Statistics
                </h3>
              </div>
              <LineChart data={monthlyData} height={280} color="#3b82f6" />
            </div>

            {/* Feature Importance */}
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-5 h-5 text-primary-500" />
                <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
                  Feature Importance (XGBoost Model)
                </h3>
              </div>
              <BarChart
                data={featureImportance.map((f) => ({ label: f.feature, value: f.importance }))}
                horizontal
              />
            </div>

            {/* Model Performance */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-warning-500" />
                <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
                  Model Performance Metrics
                </h3>
              </div>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                      <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Model</th>
                      <th className="text-right py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Accuracy</th>
                      <th className="text-right py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Precision</th>
                      <th className="text-right py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Recall</th>
                      <th className="text-right py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">F1 Score</th>
                      <th className="text-right py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">ROC-AUC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelMetrics.map((m, i) => (
                      <tr
                        key={i}
                        className={`border-b border-neutral-100 dark:border-neutral-800 ${
                          m.name === 'XGBoost Classifier' ? 'bg-primary-50/50 dark:bg-primary-900/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            {m.name}
                            {m.name === 'XGBoost Classifier' && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 font-medium">
                                Deployed
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 text-neutral-600 dark:text-neutral-400">{(m.accuracy * 100).toFixed(2)}%</td>
                        <td className="text-right py-3 px-4 text-neutral-600 dark:text-neutral-400">{(m.precision * 100).toFixed(2)}%</td>
                        <td className="text-right py-3 px-4 text-neutral-600 dark:text-neutral-400">{(m.recall * 100).toFixed(2)}%</td>
                        <td className="text-right py-3 px-4 text-neutral-600 dark:text-neutral-400">{(m.f1 * 100).toFixed(2)}%</td>
                        <td className="text-right py-3 px-4 text-neutral-600 dark:text-neutral-400">{(m.roc_auc * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
