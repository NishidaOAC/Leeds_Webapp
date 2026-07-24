import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; 
import { SupplierService } from '../services/supplier.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Confirmdeletedialog } from '../../common/confirmdeletedialog/confirmdeletedialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmailPreviewDialog } from '../email-preview-dialog/email-preview-dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule,
     RouterModule,
    MatSnackBarModule, 
    MatDialogModule,
    MatProgressSpinnerModule,
    MatPaginatorModule

  ],
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
  pageSize = 5;
  totalItems = 0;
  searchTerm = '';

  // ADD THIS LINE HERE:
  protected Math = Math;



  // Pagination/Search State


  private supplierService = inject(SupplierService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadSuppliers();
    // this.loadCurrentMonthExpiries();
  }

onPageChange(event: PageEvent): void {
  this.currentPage = event.pageIndex + 1; // MatPaginator is 0-indexed, your backend is 1-indexed
  this.pageSize = event.pageSize;         // Updates the current limit count
  this.loadSuppliers();
}

sendReminder(supplier: any) {
  const formattedDate = new Date(supplier.expiryDate).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const payload = {
    to: supplier.email,
    supplierName: supplier.name,
    expiryDate: formattedDate,
    customMessage: `To prevent any logistical operational holds or disruptions to your active supplier profile status, please upload or forward your updated compliance blueprints and certificates immediately.`
  };

  // 1. Show main loading spinner before opening the dialog
  this.loading = true; 

  // 2. Fetch the HTML template string from your Express backend preview API
  this.supplierService.getEmailPreview(payload).subscribe({
    next: (res: any) => {
      this.loading = false; // Turn off main loading block

      // 3. Open the preview window using the HTML string returned by the server
      const dialogRef = this.dialog.open(EmailPreviewDialog, {
        width: '680px',
        data: {
          ...payload,
          serverCompiledHtml: res.html // Dynamic HTML from step 1
        }
      });

      // 4. Handle dialog confirmation behavior
      dialogRef.afterClosed().subscribe(isConfirmed => {
        if (isConfirmed) {
          this.loading = true; // Show loading spinner while the backend routes through SMTP

          this.supplierService.sendEmailReminder(payload).subscribe({
            next: () => {
              this.loading = false;
              this.showSnackbar(`Official business notice successfully sent to ${supplier.email}`, 'success');
            },
            error: (err) => {
              this.loading = false;
              this.showSnackbar(err.error?.message || 'SMTP Server Interruption occurred.', 'error');
            }
          });
        }
      });
    },
    error: (err) => {
      this.loading = false;
      this.showSnackbar('Failed to fetch corporate layout from the API server system.', 'error');
      console.error('Template Engine Fault:', err);
    }
  });
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


editSupplier(supplier: any): void {
this.router.navigate(['/dashboard/supplier', supplier.id]);
}



  onDelete(id: string, name: string): void {
    // 1. Open the Dialog
    const dialogRef = this.dialog.open(Confirmdeletedialog, {
      width: '400px',
      data: { message: `Are you sure you want to delete ${name}?` }
    });

    // 2. Listen for the result
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.executeDelete(id, name);
      }
    });
  }

  private executeDelete(id: string, name: string) {
    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.loadSuppliers();
        // Show the snackbar instead of an alert
        this.showSnackbar(`Supplier ${name} deleted successfully`, 'success');
      },
      error: (err) => {
        this.showSnackbar('Delete failed: ' + err.message, 'error');
      }
    });
  }

  showSnackbar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
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