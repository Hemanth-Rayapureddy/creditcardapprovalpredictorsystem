import { Brain, Zap, ShieldCheck, TrendingUp, BarChart3, Target, Database, GitBranch, Award, CheckCircle2 } from 'lucide-react';
import { Page } from '../types';
import { getModelMetrics, getFeatureImportance } from '../lib/predictionEngine';
import { BarChart } from '../components/Charts';

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const modelMetrics = getModelMetrics();
  const featureImportance = getFeatureImportance();

  return (
    <div className="animate-fade-in pt-20">
      {/* Header */}
      <section className="section-padding py-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-4">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-medium">About the System</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-6 text-balance">
            Understanding Credit Card Approval Prediction
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Credit card approval prediction uses machine learning to analyze applicant
            data and predict whether a credit card application will be approved or rejected.
            This helps banks make faster, fairer, and more consistent lending decisions.
          </p>
        </div>
      </section>

      {/* What is it */}
      <section className="section-padding py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              What is Credit Card Approval Prediction?
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Credit card approval prediction is a machine learning application that
              analyzes an applicant's personal and financial information to estimate
              the likelihood of their credit card application being approved.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Traditional approval processes rely on manual review by loan officers,
              which can be slow, inconsistent, and subject to human bias. ML models
              evaluate every application using the same objective criteria, producing
              consistent and explainable decisions in milliseconds.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Our system analyzes 19+ factors including credit score, income, debt-to-income
              ratio, employment history, and previous credit behavior to generate a
              prediction with a confidence score and detailed explanation.
            </p>
          </div>
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">
                The ML Pipeline
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { icon: Database, label: 'Data Collection', desc: 'Gather applicant financial & personal data' },
                { icon: GitBranch, label: 'Preprocessing', desc: 'Handle missing values, encode, scale features' },
                { icon: Brain, label: 'Model Training', desc: 'Train Logistic Regression, RF, XGBoost, SVM' },
                { icon: Award, label: 'Evaluation', desc: 'Compare accuracy, precision, recall, F1, ROC-AUC' },
                { icon: CheckCircle2, label: 'Prediction', desc: 'Deploy best model for real-time predictions' },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      {i < 4 && <div className="w-0.5 h-6 bg-neutral-200 dark:bg-neutral-700 mt-1" />}
                    </div>
                    <div className="pt-1">
                      <div className="font-medium text-sm text-neutral-900 dark:text-white">{step.label}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How ML is used */}
      <section className="section-padding py-12">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
            How Machine Learning is Used
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            We train and compare multiple classification models, then automatically
            select the best-performing one for production use.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8">
          <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-6">
            Model Performance Comparison
          </h3>
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
                    className={`border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${
                      m.name === 'XGBoost Classifier' ? 'bg-primary-50/50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-neutral-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        {m.name}
                        {m.name === 'XGBoost Classifier' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 font-medium">
                            Best
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
      </section>

      {/* Feature Importance */}
      <section className="section-padding py-12">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">
                Feature Importance (XGBoost)
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Which factors matter most in the prediction
              </p>
            </div>
          </div>
          <BarChart
            data={featureImportance.map((f) => ({ label: f.feature, value: f.importance }))}
            horizontal
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding py-12">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
            Benefits of AI-Powered Approval
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Machine learning transforms credit decisioning with measurable advantages
            over traditional manual review.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: 'Faster Decisions', desc: 'Instant predictions in under a second, compared to days or weeks for manual review.', color: 'warning' },
            { icon: ShieldCheck, title: 'Reduced Errors', desc: 'Consistent, objective evaluation eliminates human errors and oversight.', color: 'accent' },
            { icon: Target, title: 'Fair Evaluation', desc: 'Every applicant is assessed using identical criteria, ensuring consistency and fairness.', color: 'primary' },
            { icon: TrendingUp, title: 'Better Risk Assessment', desc: 'Advanced models detect subtle patterns that humans might miss, improving risk evaluation.', color: 'warning' },
          ].map((benefit, i) => {
            const Icon = benefit.icon;
            const colorMap: Record<string, string> = {
              primary: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
              warning: 'bg-warning-50 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400',
              accent: 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
            };
            return (
              <div key={i} className="glass-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[benefit.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding py-12">
        <div className="glass-card p-8 sm:p-12 text-center bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/20 dark:to-neutral-900">
          <h2 className="font-display text-2xl font-bold text-neutral-900 dark:text-white mb-3">
            Experience AI-Powered Credit Decisions
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-xl mx-auto">
            Try the prediction system and see how AI evaluates credit applications in real-time.
          </p>
          <button onClick={() => onNavigate('predict')} className="btn-primary">
            Try Prediction System
          </button>
        </div>
      </section>
    </div>
  );
}
