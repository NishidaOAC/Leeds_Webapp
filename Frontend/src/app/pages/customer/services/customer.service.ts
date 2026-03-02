import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CustomerService {


   private baseUrl = `${environment.apiUrl}/customer`;

  constructor(private http: HttpClient) {}
  getCustomerById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Save customer
  // saveCustomer(data: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}`, data);
  // }

  saveCustomer(formData: FormData): Observable<any> {
  // Do NOT manually set Content-Type header here; let the browser do it
  return this.http.post(`${this.baseUrl}`, formData);
}

  // Get customer list (optional)
  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
  viewDocument(documentId: string): Observable<{ url: string }> {
  return this.http.get<{ url: string }>(`${this.baseUrl}/documents/${documentId}/view`);
}

getSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Gets the pre-signed S3 URL for a document
  viewSupplierDocument(documentId: string): Observable<{ success: boolean, url: string }> {
    return this.http.get<{ success: boolean, url: string }>(`${this.baseUrl}/document/${documentId}`);
  }
}
