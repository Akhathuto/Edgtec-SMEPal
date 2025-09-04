export enum Tool {
  INVOICE = 'Invoice Generator',
  TAX = 'Tax Calculator',
  PAYROLL = 'Payroll Reminders',
  CONTRACT = 'Contract Assistant',
  CLIENTS = 'Client Management',
  COMPANY_REGISTRATION = 'Company Registration',
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

export interface InvoiceDetails {
  fromName: string;
  fromAddress: string;
  fromBusinessNumber?: string;
  toName: string;
  toAddress: string;
  toVatNumber?: string;
  invoiceNumber: string;
  date: string;
  paymentTerms?: string;
  items: InvoiceItem[];
  notes: string;
  header?: string;
  footer?: string;
  companyLogo?: string;
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
}

export interface CompanyRegistrationData {
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
  }
}