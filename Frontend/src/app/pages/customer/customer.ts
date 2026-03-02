import { Component } from '@angular/core';
import { CustomerService } from './services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.html',
  styleUrl: './customer.scss',
})
export class Customer {
  customer = {
    name: '',
    customerType: '',
  };

  selectedFiles: { [key: string]: File } = {};
  
  // Track remarks separately to avoid TS2339 errors
  documentRemarks: { [key: string]: string } = {
    'KYC': '',
    'EXPORT': '',
    'EUC': ''
  };

  constructor(private customerService: CustomerService) {}

  get isAirlineOrMro(): boolean {
    return this.customer.customerType === 'AIRLINE' || this.customer.customerType === 'MRO';
  }

  // Called when dropdown changes
  onTypeChange() {
    // Reset file selection and remarks, but NOT the customerType itself
    this.selectedFiles = {};
    this.documentRemarks = { 'KYC': '', 'EXPORT': '', 'EUC': '' };
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[type] = file;
    }
  }

  saveCustomer() {
    const formData = new FormData();
    formData.append('name', this.customer.name);
    formData.append('customerType', this.customer.customerType);

    const documentMetadata: any[] = [];
    const currentYear = new Date().getFullYear();
    const expiryDate = `${currentYear}-12-31`;

    Object.keys(this.selectedFiles).forEach((typeKey) => {
      formData.append('documents', this.selectedFiles[typeKey]);

      documentMetadata.push({
        documentType: typeKey === 'EXPORT' ? 'EXPORT_COMPLIANCE' : typeKey,
        isOneTime: this.customer.customerType === 'OTHER',
        validFrom: new Date().toISOString().split('T')[0],
        validTo: this.customer.customerType === 'OTHER' ? null : expiryDate,
        remarks: this.documentRemarks[typeKey] || '',
        status: 'ACTIVE'
      });
    });

    formData.append('metadata', JSON.stringify(documentMetadata));

    this.customerService.saveCustomer(formData).subscribe({
      next: () => {
        alert('Customer saved successfully');
        this.fullReset(); // Clears everything after success
      },
      error: (err) => alert('Error: ' + (err.error?.message || err.message))
    });
  }

  fullReset() {
    this.customer = { name: '', customerType: '' };
    this.selectedFiles = {};
    this.documentRemarks = { 'KYC': '', 'EXPORT': '', 'EUC': '' };
  }
}