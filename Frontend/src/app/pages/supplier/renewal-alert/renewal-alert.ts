import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierService } from '../services/supplier.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-renewal-alert',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './renewal-alert.html',
  styleUrl: './renewal-alert.scss',
})
export class RenewalAlert implements OnInit {
  expiredSuppliers: any[] = [];
  stats = { critical: 0, warning: 0, active: 0 };

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
          
          return {
            ...s,
            daysRemaining: days,
            theme: this.THEMES[statusCode] || this.THEMES['LONG_TERM'],
            // 💡 FIX: Anything 2 days or less (including yesterday/past negative numbers) is Critical!
            urgencyClass: days <= 2 ? 'row-critical' : (days <= 7 ? 'row-warning' : '')
          };
        });
        this.updateKPIs();
      },
      error: (err) => console.error("Data Load Error:", err)
    });
  }

  calculateDays(date: string): number {
    if (!date) return 0;
    
    // 💡 FIX: Clear out hours, minutes, and seconds to do an accurate daily calendar comparison
    const expiryDate = new Date(date);
    expiryDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diff = expiryDate.getTime() - today.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }

  updateKPIs() {
    // 💡 FIX: Critical counts everything <= 2 days (including 0, -1, -2, etc.)
    this.stats.critical = this.expiredSuppliers.filter(s => s.daysRemaining <= 2).length;
    // 💡 FIX: Warning strictly filters upcoming items between 3 and 7 days away
    this.stats.warning = this.expiredSuppliers.filter(s => s.daysRemaining > 2 && s.daysRemaining <= 7).length;
    this.stats.active = this.expiredSuppliers.length;
  }

  requestRenewal(supplier: any) {
    this.router.navigate(['/dashboard/supplier/renewal', supplier.id]);
  }

  getRiskColor(days: number): string {
    if (days <= 0) return '#dc3545'; // 💡 Overdue/Expired/Yesterday = Red
    if (days <= 2) return '#fd7e14'; // Orange
    if (days <= 7) return '#ffc107'; // Yellow
    return '#28a745'; // Healthy Green
  }
}