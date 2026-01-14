import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from './users-list/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersServices {
    private apiUrl = `${environment.apiUrl}/auth`; // ✅ Gateway URL

  constructor(private http: HttpClient) {}

  getUserByRoleName(roleName: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/findbyroleName/${roleName}`);
  }
  getAllUsers(page?: number, limit?: number, search?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/find?page=${page}&limit=${limit}&search=${search}`);
  }

  // ➕ Add new user
  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, user);
  }

  // ❌ Delete user
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
  
  // ✏️ Update user
  updateUser(id: number, user: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/update/${id}`, user);
  }

  // 🔍 Get single user
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }



  // 🔍 Get single user
  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctors`);
  }

}
