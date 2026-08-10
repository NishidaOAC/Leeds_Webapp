import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService, BackendNotification } from './notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification implements OnInit {
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  notifications: BackendNotification[] = [];
  unreadCount = 0;
  currentUserId: number | null = null;

  // Pagination State
  currentPage = 1;
  limit = 10;
  totalPages = 1;
  totalNotifications = 0;
  isLoading = false;

  ngOnInit(): void {
    this.extractUserId();

    if (this.currentUserId) {
      this.loadNotifications(1);
      this.loadUnreadCount();
    }
  }

  private extractUserId(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        this.currentUserId = parsed.id || parsed.userId || Number(localStorage.getItem('userId'));
      } catch {
        this.currentUserId = Number(localStorage.getItem('userId'));
      }
    } else {
      const idFromStorage = localStorage.getItem('userId');
      this.currentUserId = idFromStorage ? Number(idFromStorage) : null;
    }
  }

  loadNotifications(page: number = 1): void {
    if (!this.currentUserId || this.isLoading) return;

    this.isLoading = true;

    this.notificationService.getUserNotifications(this.currentUserId, page, this.limit).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          if (page === 1) {
            this.notifications = res.data;
          } else {
            this.notifications = [...this.notifications, ...res.data];
          }

          if (res.pagination) {
            this.currentPage = res.pagination.page;
            this.totalPages = res.pagination.totalPages;
            this.totalNotifications = res.pagination.total;
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        this.isLoading = false;
      },
    });
  }

  loadMore(event: Event): void {
    event.stopPropagation();
    if (this.currentPage < this.totalPages) {
      this.loadNotifications(this.currentPage + 1);
    }
  }

  loadUnreadCount(): void {
    if (!this.currentUserId) return;

    this.notificationService.getUnreadCount(this.currentUserId).subscribe({
      next: (res) => {
        if (res.success) {
          this.unreadCount = res.count;
        }
      },
      error: (err) => console.error('Error getting unread count:', err),
    });
  }

  onNotificationClick(notification: BackendNotification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: (res) => {
          if (res.success) {
            notification.isRead = true;
            this.unreadCount = Math.max(0, this.unreadCount - 1);
          }
        },
      });
    }

    if (notification.route) {
      this.router.navigateByUrl(notification.route);
    }
  }

  markAllAsRead(): void {
    if (!this.currentUserId || this.unreadCount === 0) return;

    this.notificationService.markAllAsRead(this.currentUserId).subscribe({
      next: (res) => {
        if (res.success) {
          this.notifications.forEach((n) => (n.isRead = true));
          this.unreadCount = 0;
        }
      },
    });
  }
}