import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (token && token !== 'undefined' && token !== '') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
