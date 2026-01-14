import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Company } from './company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private apiUrl = `${environment.apiUrl}/payments/company`;

  constructor(private http: HttpClient) { }

  getCompany(filterValue?: string, page?: number, pagesize?:number): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/find?search=${filterValue}&page=${page}&pageSize=${pagesize}`);
  }
  
  addCompany(data: any): Observable<any> {
    return this.http.post( this.apiUrl, data);
  }
  
  updateCompany(id: number, data: any): Observable<Company> {
    return this.http.patch<Company>(`${this.apiUrl}/${id}`, data);
  }
  
  getCustomers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/customers`);
  }

  getSuppliers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/suppliers`);
  }

  getCompanyInfo(id: any) {
    return this.http.get(this.apiUrl + "/company/" + id);
  }

  deleteCompany(id: number) {
    return this.http.delete(`${this.apiUrl}/company/` +id);
  }
  

}
