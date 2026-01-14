import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PerformaInvoice } from './performa-invoice';
import { PerformaInvoiceStatus } from './performa-invoice-status';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  url = `${environment.apiUrl}/payments`;

  private state = new Map<string, any>();
  
  setState(key: string, value: any) {
    this.state.set(key, value);
  }
  
  getState(key: string) {
    return this.state.get(key);
  }

  constructor(private _http:HttpClient) { }
  
  getDashboardCCPI(status?: string, currentPage?: number, pageSize?: number): Observable<any[]>{
    return this._http.get<any[]>(this.url + `/dashboard/cc/?status=${status}&page=${currentPage}&pageSize=${pageSize}`);
  }

  getDashboardWTPI(status?: string, currentPage?: number, pageSize?: number): Observable<any[]>{
    return this._http.get<any[]>(this.url + `/dashboard/wt/?status=${status}&page=${currentPage}&pageSize=${pageSize}`);
  }

  getPI(status?: string, currentPage?: number, pageSize?: number): Observable<any[]>{
    return this._http.get<any[]>(this.url + `/find/?status=${status}&page=${currentPage}&pageSize=${pageSize}`);
  }
  
  addPI(data: any){
    return this._http.post(this.url + '/save', data);
  }

  addPIByKAM(data: any){
    return this._http.post(this.url + '/saveByKAM', data);
  }

  addPIByAM(data: any){
    return this._http.post(this.url + '/saveByAM', data);
  }
  
  getPIByAdmin(status?: string, search?: string, currentPage?: number, pageSize?: number): Observable<PerformaInvoice[]>{
    return this._http.get<PerformaInvoice[]>(this.url + `/findbyadmin/?status=${status}&search=${search}&page=${currentPage}&pageSize=${pageSize}`);
  }

  getPIBySP(status?: string, search?: string, currentPage?: number, pageSize?: number): Observable<PerformaInvoice[]>{
    return this._http.get<PerformaInvoice[]>(this.url + `/findbysp/?status=${status}&search=${search}&page=${currentPage}&pageSize=${pageSize}`);
  }

  getPIByKAM(status?: string, search?: string, currentPage?: number, pageSize?: number): Observable<PerformaInvoice[]>{
    return this._http.get<PerformaInvoice[]>(this.url + `/findbkam/?status=${status}&search=${search}&page=${currentPage}&pageSize=${pageSize}`);
  }

  getPIByAM(status?: string, search?: string, currentPage?: number, pageSize?: number): Observable<PerformaInvoice[]>{
    return this._http.get<PerformaInvoice[]>(this.url + `/findbyam/?status=${status}&search=${search}&page=${currentPage}&pageSize=${pageSize}`);
  }

  getPIByMA(status?: string, search?: string, currentPage?: number, pageSize?: number): Observable<PerformaInvoice[]>{
    return this._http.get<PerformaInvoice[]>(this.url + `/findbyma/?status=${status}&search=${search}&page=${currentPage}&pageSize=${pageSize}`);
  }
  
  getPIById(id: number): Observable<any>{
    return this._http.get<any>(this.url + '/findbyid/'+id);
  }

  addBankSlip(data: any, id: number){
    return this._http.patch(this.url + '/bankslip/' + id, data);
  }

  getPIStatusByPIId(id: number, search: string): Observable<PerformaInvoiceStatus[]>{
    return this._http.get<PerformaInvoiceStatus[]>(this.url + `/invoice-status/findbypi/?search=${search}&id=${id}`);
  }

  uploadInvoice(formData: FormData): Observable<any> {
    return this._http.post(this.url + '/invoice/fileupload', formData);
  }

  updatePIStatus(data: any){
    return this._http.post(this.url + '/invoice-status/updatestatus', data);
  }
  
  updateKAM(data: any, id: number){
    return this._http.patch(this.url + '/performaInvoice/kamupdate/'+ id, data);
  }


}
