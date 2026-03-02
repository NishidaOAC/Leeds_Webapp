import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SupplierService } from '../services/supplier.service';
import { DocumentPreviewer } from '../../customer/document-previewer/document-previewer';


// If you have a separate file for this component, ensure it's imported here
// import { DocumentPreviewerComponent } from './components/document-previewer.component'; 

export interface Document {
  id: string;
  documentType: string;
  fileName: string;
  status: string;
  created_at: string;
  fileSize?: number; // Added to match new UI
  validTo?: string;   // Added to match new UI
  remarks?: string;   // Added to match new UI
}

export interface SupplierResponse {
  name: string;
  internalSupplierNumber: string;
  Documents: Document[];
}

@Component({
  selector: 'app-supplier-documents',
  standalone: true,
  // Make sure to add DocumentPreviewerComponent to imports if it's a standalone component
  imports: [CommonModule, RouterModule], 
  templateUrl: './supplier-documents.html',
  styleUrl: './supplier-documents.scss',
})
export class SupplierDocuments implements OnInit {
  // Renamed from customerData to supplierData to match your HTML template
  supplierData: any = null; 
  documents: Document[] = [];
  loading: boolean = true;

  // Preview States
  selectedDocUrl: SafeResourceUrl | string | null = null;
  selectedDocName: string = '';
  isPdf: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSupplierDetails(id);
    }
  }

  loadSupplierDetails(id: string): void {
    this.loading = true;
    this.supplierService.getSupplierById(id).subscribe({
      next: (data) => {
        // Mapping the response to supplierData
        this.supplierData = data;
        this.documents = data.Documents || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching docs', err);
        this.loading = false;
      }
    });
  }

  // Helper: Format file size for the new UI cards
  formatFileSize(bytes: number | undefined): string {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Helper: Check if document is near expiry (30 days)
  isNearExpiry(expiryDate: string | undefined): boolean {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays < 30;
  }

  // Placeholder for the Upload button click
  openUploadModal(): void {
    console.log('Opening upload dialog...');
    // Logic to open your upload modal or navigate to upload page goes here
  }

  previewDoc(docId: string, fileName: string): void {
    this.supplierService.viewDocument(docId).subscribe({
      next: (res: any) => {
        this.selectedDocName = fileName;
        this.isPdf = fileName.toLowerCase().endsWith('.pdf');
        
        // Sanitize URL for iframe/PDF security
        this.selectedDocUrl = this.isPdf 
          ? this.sanitizer.bypassSecurityTrustResourceUrl(res.url) 
          : res.url;
      },
      error: (err) => console.error('Error previewing document', err)
    });
  }

  closePreview(): void {
    this.selectedDocUrl = null;
    this.selectedDocName = '';
  }
}