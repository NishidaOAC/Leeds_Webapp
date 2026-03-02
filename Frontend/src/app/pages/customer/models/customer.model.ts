export interface DocumentMetadata {
  documentType: 'KYC' | 'EXPORT_COMPLIANCE' | 'EUC' | 'ECC' | 'TAX_ID';
  isOneTime: boolean;
  validFrom: string; // ISO Date string
  validTo: string | null;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'REJECTED';
  remarks?: string;
}

export interface Customer {
  id?: string; // Optional for new customers, required for existing
  name: string;
  customerType: 'AIRLINE' | 'MRO' | 'OTHER';
  isActive?: boolean;
  Documents?: DocumentMetadata[]; // For when you fetch data back
}