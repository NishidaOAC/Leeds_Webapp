import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; 
import { SupplierService } from '../services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.scss',
})
export class SupplierList implements OnInit {
  suppliers: any[] = [];
  loading: boolean = true;

  // Preview Panel State
  selectedDocUrl: SafeResourceUrl | string | null = null;
  selectedDocName: string = '';
  selectedSupplierId: string | null = null; // Track which row is "Active"
  isPdf: boolean = false;
  isPreviewLoading: boolean = false;

  constructor(
    private supplierService: SupplierService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.supplierService.getSuppliers().subscribe({
      next: (data: any[]) => {
        // Sort: Non-compliant/Pending first, then by date
        this.suppliers = data.sort((a, b) => {
          const statusOrder: any = { 'PENDING': 1, 'NON-COMPLIANT': 2, 'COMPLIANT': 3 };
          const aOrder = statusOrder[a.status] || 99;
          const bOrder = statusOrder[b.status] || 99;
          
          if (aOrder !== bOrder) return aOrder - bOrder;
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching suppliers:', err);
        this.loading = false;
      }
    });
  }

  /**
   * Opens the side preview panel and fetches the secure S3 URL
   */
  previewDoc(docId: string, fileName: string, supplierId: string): void {
    // If clicking the same doc twice, toggle close
    if (this.selectedDocName === fileName && this.selectedSupplierId === supplierId) {
      this.closePreview();
      return;
    }

    this.isPreviewLoading = true;
    this.selectedDocName = fileName;
    this.selectedSupplierId = supplierId; // Highlights the row in the UI
    this.selectedDocUrl = null; 

    this.supplierService.viewDocument(docId).subscribe({
      next: (res: any) => {
        if (res?.url) {
          const lowerName = fileName.toLowerCase();
          this.isPdf = lowerName.endsWith('.pdf');

          this.selectedDocUrl = this.isPdf 
            ? this.sanitizer.bypassSecurityTrustResourceUrl(res.url) 
            : res.url;
        }
        this.isPreviewLoading = false;
      },
      error: (err) => {
        console.error('S3 Link Error:', err);
        this.isPreviewLoading = false;
        this.selectedSupplierId = null;
        alert('Could not retrieve certificate from storage.');
      }
    });
  }

  closePreview(): void {
    this.selectedDocUrl = null;
    this.selectedDocName = '';
    this.selectedSupplierId = null;
    this.isPreviewLoading = false;
  }

  /**
   * Logic for UI highlighting of expiring certs
   */
  isNearExpiry(expiryDate: string): boolean {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Return true if expired OR expiring within 30 days
    return expiry <= thirtyDaysFromNow;
  }

  // Inside your SupplierList class

editSupplier(supplier: any): void {
  console.log('Navigate to edit for:', supplier.id);
  // Example: this.router.navigate(['/dashboard/supplier/edit', supplier.id]);
}

onDelete(id: string, name: string): void {
  const confirmDelete = confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`);
  
  if (confirmDelete) {
    this.loading = true; // Show loader while deleting
    this.supplierService.deleteSupplier(id).subscribe({
      next: (res: any) => {
        alert('Supplier deleted successfully');
        this.loadSuppliers(); // Refresh the list
      },
      error: (err) => {
        console.error('Delete Error:', err);
        alert('Failed to delete supplier: ' + (err.error?.message || 'Server Error'));
        this.loading = false;
      }
    });
  }
}
}