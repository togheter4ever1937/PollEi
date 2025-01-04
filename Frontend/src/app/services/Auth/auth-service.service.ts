import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'jwtToken';
  private tokenExpiryKey = 'jwtTokenExpiry';

  constructor(private http: HttpClient, private route: Router) {}

  // Check if the code is running in the browser
  private isBrowser(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  }

  // Decode JWT to get the payload (to extract the expiration time)
  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  // Store the token and its expiration time
  login(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);

      // Decode the token to get the expiration time
      const decodedToken = this.decodeToken(token);
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
      localStorage.setItem(this.tokenExpiryKey, expirationTime.toString());
    }
  }

  // Remove the token and expiration time
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.tokenExpiryKey);
    }
  }

  // Check if the token is expired
  isTokenExpired(): boolean {
    if (this.isBrowser()) {
      const expiry = localStorage.getItem(this.tokenExpiryKey);
      if (expiry) {
        const expirationDate = new Date(parseInt(expiry, 10));
        const currentDate = new Date();
        return expirationDate < currentDate;
      }
    }
    return true; // If no expiration time is available, treat the token as expired
  }

  // Check if the user is authenticated (token exists and is not expired)
  isAuthenticated(): boolean {
    if (this.isBrowser()) {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        if (this.isTokenExpired()) {
          this.logout(); // Log out the user if the token is expired
          return false;
        }
        return true;
      }
    }
    return false;
  }

  // Get the stored token
  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getUserInfo(): any {
    if (this.isAuthenticated()) {
      return this.http.get('http://localhost:3000/api/utilisateur');
    } else {
      this.route.navigate(['/login']);
    }
  }
}
