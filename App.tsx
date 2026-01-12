import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BusinessAdvisor from './components/BusinessAdvisor';
import InvoiceGenerator from './components/InvoiceGenerator';
import TaxCalculator from './components/TaxCalculator';
import PayrollReminders from './components/PayrollReminders';
import ContractAssistant from './components/ContractAssistant';
import ClientManager from './components/ClientManager';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import OnboardingWizard from './components/OnboardingWizard';
import Settings from './components/Settings';
import { Tool } from './types';
import About from './components/About';
import Contact from './components/Contact';
import HelpSupport from './components/HelpSupport';
import CompanyRegistration from './components/CompanyRegistration';
import UserProfile from './components/UserProfile';
import ComplianceAssistant from './components/ComplianceAssistant';
import DirectorVerification from './components/DirectorVerification';
import ReceiptScanner from './components/ReceiptScanner';
import MarketingAssistant from './components/MarketingAssistant';
import Toast, { ToastType } from './components/common/Toast';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>(Tool.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);
  
  // App Settings State
  const [appSettings, setAppSettings] = useState({
    compactMode: false,
    highContrastForms: false
  });

  // Load settings and session
  useEffect(() => {
    const sessionStr = localStorage.getItem('smepal_session');
    const settingsStr = localStorage.getItem('smepal_app_settings');
    
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      setIsLoggedIn(true);
      // Only force onboarding if new signup and not yet complete
      if (session.isNewSignup && !localStorage.getItem('smepal_onboarding_complete')) {
        setNeedsOnboarding(true);
      }
    }

    if (settingsStr) {
      setAppSettings(JSON.parse(settingsStr));
    }

    // Listener for local storage changes to sync settings across tabs
    const handleStorageChange = () => {
        const updatedSettings = localStorage.getItem('smepal_app_settings');
        if (updatedSettings) setAppSettings(JSON.parse(updatedSettings));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = (credentials: { email: string; name?: string; company?: string }) => {
    const isNewSignup = !!(credentials.name || credentials.company);
    
    localStorage.setItem('smepal_session', JSON.stringify({ 
        email: credentials.email, 
        name: credentials.name || 'Jane Doe',
        company: credentials.company || 'Venture Ltd',
        isNewSignup: isNewSignup,
        time: Date.now() 
    }));
    
    setIsLoggedIn(true);
    
    if (isNewSignup) {
      setNeedsOnboarding(true);
      localStorage.removeItem('smepal_onboarding_complete');
    } else {
      setNeedsOnboarding(false);
    }
  };

  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);
    localStorage.setItem('smepal_onboarding_complete', 'true');
    
    const sessionStr = localStorage.getItem('smepal_session');
    if (sessionStr) {
        const session = JSON.parse(sessionStr);
        session.isNewSignup = false;
        localStorage.setItem('smepal_session', JSON.stringify(session));
    }
    
    showToast("Business profile initialized successfully.", "success");
  };

  const handleLogout = () => {
    localStorage.removeItem('smepal_session');
    localStorage.removeItem('smepal_onboarding_complete');
    setIsLoggedIn(false);
    setNeedsOnboarding(false);
    setActiveTool(Tool.DASHBOARD);
  };

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  }, []);

  const renderActiveTool = useCallback(() => {
    switch (activeTool) {
      case Tool.DASHBOARD: return <Dashboard onNavigate={setActiveTool} />;
      case Tool.ADVISOR: return <BusinessAdvisor />;
      case Tool.INVOICE: return <InvoiceGenerator showToast={showToast} />;
      case Tool.TAX: return <TaxCalculator />;
      case Tool.EXPENSES: return <ReceiptScanner />;
      case Tool.MARKETING: return <MarketingAssistant />;
      case Tool.PAYROLL: return <PayrollReminders />;
      case Tool.CONTRACT: return <ContractAssistant />;
      case Tool.CLIENTS: return <ClientManager showToast={showToast} />;
      case Tool.COMPANY_REGISTRATION: return <CompanyRegistration />;
      case Tool.COMPLIANCE: return <ComplianceAssistant />;
      case Tool.DIRECTOR_VERIFICATION: return <DirectorVerification />;
      case Tool.USER_PROFILE: return <UserProfile />;
      case Tool.SETTINGS: return <Settings />;
      case Tool.ABOUT: return <About />;
      case Tool.CONTACT: return <Contact />;
      case Tool.HELP: return <HelpSupport />;
      default: return <Dashboard onNavigate={setActiveTool} />;
    }
  }, [activeTool, showToast]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (needsOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className={`flex h-screen bg-slate-50 font-sans text-slate-700 selection:bg-indigo-100 selection:text-indigo-900 ${appSettings.compactMode ? 'compact-layout' : ''} ${appSettings.highContrastForms ? 'high-contrast-mode' : ''}`}>
      <Sidebar 
        activeTool={activeTool} 
        onSelectTool={(tool) => {
          setActiveTool(tool);
          setSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          activeTool={activeTool}
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
          onLogout={handleLogout}
        />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${appSettings.compactMode ? 'p-4 sm:p-6' : 'p-6 sm:p-8 lg:p-10'}`}>
          {renderActiveTool()}
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;