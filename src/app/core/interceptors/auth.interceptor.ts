import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  const isApiUrl = req.url.startsWith('/api');

  const isAuthEndpoint =
    req.url.startsWith('/api/auth/login') ||
    req.url.startsWith('/api/auth/signup');

  if (token && isApiUrl && !isAuthEndpoint) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};