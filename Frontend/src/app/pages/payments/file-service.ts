import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { catchError, EMPTY, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  url = `${environment.apiUrl}/file`;
  
  constructor(private _http:HttpClient) { }

  uploadInvoice(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      // Don't set Content-Type - let browser set it with boundary
    });
    
    return this._http.post(`${this.url}/upload`, formData, {
      headers,
      reportProgress: true,
      observe: 'events'  // Change to 'events' for progress tracking
    }).pipe(
      // Convert HttpEvent to your expected response format
      switchMap(event => {
        if (event.type === HttpEventType.Response) {
          return of(event.body);
        }
        return EMPTY;
      }),
      catchError(error => {
        console.error('Upload error:', error);
        return throwError(() => error);
      })
    );
  }

  uploadBankSlip(file: any): Observable<any> {
    if (file instanceof File) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      return this._http.post(this.url + '/bankslipupload', formData);
    } else {
      // Handle the case where 'file' is not a File object
      return throwError("Invalid file type");
    }
  }

  deleteUploadByurl(key: string) {
    return this._http.delete(`${this.url}/filedeletebyurl/?key=${key}`);
  }
  
  deleteUploaded(id: number, i: number, key?: string) {
    return this._http.delete(`${this.url}/filedelete?id=${id}&index=${i}&key=${key}`);
  }

  deleteBSUploadByurl(key: string) {
    return this._http.delete(`${this.url}/invoice/bsdeletebyurl/?key=${key}`);
  }

}
