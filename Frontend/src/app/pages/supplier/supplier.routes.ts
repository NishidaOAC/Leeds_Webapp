import { Routes } from "@angular/router";
import { AuthGuard } from "../../guards/auth.guard";
import { SupplierDocuments } from "./supplier-documents/supplier-documents";

export const routes: Routes = [
  // 1. SPECIFIC/STATIC ROUTES FIRST
  {
    path: 'supplierlist',
    loadComponent: () =>
      import('./supplier-list/supplier-list').then((c) => c.SupplierList),
  },
  {
    path: 'managedocuments/:id',
    component: SupplierDocuments
  },
  // 2. THE EMPTY PATH (ADD MODE)
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./supplier').then(c => c.Supplier)
  },
  // 3. THE PARAMETER PATH LAST (EDIT MODE)
  {
    path: ':id',
    loadComponent: () => import('./supplier').then(c => c.Supplier)
  },
];