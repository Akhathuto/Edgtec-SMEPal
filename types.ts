import { Type } from "@google/genai";
export enum Tool {
  DASHBOARD = 'Dashboard',
  ADVISOR = 'AI Business Advisor',
  INVOICE = 'Invoice Generator',
  TAX = 'Tax Calculator',
  PAYROLL = 'Payroll Reminders',
  CONTRACT = 'Contract Assistant',
  CLIENTS = 'Client Management',
  COMPANY_REGISTRATION = 'Company Registration',
  COMPLIANCE = 'Compliance Assistant',
  DIRECTOR_VERIFICATION = 'Director Verification',
  EXPENSES = 'Receipt Scanner',
  MARKETING = 'Marketing Assistant',
  USER_PROFILE = 'User Profile',
  SETTINGS = 'Application Settings',
  ABOUT = 'About Us',
  CONTACT = 'Contact Us',
  HELP = 'Help & Support',
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type InvoiceTheme = 'standard' | 'modern' | 'minimal' | 'bold';

export interface InvoiceDetails {
  id?: string;
  fromName: string;
  fromAddress: string;
  fromBusinessNumber?: string;
  fromVatNumber?: string;
  toName: string;
  toAddress: string;
  toBusinessNumber?: string;
  toVatNumber?: string;
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  paymentTerms?: string;
  paymentLink?: string;
  bankDetails?: string;
  items: InvoiceItem[];
  notes: string;
  header?: string;
  footer?: string;
  companyLogo?: string;
  theme?: InvoiceTheme;
}

export interface TaxCalculationResult {
  taxableIncome: string;
  estimatedTax: string;
  notes: string[];
}

export interface GeneratedContract {
    title: string;
    clauses: {
        heading: string;
        body: string;
    }[];
}

export interface Client {
  id: string;
  name: string;
  address: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
}

export interface Director {
  id: string;
  fullName: string;
  identificationType: 'SA ID' | 'Passport';
  identificationNumber: string;
  phone: string;
  email: string;
  physicalAddress: string;
  postalAddress: string;
  shareholding: number;
}

export enum CompanyType {
  PRIVATE_COMPANY = 'Private Company ((Pty) Ltd)',
  NON_PROFIT_COMPANY = 'Non-Profit Company (NPC)',
}

export interface CompanyRegistrationData {
  companyType: CompanyType;
  names: {
    name1: string;
    name2: string;
    name3: string;
    name4: string;
  };
  businessPhysicalAddress: string;
  businessPostalAddress: string;
  yearEnd: string;
  directors: Director[];
  primaryContact: {
    name: string;
    email: string;
  };
  directorIdDocuments: Record<string, File | null>; // Keyed by director ID
  businessAddressProof: File | null;
}

export interface ComplianceGuide {
  title: string;
  introduction: string;
  requiredDocuments: string[];
  steps: {
    step: number;
    instruction: string;
    details: string;
  }[];
  disclaimer: string;
}

export interface DirectorVerificationResult {
    status: 'Verified' | 'Attention Required' | 'Invalid';
    message: string;
    recommendations: string[];
    commonIssues: string[];
    disclaimer: string;
}

export interface Owner {
  name: string;
  percentage: string;
}

export interface OwnershipData {
  legalName: string;
  registrationNumber: string;
  owners: Owner[];
}

export interface Expense {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  taxAmount?: number;
  category: string;
  description?: string;
  createdAt?: string;
}

export interface MarketingContent {
    platform: string;
    content: string;
    hashtags: string[];
    imageIdea: string;
}