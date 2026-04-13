import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierService } from '../services/supplier.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-renewal-alert',
  standalone: true,
  imports: [CommonModule,
    RouterLink
  ],
  templateUrl: './renewal-alert.html',
  styleUrl: './renewal-alert.scss',
})
export class RenewalAlert implements OnInit {
  expiredSuppliers: any[] = [];

  constructor(private supplierService: SupplierService,
    private router :Router
  ) {}

  ngOnInit() {
    this.loadAlerts();
  }

  // Add this inside your component class
get currentMonth(): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());
}

  loadAlertsOlf() {
    this.supplierService.getSuppliersinCurrentMonth().subscribe({
      next: (data) => {
        const today = new Date();
        
        this.expiredSuppliers = data.filter(s => {
          // FLAG 1: If no date exists, they need action!
          if (!s.expiryDate) return true;

          const expiry = new Date(s.expiryDate);
          const diff = expiry.getTime() - today.getTime();
          const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

          // FLAG 2: Show if expired, expiring soon (30 days), 
          // or use 400 temporarily to verify your UI is working
          return days <= 400; 
        });
        
        console.log("Suppliers to display:", this.expiredSuppliers);
      },
      error: (err) => console.error("Error loading alerts", err)
    });
  }
loadAlerts() {
  this.supplierService.getSuppliersinCurrentMonth().subscribe({
    next: (data) => {
      const today = new Date();
      
      this.expiredSuppliers = data.filter(s => {
        // FLAG 1: If no date exists, they need action!
        if (!s.expiryDate) {
          console.log(`Supplier: ${s.name || 'Unknown'} - No expiry date found (Flagged)`);
          return true;
        }

        const expiry = new Date(s.expiryDate);
        const diff = expiry.getTime() - today.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        // DEBUG LOG: See the calculated days for every supplier
        console.log(`Supplier: ${s.name || 'Unknown'} | Expiry: ${s.expiryDate} | Days remaining: ${days}`);

        // FLAG 2: Show if expired, expiring soon (30 days), 
        // or use 400 temporarily to verify your UI is working
        return days <= 400; 
      });
      
      console.log("--- Final List of Filtered Suppliers ---", this.expiredSuppliers);
    },
    error: (err) => console.error("Error loading alerts", err)
  });
}

// Inside your RenewalAlert class
getUrgencyLevel(supplier: any): 'critical' | 'warning' | 'info' {
  const days = this.getDays(supplier.expiryDate);
  const statusCode = supplier.onboardingStatus?.code;

  // 1. CRITICAL: Anything 2 days or less OR Expired
  if (days <= 2) return 'critical';

  // 2. CONDITIONAL: More sensitive. If it's conditional and < 14 days, mark as warning
  if (statusCode === 'CONDITIONAL' && days <= 14) return 'warning';

  // 3. ONE_YEAR: Standard warning at 7 days
  if (days <= 7) return 'warning';

  return 'info';
}
getStatusColor(expiryDate: string | Date): string {
  if (!expiryDate) return 'gray'; // No date, no color or default

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  const diff = expiry.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return 'red';      // Already expired
  if (days <= 2) return 'orange';   // Critical: 1-2 days left
  if (days <= 7) return 'yellow';   // Warning: 1 week left
  return 'green';                   // Safe
}

  getDays(date: string | null): number {
  if (!date) return 0;
  const diff = new Date(date).getTime() - new Date().getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}



// renewal-alert.ts
// renewal-alert.ts
requestRenewal(supplier: any) {
  this.supplierService.setSupplierForUpdate(supplier);
  this.router.navigate(['/dashboard/supplier']); // Navigates to the loadComponent: Supplier
}
}