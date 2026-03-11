import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SupplierService } from '../services/supplier.service';

export interface Document {
  id: string;
  documentType: string;
  fileName: string;
  status: string;
  created_at: string;
  fileSize?: number;
  validTo?: string;
  remarks?: string;
}

@Component({
  selector: 'app-supplier-documents',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './supplier-documents.html',
  styleUrl: './supplier-documents.scss',
})
export class SupplierDocuments implements OnInit {
  supplierData: any = null; 
  documents: Document[] = [];
  loading: boolean = true;

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

  // --- HELPER METHODS FOR TRADE REFS ---
  isJson(str: string | undefined): boolean {
    if (!str || str.trim() === '') return false;
    try {
      const result = JSON.parse(str);
      return (typeof result === 'object' && result !== null);
    } catch (e) {
      return false;
    }
  }

  getParsedRefs(remarks: string | undefined) {
    if (!remarks) return [];
    try {
      return JSON.parse(remarks);
    } catch (e) {
      return [];
    }
  }

  // --- UI HELPERS ---
  formatFileSize(bytes: number | undefined): string {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isNearExpiry(expiryDate: string | undefined): boolean {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays < 30;
  }

  previewDoc(docId: string, fileName: string): void {
    this.supplierService.viewDocument(docId).subscribe({
      next: (res: any) => {
        this.selectedDocName = fileName;
        this.isPdf = fileName.toLowerCase().endsWith('.pdf');
        this.selectedDocUrl = this.isPdf 
          ? this.sanitizer.bypassSecurityTrustResourceUrl(res.url) 
          : res.url;
      },
      error: (err) => console.error('Error previewing document', err)
    });
  }

  openUploadModal(): void {}
  closePreview(): void { this.selectedDocUrl = null; }
}