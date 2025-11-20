import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly apiBase = '/api/auth';

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.router.navigate(['/auth/login']);
  }

  deleteAccount(password: string) {
    return this.http.request<void>('DELETE', `${this.apiBase}/account`, {
      body: { password },
    }).pipe(
      tap(() => this.logout())
    );
  }
}
