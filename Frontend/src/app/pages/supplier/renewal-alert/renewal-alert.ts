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

  loadAlerts() {
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