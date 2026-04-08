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
import LandingPage from './components/LandingPage';
import StaticPage, { StaticPageSlug } from './components/StaticPage';
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
import UpgradeModal from './components/common/UpgradeModal';
import { auth, onAuthStateChanged, logout, User, db, doc, getDoc, getUserProfile } from './firebase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [staticPage, setStaticPage] = useState<StaticPageSlug | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>(Tool.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  
  // App Settings State
  const [appSettings, setAppSettings] = useState({
    compactMode: false,
    highContrastForms: false
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Check if user needs onboarding by looking at Firestore
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (!profile || !profile.onboardingComplete) {
            setNeedsOnboarding(true);
          } else {
            setNeedsOnboarding(false);
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          // Fallback to local storage if firestore fails (e.g. rules not yet active)
          const localOnboarding = localStorage.getItem(`smepal_onboarding_${currentUser.uid}`);
          setNeedsOnboarding(!localOnboarding);
        }
      }
      
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Load settings
  useEffect(() => {
    const settingsStr = localStorage.getItem('smepal_app_settings');
    if (settingsStr) {
      setAppSettings(JSON.parse(settingsStr));
    }

    const handleStorageChange = () => {
        const updatedSettings = localStorage.getItem('smepal_app_settings');
        if (updatedSettings) setAppSettings(JSON.parse(updatedSettings));
    };
    window.addEventListener('storage', handleStorageChange);

    const handleOpenUpgrade = () => setIsUpgradeModalOpen(true);
    window.addEventListener('open-upgrade-modal', handleOpenUpgrade);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('open-upgrade-modal', handleOpenUpgrade);
    };
  }, []);

  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);
    if (user) {
      localStorage.setItem(`smepal_onboarding_${user.uid}`, 'true');
    }
    showToast("Business profile initialized successfully.", "success");
  };

  const handleLogout = async () => {
    try {
      await logout();
      setActiveTool(Tool.DASHBOARD);
      setNeedsOnboarding(false);
    } catch (error) {
      showToast("Logout failed. Please try again.", "error");
    }
  };

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  }, []);

  const renderActiveTool = useCallback(() => {
    if (!user) return <Dashboard onNavigate={setActiveTool} />;

    switch (activeTool) {
      case Tool.DASHBOARD: return <Dashboard onNavigate={setActiveTool} />;
      case Tool.ADVISOR: return <BusinessAdvisor />;
      case Tool.INVOICE: return <InvoiceGenerator showToast={showToast} />;
      case Tool.TAX: return <TaxCalculator />;
      case Tool.EXPENSES: return <ReceiptScanner showToast={showToast} />;
      case Tool.MARKETING: return <MarketingAssistant showToast={showToast} />;
      case Tool.PAYROLL: return <PayrollReminders />;
      case Tool.CONTRACT: return <ContractAssistant showToast={showToast} />;
      case Tool.CLIENTS: return <ClientManager showToast={showToast} />;
      case Tool.COMPANY_REGISTRATION: return <CompanyRegistration showToast={showToast} />;
      case Tool.COMPLIANCE: return <ComplianceAssistant />;
      case Tool.DIRECTOR_VERIFICATION: return <DirectorVerification />;
      case Tool.USER_PROFILE: return <UserProfile showToast={showToast} />;
      case Tool.SETTINGS: return <Settings showToast={showToast} />;
      case Tool.ABOUT: return <About />;
      case Tool.CONTACT: return <Contact />;
      case Tool.HELP: return <HelpSupport />;
      default: return <Dashboard onNavigate={setActiveTool} />;
    }
  }, [activeTool, showToast, user]);

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    if (staticPage) {
      return <StaticPage slug={staticPage} onBack={() => setStaticPage(null)} onNavigate={setStaticPage} />;
    }
    if (showLogin) {
      return <LoginPage onBack={() => setShowLogin(false)} />;
    }
    return <LandingPage onSignIn={() => setShowLogin(true)} onStaticPage={setStaticPage} />;
  }

  if (needsOnboarding) {
    return <OnboardingWizard user={user} onComplete={handleOnboardingComplete} />;
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
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;
