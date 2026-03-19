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
    // Tracking existing documents from backend
    currentEvaluationName: '',
    currentQualityCertName: '',
    expiryDate: ''
  };

  constructor(private http: HttpClient, private supplierService: SupplierService) { }

  ngOnInit() {
    this.setDefaultExpiry();
    this.loadStatuses();
    
    this.supplierService.selectedSupplier$.subscribe(supplier => {
      if (supplier) {
        this.supplierData = supplier;
        this.patchSupplierForm(supplier);
        this.step = 2; 
      }
    });
  }

  patchSupplierForm(supplier: any) {
    if (this.form && supplier) {
      this.form.id = supplier.id;
      this.form.name = supplier.name;
      this.form.email = supplier.email || '';
      this.form.hasCert = !!supplier.hasQualityCert; 
      this.form.poNumber = supplier.poNumber || '';
      this.form.poDate = supplier.poDate || '';

      // Map Trade References
      if (supplier.tradeReferences) {
        this.form.tradeReferences = typeof supplier.tradeReferences === 'string' 
          ? JSON.parse(supplier.tradeReferences) 
          : supplier.tradeReferences;
      }

      // --- PATCH DOCUMENTS ---
      if (supplier.Documents && supplier.Documents.length > 0) {
        const evalDoc = supplier.Documents.find((d: any) => d.documentType === 'EVALUATION');
        const qualDoc = supplier.Documents.find((d: any) => d.documentType === 'QUALITY_CERT' || d.documentType === 'QUALITY');
        
        this.form.currentEvaluationName = evalDoc ? evalDoc.fileName : '';
        this.form.currentQualityCertName = qualDoc ? qualDoc.fileName : '';
      }

      // if (supplier.expiryDate) {
      //   this.form.expiryDate = new Date(supplier.expiryDate).toISOString().split('T')[0];
      // }
      // Date Patching Fix
    if (supplier.expiryDate) {
      // Split by 'T' to get only the date part, avoiding timezone conversion
      this.form.expiryDate = supplier.expiryDate.split('T')[0];
    } else {
      this.setDefaultExpiry();
    }

      this.syncStatusLogic();
    }
  }

  // loadStatuses() {
  //   this.supplierService.getOnboardingStatuses().subscribe({
  //     next: (data: any) => {
  //       this.onboardingStatuses = data;
  //       if (this.supplierData) {
  //         this.patchSupplierForm(this.supplierData);
  //       }
  //     }
  //   });
  // }

  loadStatuses() {
  this.supplierService.getOnboardingStatuses().subscribe({
    next: (data: any[]) => {
      this.onboardingStatuses = data;
      // Now that we have the list, calculate the ID
      this.syncStatusLogic(); 
      
      if (this.supplierData) {
        this.patchSupplierForm(this.supplierData);
      }
    },
    error: (err) => console.error('Could not load system statuses', err)
  });
}

  // syncStatusLogic() {
  //   let code = '';
  //   if (this.form.hasCert) {
  //     code = 'ONE_YEAR';
  //   } else if (this.isRareCase) {
  //     code = 'CONDITIONAL';
  //   } else {
  //     code = 'ONE_TIME';
  //   }

  //   const found = this.onboardingStatuses.find(s => s.code === code);
  //   if (found) this.selectedStatusId = found.id;
  // }

  syncStatusLogic() {
  // 1. Determine the code based on the form state
  let code = '';
  if (this.form.hasCert) {
    code = 'ONE_YEAR';
  } else if (this.isRareCase) {
    code = 'CONDITIONAL';
  } else {
    code = 'ONE_TIME';
  }

  // 2. Safety check: If statuses aren't loaded yet, we can't find the ID
  if (!this.onboardingStatuses || this.onboardingStatuses.length === 0) {
    return; 
  }

  // 3. Find and assign the ID
  const found = this.onboardingStatuses.find(s => s.code === code);
  if (found) {
    this.selectedStatusId = found.id;
    console.log(`System Status Auto-Mapped: ${found.label} (ID: ${found.id})`);
  }
}

setDefaultExpiry() {
  // Only set if we aren't editing
  if (!this.form.id) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    
    // Correct way to get YYYY-MM-DD without UTC timezone shift
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    this.form.expiryDate = `${year}-${month}-${day}`;
  }
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

    if (this.form.id) formData.append('id', this.form.id.toString());
    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    formData.append('hasQualityCert', String(this.form.hasCert));
    formData.append('expiryDate', this.form.expiryDate);

    const hasRefs = !this.form.hasCert && !this.isRareCase;
    formData.append('hasSefAndTradeRef', String(hasRefs));

    if (this.selectedStatusId) {
      formData.append('onboardingStatusId', this.selectedStatusId.toString());
    }

    if (!this.form.hasCert) {
      formData.append('poNumber', this.form.poNumber || '');
      formData.append('poDate', this.form.poDate || '');
      if (!this.isRareCase) {
        formData.append('tradeReferences', JSON.stringify(this.form.tradeReferences));
      }
    }

    if (this.form.evaluationFile) formData.append('evaluationDoc', this.form.evaluationFile);
    if (this.form.hasCert && this.form.qualityCertFile) formData.append('qualityDoc', this.form.qualityCertFile);

    const request = this.form.id 
      ? this.supplierService.updateSupplier(this.form.id, formData)
      : this.supplierService.registerSupplier(formData);

    request.subscribe({
      next: (res: any) => {
        this.loading = false;
        alert(this.form.id ? 'Update Successful!' : `Registered: ${res.internalSupplierNumber}`);
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Operation failed');
      }
    });
  }

  resetForm() {
    this.step = 1;
    this.form = {
      id: null, name: '', email: '', hasCert: true, poNumber: '', poDate: '',
      tradeReferences: [
        { companyName: '', email: '', phone: '', response: '' },
        { companyName: '', email: '', phone: '', response: '' }, 
        { companyName: '', email: '', phone: '', response: '' }, 
        { companyName: '', email: '', phone: '', response: '' }
      ],
      evaluationFile: null, qualityCertFile: null, 
      currentEvaluationName: '', currentQualityCertName: '', 
      expiryDate: ''
    };
    this.setDefaultExpiry();
    this.syncStatusLogic();
  }
}