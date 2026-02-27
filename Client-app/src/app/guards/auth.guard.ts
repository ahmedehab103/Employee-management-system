import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('authToken');
  if (!isLoggedIn) {
    const returnUrl = state.url;
    // Redirect to login if not authenticated
    router.navigate(['/login'], { queryParams: { returnUrl } });
    return false;
  }
  return true;
};
