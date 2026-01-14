import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
        import('./company.component').then(
            c => c.CompanyComponent
        )
    },
    {
        path: 'add',
        loadComponent: () =>
        import('./add-company/add-company.component').then(
            c => c.AddCompanyComponent
        )
    },
];