import { Routes } from "@angular/router";
import { StarterComponent } from "./starter/starter.component";
import { AuthGuard } from "../guards/auth.guard";

export const PagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./starter/starter.component').then(
            (c) => c.StarterComponent
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.routes').then(m => m.userRoutes),
        canActivate: [AuthGuard]
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('./payments/payments.routes').then(m => m.routes),
        canActivate: [AuthGuard]
      },
      {
        path: 'company',
        loadChildren: () =>
          import('./company/company.routes').then(m => m.routes),
        canActivate: [AuthGuard]
      },

    ]
  }
];


