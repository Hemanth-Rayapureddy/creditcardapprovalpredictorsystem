import { CreditCard, ArrowRight, Brain, ShieldCheck, Zap, TrendingUp, BarChart3, CheckCircle2, Sparkles } from 'lucide-react';
import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden gradient-bg">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="section-padding relative z-10 pt-20 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fade-in-up">
                <Sparkles className="w-4 h-4 text-primary-300" />
                <span className="text-sm font-medium text-primary-100">AI-Powered Credit Decisioning</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                AI Credit Card
                <br />
                <span className="bg-gradient-to-r from-primary-300 via-white to-primary-300 bg-clip-text text-transparent">
                  Approval Prediction
                </span>
              </h1>

              <p className="text-lg text-blue-100/80 leading-relaxed mb-8 max-w-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Harness the power of machine learning to make faster, smarter, and fairer
                credit card approval decisions. Our AI analyzes 19+ financial factors to
                predict approval with 92% accuracy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <button
                  onClick={() => onNavigate('predict')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-primary-700 bg-white hover:bg-primary-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div>
                  <div className="text-3xl font-bold font-display">92.4%</div>
                  <div className="text-sm text-blue-200/70 mt-1">Model Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-display">19+</div>
                  <div className="text-sm text-blue-200/70 mt-1">Factors Analyzed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-display">&lt;1s</div>
                  <div className="text-sm text-blue-200/70 mt-1">Prediction Time</div>
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative hidden lg:block animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                {/* Main card */}
                <div className="glass-card p-8 max-w-md mx-auto bg-white/10 border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-semibold">CreditAI Analysis</span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-accent-500/20 text-accent-300 text-xs font-medium">
                      Live
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Credit Score', value: '782', pct: 92, color: 'bg-accent-400' },
                      { label: 'Income Stability', value: 'High', pct: 85, color: 'bg-primary-400' },
                      { label: 'Debt-to-Income', value: '18%', pct: 78, color: 'bg-warning-400' },
                      { label: 'Employment', value: '7 years', pct: 88, color: 'bg-primary-400' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-blue-100/80">{item.label}</span>
                          <span className="text-white font-medium">{item.value}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100/80 text-sm">Prediction</span>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-500/20 text-accent-300">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-semibold text-sm">Approved · 92%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 glass-card p-3 bg-white/20 border-white/30 animate-float">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary-300" />
                    <span className="text-white text-sm font-medium">XGBoost AI</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 glass-card p-3 bg-white/20 border-white/30 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-accent-300" />
                    <span className="text-white text-sm font-medium">Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-slow">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 section-padding">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-4">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Key Features</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Intelligent Credit Decisioning
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Our platform combines advanced machine learning with intuitive design to
            transform how credit decisions are made.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Brain, title: 'AI-Powered Predictions', desc: 'XGBoost and Random Forest models analyze 19+ factors to predict approval with 92% accuracy.', color: 'primary' },
            { icon: Zap, title: 'Instant Decisions', desc: 'Get predictions in under a second. No waiting, no paperwork, no manual review delays.', color: 'warning' },
            { icon: ShieldCheck, title: 'Fair & Consistent', desc: 'Every application is evaluated using the same criteria, eliminating human bias and inconsistency.', color: 'accent' },
            { icon: TrendingUp, title: 'Risk Assessment', desc: 'Detailed risk level analysis (Low, Medium, High) with confidence scoring for every prediction.', color: 'primary' },
            { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Visualize approval trends, income distributions, credit score patterns, and feature importance.', color: 'warning' },
            { icon: CheckCircle2, title: 'AI Explanations', desc: 'Understand every decision with clear reasons and personalized recommendations to improve approval odds.', color: 'accent' },
          ].map((feature, i) => {
            const Icon = feature.icon;
            const colorMap: Record<string, string> = {
              primary: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
              warning: 'bg-warning-50 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400',
              accent: 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
            };
            return (
              <div
                key={i}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[feature.color]} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 section-padding">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Three simple steps from application to AI-powered decision.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Enter Information', desc: 'Fill out a simple form with your personal and financial details. All data is securely processed.', icon: CreditCard },
            { step: '02', title: 'AI Analysis', desc: 'Our XGBoost model analyzes 19+ factors including credit score, income, debt ratio, and employment history.', icon: Brain },
            { step: '03', title: 'Get Prediction', desc: 'Receive instant approval prediction with probability, risk level, and personalized recommendations.', icon: CheckCircle2 },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-transparent -translate-x-8" />
                )}
                <div className="glass-card p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-5xl font-bold font-display text-primary-200 dark:text-primary-900/40 mb-4">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 section-padding">
        <div className="relative overflow-hidden rounded-3xl gradient-bg p-12 text-center">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="relative z-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Your Prediction?
            </h2>
            <p className="text-blue-100/80 max-w-xl mx-auto mb-8">
              Try our AI-powered credit card approval prediction system today.
              Get instant results with detailed explanations.
            </p>
            <button
              onClick={() => onNavigate('predict')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-primary-700 bg-white hover:bg-primary-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 group"
            >
              Start Prediction
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
