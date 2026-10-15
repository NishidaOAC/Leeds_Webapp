import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned).pipe(
    catchError((error) => {
      const message =
        error.error?.message ||
        (error.status === 0
          ? 'Server is unreachable'
          : `Error ${error.status}: ${error.statusText}`);

      snackBar.open(message, 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error', 'snackbar-center'],
      });

      // Handle Token Expiry & Unauthorized Access Automatically
      if (error.status === 401) {
        localStorage.clear();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};