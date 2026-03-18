import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SupplierService {


   private baseUrl = `${environment.apiUrl}/supplier`;

  constructor(private http: HttpClient) {}


registerSupplier(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, formData);
  }

viewDocument(documentId: string): Observable<{ success: boolean; url: string }> {
  return this.http.get<{ success: boolean; url: string }>(
    `${this.baseUrl}/document/${documentId}`
  );
}

getSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Gets the pre-signed S3 URL for a document
  viewSupplierDocument(documentId: string): Observable<{ success: boolean, url: string }> {
    return this.http.get<{ success: boolean, url: string }>(`${this.baseUrl}/document/${documentId}`);
  }

  // ADD THIS METHOD TO FIX TS2551
  getSupplierById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }


  deleteSupplier(id: string) {
  return this.http.delete(`${this.baseUrl}/${id}`);
}

getOnboardingStatuses(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/onboardingStatuses');
  }
}
