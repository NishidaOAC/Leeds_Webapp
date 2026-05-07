import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
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

  // Pagination/Search State
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  searchTerm = '';

  constructor(
    private supplierService: SupplierService,
    private sanitizer: DomSanitizer,
    private router :Router
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    // this.loadCurrentMonthExpiries();
  }
onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.currentPage = 1; // Reset to page 1 on search
    this.loadSuppliers();
  }
  
  changePage(newPage: number) {
    this.currentPage = newPage;
    this.loadSuppliers();
  }
urgentCount: number = 0;



loadCurrentMonthExpiries(): void {
  this.supplierService.getSuppliersinCurrentMonth().subscribe({
    next: (res) => {
      this.suppliers = res;
      console.log("suppliersssssss",this.suppliers);
      
      console.log('Current month expiries:', res);
      this.urgentCount = res.length; // The simplest way: just take the result count
    },
    error: (err) => console.error('Error fetching expiries', err)
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
  
  // Inside your SupplierList class

editSupplier(supplier: any): void {
  console.log('Navigating to edit:', supplier.id);
  
  // Use the setter method instead of .next()
  // this.supplierService.setSelectedSupplier(supplier);
  
  // Navigate to the form component
  // this.router.navigate(['/dashboard/supplier']);
    this.supplierService.setSupplierForUpdate(supplier);
  this.router.navigate(['/dashboard/supplier']); // Navigates to the loadComponent: Supplier
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
// Inside SupplierList class
loadSuppliersOLD(): void {
  this.loading = true;
  this.supplierService.getSuppliers().subscribe({
    next: (data) => {
      this.suppliers = data.map(s => {
        let parsedRefs = [];
        
        // Robust JSON parsing for Trade References
        if (s.tradeReferences) {
          try {
            parsedRefs = typeof s.tradeReferences === 'string' 
              ? JSON.parse(s.tradeReferences) 
              : s.tradeReferences;
          } catch (e) {
            console.error(`Failed to parse references for supplier ${s.id}`, e);
            parsedRefs = [];
          }
        }

        return {
          ...s,
          tradeReferences: Array.isArray(parsedRefs) ? parsedRefs : []
        };
      });

      // Sort: Put Pending and Urgent (near expiry) at the top
      this.suppliers.sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      });

      console.log('Suppliers Loaded Successfully:');
      console.table(this.suppliers);

      this.loading = false;
    },
    error: (err) => {
      console.error('Fetch Error:', err);
      this.loading = false;
    }
  });
}

loadSuppliers(): void {
    this.loading = true;
    this.supplierService.getPaginatedSuppliers(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (res) => {
        console.log(res,"this is res");
        
        this.suppliers = res.suppliers;
        this.totalItems = res.totalItems;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }


getCertName(supplier: any, doc: any): string {
  if (doc.documentType === 'QUALITY_CERT') {
    // Find the certification entry where the filename matches the document filename
    const cert = supplier.certifications?.find((c: any) => c.fileName === doc.fileName);
    return cert ? cert.type : 'QC';
  }
  return doc.documentType === 'EVAL_FORM' ? 'SAF' : doc.documentType;
}


getPathLabel(s: any): any {
  if (s.OnboardingStatus?.label) {
    return s.OnboardingStatus.label;
  }
}

getPathClass(s: any): string {
    if (s.hasQualityCert) return 'cert-standard';
    if (s.hasSefAndTradeRef) return 'cert-onetime';
    return 'cert-conditional';
}

getRefCount(refs: any): number {
    if (!refs) return 0;
    try {
        const parsed = typeof refs === 'string' ? JSON.parse(refs) : refs;
        return Array.isArray(parsed) ? parsed.filter(r => r.companyName).length : 0;
    } catch (e) {
        return 0;
    }
}

// renewal-alert.component.ts

getUrgentCount(): number {
  if (!this.suppliers) return 0;
  return this.suppliers.filter(supplier => {
    const expiry = new Date(supplier.expiryDate);
    const today = new Date();
    // Returns true if expiry is in the same month and year
    return expiry.getMonth() === today.getMonth() && 
           expiry.getFullYear() === today.getFullYear();
  }).length;
}
isNearExpiry(date: string): boolean {
    if (!date) return false;
    const expiry = new Date(date);
    const today = new Date();
    const diff = expiry.getTime() - today.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days < 30; // Mark urgent if less than 30 days
}

// Inside your SupplierList class

viewDocuments(supplierId: string): void {
  // Use a relative path or the full absolute path
  // Absolute version based on your image_a31da2.jpg and image_a31dd8.jpg:
  this.router.navigate(['/dashboard/supplier/managedocuments', supplierId]);
}
}