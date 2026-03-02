import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SupplierService } from './services/supplier.service';
import { SupplierList } from './supplier-list/supplier-list';

@Component({
  selector: 'app-supplier',
  standalone: true,
  // Ensure HttpClientModule is imported for API calls
  imports: [CommonModule, FormsModule, HttpClientModule,
    SupplierList
  ],
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
    tradeRefs: '',
    evaluationFile: null as File | null,
    qualityCertFile: null as File | null,
    expiryDate: '' 
  };

 

  constructor(private http: HttpClient,private supplierService: SupplierService) {}

  ngOnInit() {
    this.calculateExpiry();
  }

  get calculatedExpiryDate() {
    return this.form.expiryDate;
  }

  calculateExpiry() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    this.form.expiryDate = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

    // 1. Prepare FormData
    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    formData.append('hasQualityCert', String(this.form.hasCert));
    
    if (this.form.evaluationFile) {
      formData.append('evaluationDoc', this.form.evaluationFile);
    }

    if (this.form.hasCert && this.form.qualityCertFile) {
      formData.append('qualityDoc', this.form.qualityCertFile);
    } else if (!this.form.hasCert) {
      formData.append('tradeRefs', this.form.tradeRefs);
    }

    // 2. Call Service Method
    this.supplierService.registerSupplier(formData).subscribe({
      next: (response: any) => {
        this.loading = false;
        alert(`Success! Supplier Number: ${response.internalNumber}`);
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        console.error('Submission Error:', err);
        alert('Registration failed. Please check the backend connection.');
      }
    });
  }
  resetForm() {
    this.step = 1;
    this.form = {
      name: '',
      email: '',
      hasCert: true,
      tradeRefs: '',
      evaluationFile: null,
      qualityCertFile: null,
      expiryDate: ''
    };
    this.calculateExpiry();
  }
}