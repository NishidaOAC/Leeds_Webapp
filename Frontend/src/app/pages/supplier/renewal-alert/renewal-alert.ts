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

  // Corporate Theme Mapping based on your Database Codes
  private readonly THEMES: any = {
    'ONE_YEAR': { label: 'Long Term Approval', class: 'badge-longterm' },
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
          const statusCode = s.OnboardingStatus?.code || 'ONE_YEAR'; 
          
          return {
            ...s,
            daysRemaining: days,
            theme: this.THEMES[statusCode] || this.THEMES['ONE_YEAR'],
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
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  updateKPIs() {
    this.stats.critical = this.expiredSuppliers.filter(s => s.daysRemaining <= 2).length;
    this.stats.warning = this.expiredSuppliers.filter(s => s.daysRemaining > 2 && s.daysRemaining <= 7).length;
    this.stats.active = this.expiredSuppliers.length;
  }

  requestRenewal(supplier: any) {
    this.supplierService.setSupplierForUpdate(supplier);
    this.router.navigate(['/dashboard/supplier']);
  }

  // THIS FUNCTION FIXES YOUR COMPILER ERROR
  getRiskColor(days: number): string {
    if (days <= 0) return '#dc3545'; // Critical Red
    if (days <= 2) return '#fd7e14'; // Orange
    if (days <= 7) return '#ffc107'; // Yellow
    return '#28a745'; // Healthy Green
  }
}