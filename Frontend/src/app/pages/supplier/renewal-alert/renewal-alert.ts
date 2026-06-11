import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierService } from '../services/supplier.service';
import { Router, RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-renewal-alert',
  standalone: true,
  imports: [CommonModule, RouterLink, MatPaginatorModule], // 💡 Added MatPaginatorModule
  templateUrl: './renewal-alert.html',
  styleUrl: './renewal-alert.scss',
})
export class RenewalAlert implements OnInit {
  expiredSuppliers: any[] = [];
  pagedSuppliers: any[] = []; // 💡 Array containing only the items on the current page
  
  stats = { expired: 0, warning: 0, active: 0 };

  // Pagination defaults
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

          if (days <= 0) {
            statusText = 'Expired';
            urgencyClass = 'row-critical';
          } else if (days <= 7) {
            statusText = 'Expiring Soon';
            urgencyClass = 'row-warning';
          }

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
    if (!date) return 0;
    const expiryDate = new Date(date);
    expiryDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = expiryDate.getTime() - today.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }

  updateKPIs() {
    this.stats.expired = this.expiredSuppliers.filter(s => s.daysRemaining <= 0).length;
    this.stats.warning = this.expiredSuppliers.filter(s => s.daysRemaining > 0 && s.daysRemaining <= 7).length;
    this.stats.active = this.expiredSuppliers.length;
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
    if (days <= 0) return '#ef4444'; 
    if (days <= 7) return '#f59e0b'; 
    return '#10b981'; 
  }
}