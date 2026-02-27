import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/non-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [NoAuthGuard],
    loadComponent: () =>
      import(
        '../Modules/Identity/identity.presentation/login/login.component'
      ).then((m) => m.LoginComponent),
  },

  {
    path: '',
    canActivate: [authGuard], // Guard applied to all child routes
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./analytics/analytics.component').then(
            (m) => m.AnalyticsComponent
          ),
      },
      {
        path: 'adminsList',
        loadComponent: () =>
          import(
            './../Modules/Identity/identity.presentation/admins-list/admins-list.component'
          ).then((m) => m.AdminsListComponent),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import(
            './../Modules/Employee/employee.presentation/employees-list/employees-list.component'
          ).then((m) => m.EmployeesListComponent),
      },
      {
        path: '403',
        loadChildren: () =>
          import('./error-pages/not-authorized/not-authorized.component').then(
            (m) => m.NotAuthorizedComponent
          ),
      },
      {
        path: '404',
        loadChildren: () =>
          import('./error-pages/not-found/not-found.component').then(
            (m) => m.NotFoundComponent
          ),
      },
      {
        path: '500',
        loadChildren: () =>
          import(
            './error-pages/internal-server-error/internal-server-error.component'
          ).then((m) => m.InternalServerErrorComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' }, // Redirect unknown paths to home
];
