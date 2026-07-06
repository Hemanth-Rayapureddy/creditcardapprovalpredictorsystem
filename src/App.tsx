import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PredictPage from './pages/PredictPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import { Page } from './types';

function AppContent() {
  const [page, setPage] = useState<Page>('home');

  const handleNavigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as Page;
      if (['home', 'about', 'predict', 'dashboard', 'admin', 'auth'].includes(hash)) {
        setPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateWithHash = (p: Page) => {
    window.location.hash = p;
    handleNavigate(p);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <Navbar currentPage={page} onNavigate={handleNavigateWithHash} />
      <main className="flex-1">
        {page === 'home' && <HomePage onNavigate={handleNavigateWithHash} />}
        {page === 'about' && <AboutPage onNavigate={handleNavigateWithHash} />}
        {page === 'predict' && <PredictPage onNavigate={handleNavigateWithHash} />}
        {page === 'dashboard' && <DashboardPage onNavigate={handleNavigateWithHash} />}
        {page === 'admin' && <AdminPage onNavigate={handleNavigateWithHash} />}
        {page === 'auth' && <AuthPage onNavigate={handleNavigateWithHash} />}
      </main>
      <Footer onNavigate={handleNavigateWithHash} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
