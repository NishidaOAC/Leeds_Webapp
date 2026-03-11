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

  // Updated form structure to handle array of objects for references
  form = {
    name: '',
    email: '',
    hasCert: true,
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

  constructor(private http: HttpClient, private supplierService: SupplierService) {}

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

    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    formData.append('hasQualityCert', String(this.form.hasCert));
    
    // Logic for documents
    if (this.form.evaluationFile) {
      formData.append('evaluationDoc', this.form.evaluationFile);
    }

    if (this.form.hasCert && this.form.qualityCertFile) {
      formData.append('qualityDoc', this.form.qualityCertFile);
    } 
    
    // Logic for trade references (No certification path)
    if (!this.form.hasCert) {
      // Stringify the array so it can be stored in a JSON/TEXT column
      formData.append('tradeReferences', JSON.stringify(this.form.tradeReferences));
    }

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
    this.calculateExpiry();
  }
}