import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import InvoiceGenerator from './components/InvoiceGenerator';
import TaxCalculator from './components/TaxCalculator';
import PayrollReminders from './components/PayrollReminders';
import ContractAssistant from './components/ContractAssistant';
import ClientManager from './components/ClientManager';
import Header from './components/Header';
import { Tool } from './types';
import About from './components/About';
import Contact from './components/Contact';
import HelpSupport from './components/HelpSupport';
import CompanyRegistration from './components/CompanyRegistration';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(Tool.INVOICE);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveTool = useCallback(() => {
    switch (activeTool) {
      case Tool.INVOICE:
        return <InvoiceGenerator />;
      case Tool.TAX:
        return <TaxCalculator />;
      case Tool.PAYROLL:
        return <PayrollReminders />;
      case Tool.CONTRACT:
        return <ContractAssistant />;
      case Tool.CLIENTS:
        return <ClientManager />;
      case Tool.COMPANY_REGISTRATION:
        return <CompanyRegistration />;
      case Tool.ABOUT:
        return <About />;
      case Tool.CONTACT:
        return <Contact />;
      case Tool.HELP:
        return <HelpSupport />;
      default:
        return <InvoiceGenerator />;
    }
  }, [activeTool]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
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
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActiveTool()}
        </main>
      </div>
    </div>
  );
};

export default App;