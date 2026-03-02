import { Routes } from "@angular/router";
import { AuthGuard } from "../../guards/auth.guard";
import { SupplierDocuments } from "./supplier-documents/supplier-documents";

export const routes: Routes = [ // Fix spelling here
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./supplier').then(c => c.Supplier)
  },
  {
    path: 'supplierlist',
    loadComponent: () =>
      import('./supplier-list/supplier-list').then(
        (c) => c.SupplierList
      ),
    // canActivate: [AuthGuard]
  },
  {
  path: 'managedocuments/:id', 
  component: SupplierDocuments // Or your specific ManageDocumentsComponent
},
  // Add sub-routes for customer like 'list', 'edit', etc. here
];