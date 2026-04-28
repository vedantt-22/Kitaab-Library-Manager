import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const librarianGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isLibrarian()) {
    return true;
  }

  router.navigate(['/books']);
  return false;
};