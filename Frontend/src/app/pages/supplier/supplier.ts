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

  // New: List of statuses from backend
  onboardingStatuses: any[] = [];
  selectedStatusId: number | null = null;

  form = {
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
  }

  loadStatuses() {
    this.supplierService.getOnboardingStatuses().subscribe({
      next: (data: any) => {
        this.onboardingStatuses = data;
        console.log('Loaded statuses:', this.onboardingStatuses);
        this.syncStatusWithCert(); // Set initial dropdown value
      },
      error: () => console.error("Could not load statuses")
    });
  }

  // Automatically updates dropdown when toggle changes
  syncStatusWithCert() {
    const code = this.form.hasCert ? 'ONE_YEAR' : 'ONE_TIME';
    const found = this.onboardingStatuses.find(s => s.code === code);
    if (found) this.selectedStatusId = found.id;
  }

  setDefaultExpiry() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    this.form.expiryDate = date.toISOString().split('T')[0];
  }

  upload(event: any, type: 'EVAL' | 'QUALITY') {
    const file = event.target.files[0];
    if (!file) return;

    // Define allowed types
    const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    if (!allowedExtensions.includes(file.type)) {
      alert('Invalid file type. Please upload a PDF, JPG, or PNG.');
      event.target.value = ''; // Reset the input
      return;
    }

    // File is valid - proceed
    if (type === 'EVAL') {
      this.form.evaluationFile = file;
    } else {
      this.form.qualityCertFile = file;
    }
  }

  next() { if (this.step < 3) this.step++; }
  prev() { if (this.step > 1) this.step--; }

  submit() {
    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    formData.append('hasQualityCert', String(this.form.hasCert));
    formData.append('expiryDate', this.form.expiryDate);


    // Send the ID from our dropdown
    if (this.selectedStatusId) {
      formData.append('onboardingStatusId', this.selectedStatusId.toString());
    }

    if (!this.form.hasCert) {
      formData.append('poNumber', this.form.poNumber);
      formData.append('poDate', this.form.poDate);
      formData.append('tradeReferences', JSON.stringify(this.form.tradeReferences));
    }

    if (this.form.evaluationFile) formData.append('evaluationDoc', this.form.evaluationFile);
    if (this.form.hasCert && this.form.qualityCertFile) formData.append('qualityDoc', this.form.qualityCertFile);

    this.supplierService.registerSupplier(formData).subscribe({
      next: (response: any) => {
        this.loading = false;
        const suplierNo = response.internalSupplierNumber || 'Generated Successfully';

        alert(`Success! Supplier Number: ${suplierNo}`);
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        alert(err.error?.message || 'Registration failed.');
      }
    });
  }

  resetForm() {
    this.step = 1;
    this.form = {
      name: '', email: '', hasCert: true, poNumber: '', poDate: '',
      tradeReferences: this.form.tradeReferences.map(() => ({ companyName: '', email: '', phone: '', response: '' })),
      evaluationFile: null, qualityCertFile: null, expiryDate: ''
    };
    this.setDefaultExpiry();
    this.syncStatusWithCert();
  }

  // Add these to your existing component class
  isRareCase: boolean = false;

  setQualityStatus(val: boolean) {
    this.form.hasCert = val;
    this.isRareCase = false; // Reset rare case if they change quality cert
    this.syncStatusLogic();
  }

  toggleConditional() {
    this.syncStatusLogic();
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

  getSelectedStatusLabel(): string {
    const status = this.onboardingStatuses.find(s => s.id == this.selectedStatusId);
    return status ? status.label : 'Select Status';
  }

  getSelectedStatusCode(): string {
    const status = this.onboardingStatuses.find(s => s.id == this.selectedStatusId);
    return status ? status.code : '';
  }
}