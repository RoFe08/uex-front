import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './auth/auth.guard';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

export const routes: Routes = [

  // Página pública inicial
  { path: '', component: HomeComponent },

  // Rotas públicas de autenticação
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent),
  },
  {
    path: 'auth/signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component')
        .then(m => m.SignupComponent),
  },

  // ✅ ROTAS PROTEGIDAS (com layout + logout)
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: 'contacts',
        loadComponent: () =>
          import('./features/contacts/contact-list/contact-list.component')
            .then(m => m.ContactListComponent),
      },
      {
        path: 'contacts/new',
        loadComponent: () =>
          import('./features/contacts/contact-form/contact-form.component')
            .then(m => m.ContactFormComponent),
      },
      {
        path: 'contacts/:id/edit',
        loadComponent: () =>
          import('./features/contacts/contact-form/contact-form.component')
            .then(m => m.ContactFormComponent),
      }

    ]
  },

  // fallback
  { path: '**', redirectTo: '' },
];
