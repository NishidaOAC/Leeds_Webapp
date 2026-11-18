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

  downloadDocument(url: string | null | undefined, suggestedTitle?: string): void {
    if (!url) return;

    // 1. Determine clean filename with extension
    let filename = '';
    const cleanUrl = url.split('?')[0].split('#')[0];
    const rawExt = cleanUrl.substring(cleanUrl.lastIndexOf('.') + 1).toLowerCase();
    const knownExts = ['pdf', 'png', 'jpg', 'jpeg', 'xlsx', 'xls', 'csv', 'docx', 'doc', 'webp'];
    const ext = knownExts.includes(rawExt) ? rawExt : 'pdf';

    if (suggestedTitle && suggestedTitle.trim()) {
      filename = suggestedTitle.trim().replace(/[/\\?%*:|"<>]/g, '_');
      if (!filename.toLowerCase().endsWith(`.${ext}`)) {
        filename = `${filename}.${ext}`;
      }
    } else {
      const extracted = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1);
      filename = decodeURIComponent(extracted) || `document.${ext}`;
      if (!filename.includes('.')) {
        filename = `${filename}.${ext}`;
      }
    }

    // 2. Direct fetch as blob first (avoids opening new tab)
    fetch(url, { mode: 'cors' })
      .then(response => {
        if (!response.ok) throw new Error('Fetch failed with status ' + response.status);
        return response.blob();
      })
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      })
      .catch(() => {
        // 3. Fallback: stream from backend proxy with Content-Disposition: attachment
        const proxyUrl = `${this.url}/proxy-download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
        
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = proxyUrl;
        document.body.appendChild(iframe);
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 20000);
      });
  }
}
