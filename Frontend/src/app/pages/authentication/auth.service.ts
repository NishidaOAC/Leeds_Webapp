import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url =`${environment.apiUrl}/auth`; // API Gateway URL
  // private url ='http://localhost:3001'
  
  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, credentials).pipe(
      catchError(err => {
        this.showError(err.error?.message || 'Login failed');
        return throwError(() => err);
      })
    );
  }

  requestPasswordReset(identifier: string): Observable<any> {
    return this.http.post<any>(`${this.url}/forgot-password`, { empNo: identifier }).pipe(
      catchError(err => {
        this.showError(err.error?.message || 'Password reset request failed');
        return throwError(() => err);
      })
    );
  }

  // Alternative method if you want to keep userName parameter
  loginWithUsername(username: string, password: string): Observable<any> {
    // Check if username is an email
    const isEmail = this.isValidEmail(username);
    
    const credentials = isEmail 
      ? { email: username, password }
      : { username: username, password }; // If you want to support username login
    
    return this.login(credentials);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  storeAuthData(authData: any) {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }

  private showError(message: string) {
    alert(message); // Or use a toast service
  }

  // Other methods...
  register(userData: any): Observable<any> {
    return this.http.post(`${this.url}/register`, userData).pipe(
      catchError(err => {
        this.showError(err.error?.message || 'Registration failed');
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    // localStorage.removeItem('token');
    // localStorage.removeItem('refreshToken');
    // localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  getUserPower(): string | null {
    const user = this.getCurrentUser();
    return user && user.power ? user.power : null;
  }
}
