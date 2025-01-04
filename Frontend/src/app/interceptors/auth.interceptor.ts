import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/Auth/auth-service.service'; // Adjust this import to match your file structure
import { Observable } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService); // Inject AuthService to access the token
  const token = authService.getToken(); // Assuming a method to get the token

  // If a token is available, clone the request and add the authorization header
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Attach token to the request header
      },
    });
    return next(clonedReq); // Proceed with the cloned request
  }

  return next(req); // If no token, proceed with the original request
}
