export interface SupplierDoc {
  id: string;
  documentType: string;
  fileName: string;
  status: string;
  created_at: string;
}

// Then in your next block:
// next: (data: { Documents: SupplierDoc[], name: string }) => { ... }