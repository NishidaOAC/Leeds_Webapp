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

  form = {
    name: '',
    email: '',
    hasCert: true,
    // Added PO fields
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
    expiryDate: '' // Now manually modifiable
  };

  constructor(private http: HttpClient, private supplierService: SupplierService) {}

  ngOnInit() {
    this.setDefaultExpiry();
  }

  // Sets a default of 1 year, but user can change it manually in the UI
  setDefaultExpiry() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    this.form.expiryDate = date.toISOString().split('T')[0]; 
  }

  upload(event: any, type: 'EVAL' | 'QUALITY') {
    const file = event.target.files[0];
    if (file) {
      if (type === 'EVAL') {
        this.form.evaluationFile = file;
      } else {
        this.form.qualityCertFile = file;
      }
    }
  }

  next() {
    if (this.step < 3) this.step++;
  }

  prev() {
    if (this.step > 1) this.step--;
  }

  submit() {
    this.loading = true;

    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    formData.append('hasQualityCert', String(this.form.hasCert));
    formData.append('expiryDate', this.form.expiryDate); // Manual date
    
    // Send PO details if not certified
    if (!this.form.hasCert) {
      formData.append('poNumber', this.form.poNumber);
      formData.append('poDate', this.form.poDate);
      formData.append('tradeReferences', JSON.stringify(this.form.tradeReferences));
    }

    if (this.form.evaluationFile) {
      formData.append('evaluationDoc', this.form.evaluationFile);
    }

    if (this.form.hasCert && this.form.qualityCertFile) {
      formData.append('qualityDoc', this.form.qualityCertFile);
    } 

    this.supplierService.registerSupplier(formData).subscribe({
      next: (response: any) => {
        this.loading = false;
        alert(`Success! Supplier Number: ${response.internalNumber}`);
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
      evaluationFile: null,
      qualityCertFile: null,
      expiryDate: ''
    };
    this.setDefaultExpiry();
  }
}