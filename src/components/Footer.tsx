import { CreditCard, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-20 border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50">
      <div className="section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block font-display font-bold text-base text-neutral-900 dark:text-white">
                  CreditAI
                </span>
                <span className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-medium tracking-wide">
                  APPROVAL PREDICTION
                </span>
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
              AI-powered credit card approval prediction system using machine learning
              for faster, smarter, and fairer lending decisions.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Github, Linkedin, Twitter, Mail].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-4">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Home', page: 'home' as Page },
                { label: 'About', page: 'about' as Page },
                { label: 'Predict', page: 'predict' as Page },
                { label: 'Dashboard', page: 'dashboard' as Page },
                { label: 'Admin Panel', page: 'admin' as Page },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => onNavigate(link.page)}
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-4">
              Technology
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
              <span>React + TypeScript</span>
              <span>Scikit-learn / XGBoost</span>
              <span>Supabase (PostgreSQL)</span>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            © 2026 CreditAI. Built for demonstration purposes. Not financial advice.
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            Powered by Machine Learning · XGBoost Classifier
          </p>
        </div>
      </div>
    </footer>
  );
}
