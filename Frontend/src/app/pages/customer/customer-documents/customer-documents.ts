import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CustomerService } from '../services/customer.service';
import { DocumentPreviewer } from '../document-previewer/document-previewer';


@Component({
  selector: 'app-customer-documents',
  standalone: true,
  imports: [CommonModule, RouterModule,
    DocumentPreviewer
  ], 
  templateUrl: './customer-documents.html',
  styleUrl: './customer-documents.scss',
})
export class CustomerDocuments implements OnInit {
  customerId: string | null = null;
  customerData: any = null;
  documents: any[] = [];
  loading = true;
  
  // Preview states
  selectedDocUrl: SafeResourceUrl | null = null;
  isPdf = false;



  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    if (this.customerId) {
      this.loadCustomerData();
    }
  }

  loadCustomerData() {
    this.loading = true;
    this.customerService.getCustomerById(this.customerId!).subscribe({
      next: (data) => {
        this.customerData = data;
        this.documents = data.Documents || []; 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.loading = false;
      }
    });
  }

  selectedDocName: string = '';


  previewDoc(docId: string, fileName: string) {
    this.selectedDocName = fileName;
    this.isPdf = fileName.toLowerCase().endsWith('.pdf');
    
    this.customerService.viewDocument(docId).subscribe({
      next: (res: any) => {
        if (res.url) {
          this.selectedDocUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
        }
      }
    });
  }

  closePreview() {
    this.selectedDocUrl = null;
  }

 

  getStatusClass(status: string): string {
    return status ? status.toLowerCase() : 'pending';
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isNearExpiry(expiryDate: string): boolean {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate).getTime();
    const today = new Date().getTime();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    return (expiry - today) < thirtyDaysInMs;
  }
}