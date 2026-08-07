import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BackendNotification {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  route?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);

  // 1. Point to API Gateway (Port 3000)
  // 2. Use '/api/auth' (Gateway prefix)
  // 3. Use '/notification' (Singular, matching Auth Service index.js)
  private apiUrl = 'http://localhost:3000/api/auth/notification';

  getUserNotifications(userId: number | string): Observable<ApiResponse<BackendNotification[]>> {
    return this.http.get<ApiResponse<BackendNotification[]>>(`${this.apiUrl}/user/${userId}`);
  }

  getUnreadCount(userId: number | string): Observable<{ success: boolean; count: number }> {
    return this.http.get<{ success: boolean; count: number }>(`${this.apiUrl}/user/${userId}/unread-count`);
  }

  markAsRead(id: number): Observable<ApiResponse<BackendNotification>> {
    return this.http.put<ApiResponse<BackendNotification>>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(userId: number | string): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/user/${userId}/read-all`, {});
  }
}