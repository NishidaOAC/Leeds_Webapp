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

// --- UPDATE THIS SECTION AT THE TOP OF YOUR CLASS ---
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
  
  // ADD 's3Key?: string' HERE
// Replace your additionalCerts definition with this:
additionalCerts: [
  { 
    name: '', 
    file: null as File | null, 
    currentFileName: '', 
    s3Key: undefined as string | undefined // Use undefined here
  }
],
  
  currentEvaluationName: '',
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

  // --- Dynamic Cert Management ---
 addCertSlot() {
  this.form.additionalCerts.push({ 
    name: '', 
    file: null, 
    currentFileName: '', 
    s3Key: undefined 
  });
}

  removeCert(index: number) {
    this.form.additionalCerts.splice(index, 1);
  }

  uploadCert(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.form.additionalCerts[index].file = file;
    }
  }

patchSupplierForm(supplier: any) {
    if (this.form && supplier) {
      this.form.id = supplier.id;
      this.form.name = supplier.name;
      this.form.email = supplier.email || '';
      this.form.hasCert = !!supplier.hasQualityCert; 
      this.form.poNumber = supplier.poNumber || '';
      this.form.poDate = supplier.poDate || '';

      if (supplier.tradeReferences) {
        this.form.tradeReferences = typeof supplier.tradeReferences === 'string' 
          ? JSON.parse(supplier.tradeReferences) 
          : supplier.tradeReferences;
      }

      if (supplier.certifications && Array.isArray(supplier.certifications)) {
        this.form.additionalCerts = supplier.certifications.map((c: any) => ({
          name: c.type,
          file: null,
          currentFileName: c.fileName,
          s3Key: c.s3Key // Correctly mapped
        }));
      } else {
        // FIX: Added s3Key: undefined here
        this.form.additionalCerts = [{ name: '', file: null, currentFileName: '', s3Key: undefined }];
      }

      if (supplier.Documents) {
        const evalDoc = supplier.Documents.find((d: any) => d.documentType === 'EVALUATION');
        this.form.currentEvaluationName = evalDoc ? evalDoc.fileName : '';
      }

      if (supplier.expiryDate) {
        this.form.expiryDate = supplier.expiryDate.split('T')[0];
      }
      this.syncStatusLogic();
    }
  }
  loadStatuses() {
    this.supplierService.getOnboardingStatuses().subscribe({
      next: (data: any[]) => {
        this.onboardingStatuses = data;
        this.syncStatusLogic(); 
      }
    });
  }

  syncStatusLogic() {
    let code = this.form.hasCert ? 'ONE_YEAR' : (this.isRareCase ? 'CONDITIONAL' : 'ONE_TIME');
    if (!this.onboardingStatuses.length) return;
    const found = this.onboardingStatuses.find(s => s.code === code);
    if (found) this.selectedStatusId = found.id;
  }

  setDefaultExpiry() {
    if (!this.form.id) {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      this.form.expiryDate = date.toISOString().split('T')[0];
    }
  }

  setQualityStatus(val: boolean) {
    this.form.hasCert = val;
    this.isRareCase = false;
    this.syncStatusLogic();
  }

  toggleConditional() { this.syncStatusLogic(); }

  upload(event: any, type: 'EVAL') {
    const file = event.target.files[0];
    if (file) this.form.evaluationFile = file;
  }

  getSelectedStatusLabel(): string {
    return this.onboardingStatuses.find(s => s.id == this.selectedStatusId)?.label || 'Select Status';
  }

  getSelectedStatusCode(): string {
    return this.onboardingStatuses.find(s => s.id == this.selectedStatusId)?.code || '';
  }

  next() { if (this.step < 3) this.step++; }
  prev() { if (this.step > 1) this.step--; }

  submitold() {
    this.loading = true;
    const formData = new FormData();

    if (this.form.id) formData.append('id', this.form.id.toString());
    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    formData.append('hasQualityCert', String(this.form.hasCert));
    formData.append('expiryDate', this.form.expiryDate);

    const hasRefs = !this.form.hasCert && !this.isRareCase;
    formData.append('hasSefAndTradeRef', String(hasRefs));

    if (this.selectedStatusId) formData.append('onboardingStatusId', this.selectedStatusId.toString());

    if (!this.form.hasCert) {
      formData.append('poNumber', this.form.poNumber || '');
      formData.append('poDate', this.form.poDate || '');
      if (!this.isRareCase) formData.append('tradeReferences', JSON.stringify(this.form.tradeReferences));
    }

    if (this.form.evaluationFile) formData.append('evaluationDoc', this.form.evaluationFile);

    // Append multiple quality certs
    this.form.additionalCerts.forEach((cert, index) => {
      if (cert.file) {
        formData.append('qualityDocs', cert.file);
        formData.append('qualityDocNames', cert.name || `Cert_${index + 1}`);
      }
    });

    const request = this.form.id 
      ? this.supplierService.updateSupplier(this.form.id, formData)
      : this.supplierService.registerSupplier(formData);

    request.subscribe({
      next: (res: any) => {
        this.loading = false;
        alert(this.form.id ? 'Update Successful!' : `Registered Successfully`);
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Operation failed');
      }
    });
  }

  submit() {
  this.loading = true;
  const formData = new FormData();

  if (this.form.id) formData.append('id', this.form.id.toString());
  formData.append('name', this.form.name);
  formData.append('email', this.form.email);
  formData.append('hasQualityCert', String(this.form.hasCert));
  formData.append('expiryDate', this.form.expiryDate);

  // --- UPDATED AREA: Handle Existing vs New Certs ---
  if (this.form.id) {
    // Collect certs that already exist on the server and weren't deleted in UI
    const keptCerts = this.form.additionalCerts
      .filter(cert => cert.s3Key && !cert.file) 
      .map(cert => ({
        type: cert.name,
        fileName: cert.currentFileName,
        s3Key: cert.s3Key
      }));
    
    formData.append('existingCerts', JSON.stringify(keptCerts));
  }

  // Append ONLY truly new files
  this.form.additionalCerts.forEach((cert, index) => {
    if (cert.file) {
      formData.append('qualityDocs', cert.file);
      formData.append('qualityDocNames', cert.name || `Cert_${index + 1}`);
    }
  });
  // ------------------------------------------------

  const hasRefs = !this.form.hasCert && !this.isRareCase;
  formData.append('hasSefAndTradeRef', String(hasRefs));

  if (this.selectedStatusId) formData.append('onboardingStatusId', this.selectedStatusId.toString());

  if (!this.form.hasCert) {
    formData.append('poNumber', this.form.poNumber || '');
    formData.append('poDate', this.form.poDate || '');
    if (!this.isRareCase) formData.append('tradeReferences', JSON.stringify(this.form.tradeReferences));
  }

  if (this.form.evaluationFile) formData.append('evaluationDoc', this.form.evaluationFile);

  const request = this.form.id 
    ? this.supplierService.updateSupplier(this.form.id, formData)
    : this.supplierService.registerSupplier(formData);

  request.subscribe({
    next: (res: any) => {
      this.loading = false;
      alert(this.form.id ? 'Update Successful!' : `Registered Successfully`);
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
      evaluationFile: null,
      // FIX: Added s3Key: undefined here
      additionalCerts: [{ name: '', file: null, currentFileName: '', s3Key: undefined }],
      currentEvaluationName: '', 
      expiryDate: ''
    };
    this.setDefaultExpiry();
    this.syncStatusLogic();
  }
}