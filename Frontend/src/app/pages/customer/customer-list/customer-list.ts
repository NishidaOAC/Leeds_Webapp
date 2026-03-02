import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList implements OnInit {
  customers: any[] = [];
  loading = true;
  
  // Preview states
  selectedDocUrl: SafeResourceUrl | null = null;
  isPreviewLoading = false;
  isPdf = false;

  constructor(
    private customerService: CustomerService,
    private sanitizer: DomSanitizer // Needed to allow external URLs in iframes
  ) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading customers:", err);
        this.loading = false;
      }
    });
  }

  // Triggered when clicking the "eye" icon
  previewDoc(docId: string, fileName: string) {
    this.isPreviewLoading = true;
    this.isPdf = fileName.toLowerCase().endsWith('.pdf');

    this.customerService.viewDocument(docId).subscribe({
      next: (res: any) => {
        if (res.url) {
          // Bypass Angular security to show the S3 URL in iframe
          this.selectedDocUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
        }
        this.isPreviewLoading = false;
      },
      error: (err) => {
        alert('Fetch failed: ' + err.message);
        this.isPreviewLoading = false;
      }
    });
  }

  closePreview() {
    this.selectedDocUrl = null;
  }

  getComplianceStatus(documents: any[]): string {
    if (!documents?.length) return 'PENDING';
    const isCompliant = documents.every(d => d.s3Key && d.status === 'ACTIVE');
    return isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT';
  }

  getStatusClass(docs: any[]): string {
    return this.getComplianceStatus(docs).toLowerCase().replace('_', '-');
  }
}