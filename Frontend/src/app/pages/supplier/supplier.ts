import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SupplierService } from './services/supplier.service';
import { SupplierList } from './supplier-list/supplier-list';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, SupplierList],
  templateUrl: './supplier.html',
  styleUrl: './supplier.scss',
})
export class Supplier implements OnInit {
  step: number = 1;
  isListView: boolean = false;
  loading: boolean = false;
  isRareCase: boolean = false;
  supplierData: any;

  // New: List of statuses from backend
  onboardingStatuses: any[] = [];
  selectedStatusId: number | null = null;

  form = {
    id: null as number | null,
    name: '',
    email: '',
    hasCert: true,
    poNumber: '',
    poDate: '',
    tradeReferences: [
      { companyName: '', email: '', phone: '', response: '' },
      { companyName: '', email: '', phone: '', response: '' },
      { companyName: '', email: '', phone: '', response: '' },
      { companyName: '', email: '', phone: '', response: '' }
    ],
    evaluationFile: null as File | null,
    qualityCertFile: null as File | null,
    expiryDate: ''
  };

  constructor(private http: HttpClient, private supplierService: SupplierService) { }

  ngOnInit() {
    this.setDefaultExpiry();
    this.loadStatuses();
    
    // Listen for "Request Update" from the Watchlist
    this.supplierService.selectedSupplier$.subscribe(supplier => {
      if (supplier) {
        this.supplierData = supplier;
        this.patchSupplierForm(supplier);
        this.step = 2; // Auto-jump to Compliance/Document step
      }
    });
  }

patchSupplierForm(supplier: any) {
  if (this.form && supplier) {
    // 1. Map the basic info
    this.form.id = supplier.id;
    this.form.name = supplier.name;
    this.form.email = supplier.email || '';
    
    // 2. Map the critical "Logic" fields
    // Ensure we use the value from the DB, not the default 'true'
    this.form.hasCert = !!supplier.hasQualityCert; 
    
    // 3. Handle Date Formatting (Input type="date" requires YYYY-MM-DD)
    if (supplier.expiryDate) {
      this.form.expiryDate = new Date(supplier.expiryDate).toISOString().split('T')[0];
    }

    // 4. Force the UI logic to recalculate the Path/Status based on THIS supplier
    this.syncStatusLogic();
  }
}

  // loadStatuses() {
  //   this.supplierService.getOnboardingStatuses().subscribe({
  //     next: (data: any) => {
  //       this.onboardingStatuses = data;
  //       this.syncStatusLogic(); 
  //     },
  //     error: () => console.error("Could not load statuses")
  //   });
  // }

  loadStatuses() {
  this.supplierService.getOnboardingStatuses().subscribe({
    next: (data: any) => {
      this.onboardingStatuses = data;
      // Re-run sync once statuses are available
      if (this.supplierData) {
        this.patchSupplierForm(this.supplierData);
      }
    }
  });
}

  syncStatusLogic() {
    let code = '';
    if (this.form.hasCert) {
      code = 'ONE_YEAR';
    } else if (this.isRareCase) {
      code = 'CONDITIONAL';
    } else {
      code = 'ONE_TIME';
    }

    const found = this.onboardingStatuses.find(s => s.code === code);
    if (found) this.selectedStatusId = found.id;
  }

  setDefaultExpiry() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    this.form.expiryDate = date.toISOString().split('T')[0];
  }

  setQualityStatus(val: boolean) {
    this.form.hasCert = val;
    this.isRareCase = false;
    this.syncStatusLogic();
  }

  toggleConditional() {
    this.syncStatusLogic();
  }

  upload(event: any, type: 'EVAL' | 'QUALITY') {
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedExtensions.includes(file.type)) {
      alert('Invalid file type. Please upload a PDF, JPG, or PNG.');
      event.target.value = '';
      return;
    }

    if (type === 'EVAL') {
      this.form.evaluationFile = file;
    } else {
      this.form.qualityCertFile = file;
    }
  }

  getSelectedStatusLabel(): string {
    const status = this.onboardingStatuses.find(s => s.id == this.selectedStatusId);
    return status ? status.label : 'Select Status';
  }

  getSelectedStatusCode(): string {
    const status = this.onboardingStatuses.find(s => s.id == this.selectedStatusId);
    return status ? status.code : '';
  }

  next() { if (this.step < 3) this.step++; }
  prev() { if (this.step > 1) this.step--; }

submit() {
  this.loading = true;
  const formData = new FormData();

  // 1. Core Identification (Include ID if updating)
  if (this.form.id) {
    formData.append('id', this.form.id.toString());
  }

  // 2. Basic Information
  formData.append('name', this.form.name);
  formData.append('email', this.form.email);
  formData.append('hasQualityCert', String(this.form.hasCert));
  formData.append('expiryDate', this.form.expiryDate);

  // 3. Status & Logic Fields 
  // Note: Backend uses 'hasSefAndTradeRef' to check for "One-Time" vs "Conditional"
  const hasRefs = !this.form.hasCert && !this.isRareCase;
  formData.append('hasSefAndTradeRef', String(hasRefs));

  if (this.selectedStatusId) {
    formData.append('onboardingStatusId', this.selectedStatusId.toString());
  }

  // 4. Conditional PO & Trade Ref Data
  if (!this.form.hasCert) {
    formData.append('poNumber', this.form.poNumber || '');
    formData.append('poDate', this.form.poDate || '');
    if (!this.isRareCase) {
      formData.append('tradeReferences', JSON.stringify(this.form.tradeReferences));
    }
  }

  // 5. File Uploads
  if (this.form.evaluationFile) {
    formData.append('evaluationDoc', this.form.evaluationFile);
  }
  if (this.form.hasCert && this.form.qualityCertFile) {
    formData.append('qualityDoc', this.form.qualityCertFile);
  }

  // 6. Branching Logic: Update vs Register
  if (this.form.id) {
    // --- UPDATE PATH (PUT) ---
    this.supplierService.updateSupplier(this.form.id, formData).subscribe({
      next: (response: any) => {
        this.loading = false;
        alert('Update Successful! Supplier documents have been refreshed.');
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        console.error('Update Error:', err);
        alert(err.error?.message || 'Update failed. Check console for details.');
      }
    });
  } else {
    // --- REGISTER PATH (POST) ---
    this.supplierService.registerSupplier(formData).subscribe({
      next: (response: any) => {
        this.loading = false;
        const suplierNo = response.internalSupplierNumber || 'Success';
        alert(`Registration Success! Supplier Number: ${suplierNo}`);
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Registration failed.');
      }
    });
  }
}
  resetForm() {
    this.step = 1;
    this.form = {
      id: null, name: '', email: '', hasCert: true, poNumber: '', poDate: '',
      tradeReferences: [{ companyName: '', email: '', phone: '', response: '' }, { companyName: '', email: '', phone: '', response: '' }, { companyName: '', email: '', phone: '', response: '' }, { companyName: '', email: '', phone: '', response: '' }],
      evaluationFile: null, qualityCertFile: null, expiryDate: ''
    };
    this.setDefaultExpiry();
    this.syncStatusLogic();
  }
}