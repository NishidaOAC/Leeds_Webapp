import { Routes } from "@angular/router";
import { AuthGuard } from "../../guards/auth.guard";
import { CustomerDocuments } from "./customer-documents/customer-documents";

export const routes: Routes = [ // Fix spelling here
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./customer').then(c => c.Customer)
  },
    {
      path: 'customerlist',
      loadComponent: () =>
        import('../customer/customer-list/customer-list').then(
          (c) => c.CustomerList
        ),
      // canActivate: [AuthGuard]
    },
      {
      path: 'managedocuments/:id', 
      component: CustomerDocuments // Or your specific ManageDocumentsComponent
    },
  // Add sub-routes for customer like 'list', 'edit', etc. here
];