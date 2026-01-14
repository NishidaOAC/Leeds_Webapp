import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DesignationServices {
    private apiUrl = `${environment.apiUrl}/auth/role`;
  
  constructor(private http: HttpClient) { }

  // Role methods
  createRole(role: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, role);
  }

  updateRole(id: number, role: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, role);
  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getRoleById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/findbyid/${id}`);
  }



  // Designation methods
  createDesignation(designation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/designations`, designation);
  }

  getDesignations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/designations`);
  }

  getDesignationsByRole(roleId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/designations/role/${roleId}`);
  }

  updateDesignation(id: number, designation: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/designations/${id}`, designation);
  }

  deleteDesignation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/designations/${id}`);
  }
}
