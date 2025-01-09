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

 
  private isBrowser(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  }

  
  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  
  login(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);

      
      const decodedToken = this.decodeToken(token);
      const expirationTime = decodedToken.exp * 1000;
      localStorage.setItem(this.tokenExpiryKey, expirationTime.toString());
    }
  }

  
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.tokenExpiryKey);
    }
  }

  
  isTokenExpired(): boolean {
    if (this.isBrowser()) {
      const expiry = localStorage.getItem(this.tokenExpiryKey);
      if (expiry) {
        const expirationDate = new Date(parseInt(expiry, 10));
        const currentDate = new Date();
        return expirationDate < currentDate;
      }
    }
    return true;
  }

  
  isAuthenticated(): boolean {
    if (this.isBrowser()) {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        if (this.isTokenExpired()) {
          this.logout(); 
          return false;
        }
        return true;
      }
    }
    return false;
  }

  
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
