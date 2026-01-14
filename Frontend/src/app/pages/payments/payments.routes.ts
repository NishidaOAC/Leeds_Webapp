import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
        import('./payments').then(
            c => c.Payments
        )
    },
    {
        path: 'addpayments',
        loadComponent: () =>
        import('./add-approval/add-approval.component').then(
            c => c.AddApprovalComponent
        )
    },
    {
        path: 'open/:id',
        loadComponent: () =>
        import('./view-approval/view-invoices/view-invoices.component').then(
            c => c.ViewInvoicesComponent
        )
    },
];