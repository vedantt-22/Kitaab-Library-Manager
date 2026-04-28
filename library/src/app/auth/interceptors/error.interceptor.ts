import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(error => {

      if (error.status === 401 || error.status === 403) {
        authService.logout();
        router.navigate(['/auth/login']);
      }

      if (error.status === 500) {
        console.error('Server error:', error);
      }

      return throwError(() => error);
    })
  );
};