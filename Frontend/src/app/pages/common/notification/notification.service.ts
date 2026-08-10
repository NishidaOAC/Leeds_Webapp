import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface BackendNotification {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  route?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  pagination?: PaginationInfo;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);

  // Gateway URL pointing to Auth Microservice singular '/notification' route
  // private apiUrl = 'http://localhost:3000/api/auth/notification';
private apiUrl = `${environment.apiUrl}/auth/notification`;
 

  getUserNotifications(
    userId: number | string,
    page: number = 1,
    limit: number = 10,
    unreadOnly: boolean = false
  ): Observable<ApiResponse<BackendNotification[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('unreadOnly', unreadOnly.toString());

    return this.http.get<ApiResponse<BackendNotification[]>>(
      `${this.apiUrl}/user/${userId}`,
      { params }
    );
  }

  getUnreadCount(userId: number | string): Observable<{ success: boolean; count: number }> {
    return this.http.get<{ success: boolean; count: number }>(
      `${this.apiUrl}/user/${userId}/unread-count`
    );
  }

  markAsRead(id: number): Observable<ApiResponse<BackendNotification>> {
    return this.http.put<ApiResponse<BackendNotification>>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(userId: number | string): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(
      `${this.apiUrl}/user/${userId}/read-all`,
      {}
    );
  }
}