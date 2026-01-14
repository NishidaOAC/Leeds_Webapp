import { Routes } from '@angular/router';
import { FullComponent } from './full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { AppSideLoginComponent } from './pages/authentication/side-login/side-login.component';

export const routes: Routes = [
  // 🔹 Blank layout (for Login, Register, Forgot Password, etc.)
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },

  // 🔹 Full layout (for main dashboard and other app pages)
  {
    path: 'dashboard',
    component: FullComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
    ],
  },
];

