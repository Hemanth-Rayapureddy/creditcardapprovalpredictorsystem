import { useEffect, useState } from 'react';
import {
  Shield, Search, Filter, Trash2, Download, Eye, X, CheckCircle2,
  XCircle, User, DollarSign, AlertTriangle, RefreshCw, LogIn
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Page } from '../types';
import { Application } from '../types';

interface AdminPageProps {
  onNavigate: (page: Page) => void;
}

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const { user } = useAuth();
  const [records, setRecords] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'Approved' | 'Rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="animate-fade-in pt-20">
        <div className="section-padding py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-neutral-900 dark:text-white mb-3">
              Admin Access Required
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Sign in to access the admin panel and manage applications.
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
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRecords(data as Application[]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('applications').delete().eq('id', id);
    if (!error) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
    }
    setDeleteConfirm(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'Name', 'Age', 'Gender', 'Marital Status', 'Education', 'Employment Type',
      'Annual Income', 'Monthly Salary', 'Credit Score', 'DTI Ratio',
      'Prediction', 'Probability', 'Risk Level', 'Confidence', 'Date'
    ];
    const rows = filtered.map((r) => [
      r.applicant_name, r.age, r.gender, r.marital_status, r.education, r.employment_type,
      r.annual_income, r.monthly_salary, r.credit_score, r.debt_to_income_ratio,
      r.prediction, r.probability, r.risk_level, r.confidence_score,
      new Date(r.created_at).toLocaleString()
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = records.filter((r) => {
    const matchesSearch = r.applicant_name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || r.prediction === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: records.length,
    approved: records.filter((r) => r.prediction === 'Approved').length,
    rejected: records.filter((r) => r.prediction === 'Rejected').length,
    highRisk: records.filter((r) => r.risk_level === 'High').length,
  };

  return (
    <div className="animate-fade-in pt-20">
      <div className="section-padding py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-3">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Admin Panel</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-neutral-900 dark:text-white">
              Application Management
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              View, search, filter, and manage all submitted applications
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchApplications} className="btn-secondary">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button onClick={handleExportCSV} disabled={filtered.length === 0} className="btn-primary">
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Applications', value: stats.total, icon: User, color: 'primary' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'accent' },
            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'danger' },
            { label: 'High Risk', value: stats.highRisk, icon: AlertTriangle, color: 'warning' },
          ].map((s, i) => {
            const Icon = s.icon;
            const colorMap: Record<string, string> = {
              primary: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
              accent: 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
              danger: 'bg-danger-50 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400',
              warning: 'bg-warning-50 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400',
            };
            return (
              <div key={i} className="glass-card p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[s.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-display text-neutral-900 dark:text-white">{s.value}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{s.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search & Filter */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by applicant name..."
                className="input-field pl-11"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-neutral-400" />
              {(['all', 'Approved', 'Rejected'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    filter === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="glass-card p-16 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-neutral-500 dark:text-neutral-400">Loading applications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">
              No Applications Found
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {records.length === 0 ? 'No applications have been submitted yet.' : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50">
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Applicant</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300 hidden md:table-cell">Credit Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300 hidden lg:table-cell">Income</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Prediction</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300 hidden md:table-cell">Risk</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300 hidden lg:table-cell">Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <tr key={app.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-neutral-900 dark:text-white">{app.applicant_name}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{app.age} yrs · {app.employment_type}</div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-neutral-600 dark:text-neutral-400">
                        {app.credit_score}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-neutral-600 dark:text-neutral-400">
                        ${app.annual_income.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          app.prediction === 'Approved'
                            ? 'bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400'
                            : 'bg-danger-50 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400'
                        }`}>
                          {app.prediction === 'Approved' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {app.prediction}
                        </span>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{app.probability}% prob.</div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className={`text-xs font-medium ${
                          app.risk_level === 'Low' ? 'text-accent-600 dark:text-accent-400' :
                          app.risk_level === 'Medium' ? 'text-warning-600 dark:text-warning-400' :
                          'text-danger-600 dark:text-danger-400'
                        }`}>
                          {app.risk_level}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-xs text-neutral-500 dark:text-neutral-400">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2 rounded-lg text-neutral-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(app.id)}
                            className="p-2 rounded-lg text-neutral-500 hover:bg-danger-50 dark:hover:bg-danger-900/30 hover:text-danger-600 dark:hover:text-danger-400 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedApp && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedApp(null)}
          >
            <div
              className="glass-card max-w-2xl w-full max-h-[85vh] overflow-y-auto scrollbar-thin p-6 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">
                  Application Details
                </h3>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Prediction Summary */}
              <div className={`p-4 rounded-xl mb-6 ${
                selectedApp.prediction === 'Approved'
                  ? 'bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800'
                  : 'bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedApp.prediction === 'Approved' ? (
                      <CheckCircle2 className="w-8 h-8 text-accent-500" />
                    ) : (
                      <XCircle className="w-8 h-8 text-danger-500" />
                    )}
                    <div>
                      <div className={`font-display font-bold text-xl ${
                        selectedApp.prediction === 'Approved' ? 'text-accent-600 dark:text-accent-400' : 'text-danger-600 dark:text-danger-400'
                      }`}>
                        {selectedApp.prediction}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {selectedApp.probability}% probability · {selectedApp.risk_level} risk · {selectedApp.confidence_score}% confidence
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-500" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['Name', selectedApp.applicant_name],
                    ['Age', `${selectedApp.age}`],
                    ['Gender', selectedApp.gender],
                    ['Marital Status', selectedApp.marital_status],
                    ['Education', selectedApp.education],
                    ['Employment', selectedApp.employment_type],
                    ['Dependents', `${selectedApp.dependents}`],
                    ['Residence', selectedApp.residential_status],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                      <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
                      <span className="font-medium text-neutral-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Info */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent-500" />
                  Financial Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['Annual Income', `$${selectedApp.annual_income.toLocaleString()}`],
                    ['Monthly Salary', `$${selectedApp.monthly_salary.toLocaleString()}`],
                    ['Credit Score', `${selectedApp.credit_score}`],
                    ['DTI Ratio', `${selectedApp.debt_to_income_ratio}%`],
                    ['Existing Loans', `$${selectedApp.existing_loan_amount.toLocaleString()}`],
                    ['Monthly Expenses', `$${selectedApp.monthly_expenses.toLocaleString()}`],
                    ['Years Employed', `${selectedApp.years_employment}`],
                    ['Credit Cards', `${selectedApp.existing_credit_cards}`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                      <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
                      <span className="font-medium text-neutral-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Details */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning-500" />
                  Other Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['Property', selectedApp.property_ownership],
                    ['Loan History', selectedApp.loan_history],
                    ['Previous Defaults', selectedApp.previous_defaults],
                    ['Date', new Date(selectedApp.created_at).toLocaleString()],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                      <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
                      <span className="font-medium text-neutral-900 dark:text-white text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation */}
              {selectedApp.recommendation && (
                <div className="p-4 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                  <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-2">
                    AI Recommendation
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {selectedApp.recommendation}
                  </p>
                </div>
              )}

              {/* Reasons */}
              {selectedApp.reasons && selectedApp.reasons.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-2">
                    Key Factors
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedApp.reasons.map((reason, i) => (
                      <li key={i} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                        <span className="text-primary-500 mt-0.5">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setDeleteConfirm(null)}
          >
            <div
              className="glass-card max-w-sm w-full p-6 animate-scale-in text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-danger-50 dark:bg-danger-900/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-danger-500" />
              </div>
              <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">
                Delete Application?
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                This action cannot be undone. The application will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-danger-600 hover:bg-danger-700 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
