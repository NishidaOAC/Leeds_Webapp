import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SupplierService } from '../../supplier/services/supplier.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-quality-dashbaord',
   standalone: true,
  imports: [CommonModule, MatPaginatorModule], 
  templateUrl: './quality-dashbaord.html',
  styleUrl: './quality-dashbaord.scss',
})
export class QualityDashbaord {

 expiredSuppliers: any[] = [];
  pagedSuppliers: any[] = []; 
  
  stats = { expired: 0, warning: 0, active: 0 };


  pageSize = 5;
  currentPage = 0;

  private readonly THEMES: any = {
    'LONG_TERM': { label: 'Long Term Approval', class: 'badge-longterm' },
    'ONE_TIME': { label: 'One-Time Approval', class: 'badge-onetime' },
    'CONDITIONAL': { label: 'Conditional Approval', class: 'badge-conditional' }
  };

  constructor(
    private supplierService: SupplierService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.supplierService.getSuppliersinCurrentMonth().subscribe({
      next: (data: any[]) => {
        this.expiredSuppliers = data.map(s => {
          const days = this.calculateDays(s.expiryDate);
          const statusCode = s.OnboardingStatus?.code || 'LONG_TERM'; 
          
          let statusText = 'Healthy';
          let urgencyClass = '';

          // if (days <= 0) {
          //   statusText = 'Expired';
          //   urgencyClass = 'row-critical';
          // } else if (days <= 7) {
          //   statusText = 'Expiring Soon';
          //   urgencyClass = 'row-warning';
          // }
          if (days < 0)       { statusText = 'Expired';       urgencyClass = 'row-critical'; }
else if (days <= 7) { statusText = days === 0 ? 'Expires Today' : 'Expiring Soon'; urgencyClass = 'row-warning'; }


          return {
            ...s,
            daysRemaining: days,
            computedStatus: statusText,
            urgencyClass: urgencyClass,
            theme: this.THEMES[statusCode] || this.THEMES['LONG_TERM']
          };
        });
        
        this.updateKPIs();
        this.updatePageData(); // 💡 Initialize first page view window
      },
      error: (err) => console.error("Data Load Error:", err)
    });
  }



  
calculateDays(date: string): number {
  if (!date) return Number.POSITIVE_INFINITY;            // no date ⇒ not expired
  const [y, m, d] = date.split('T')[0].split('-').map(Number);
  const expiry = new Date(y, m - 1, d);                  // local date, no UTC shift
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((expiry.getTime() - today.getTime()) / 86_400_000);
}

updateKPIs() {
  const list = this.expiredSuppliers;
  this.stats.expired = list.filter(s => s.daysRemaining < 0).length;
  this.stats.warning = list.filter(s => s.daysRemaining >= 0 && s.daysRemaining <= 7).length;
  this.stats.active  = list.length;
}

  // 💡 Splices items out locally based on selected pagination parameters
  updatePageData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedSuppliers = this.expiredSuppliers.slice(startIndex, endIndex);
  }

  // 💡 Triggers cleanly when a user changes page counts or hits arrow buttons
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePageData();
  }

  requestRenewal(supplier: any) {
    this.router.navigate(['/dashboard/supplier/renewal', supplier.id]);
  }
getRiskColor(days: number): string {
  return days < 0 ? '#ef4444' : days <= 7 ? '#f59e0b' : '#10b981';
}
}
