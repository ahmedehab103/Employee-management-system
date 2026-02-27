import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  private router = inject(Router);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  canActivate(): boolean {
    if (localStorage.getItem('authToken')) {
      // If the user is logged in, redirect them to the home or dashboard
      this.router.navigate(['']); // Change to your default logged-in route
      return false; // Deny access to the login route
    }
    return true; // Allow access to login route
  }
}
