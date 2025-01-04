import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private serverUrl = 'http://localhost:3000/api/signup';
  private serverUrl1 = 'http://localhost:3000/api/accVerification';

  constructor(private http: HttpClient) {}

  createUser(user: any): Observable<any> {
    return this.http.post(this.serverUrl, user);
  }

  codeVerification(code: string): Observable<any> {
    return this.http.post(this.serverUrl1, { code });
  }
}
