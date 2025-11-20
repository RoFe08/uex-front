import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [

  { path: '', component: HomeComponent },

  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'auth/signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },

  {
    path: 'contacts',
    children: [
      {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/contacts/contact-list/contact-list.component').then(
            (m) => m.ContactListComponent
          ),
      },
      {
        path: 'new',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/contacts/contact-form/contact-form.component').then(
            (m) => m.ContactFormComponent
          ),
      },
      {
        path: ':id/edit',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/contacts/contact-form/contact-form.component').then(
            (m) => m.ContactFormComponent
          ),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
