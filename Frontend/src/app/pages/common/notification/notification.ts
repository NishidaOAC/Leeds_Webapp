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

  ngOnInit(): void {
    // 1. Fetch logged in user ID dynamically from localStorage
    const storedUser = localStorage.getItem('user'); // or 'userId' depending on how you store it
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

    // 2. Fetch notifications if user ID is available
    if (this.currentUserId) {
      this.loadNotifications();
      this.loadUnreadCount();
    } else {
      console.warn('NotificationComponent: No logged-in user ID found.');
    }
  }

  loadNotifications(): void {
    if (!this.currentUserId) return;

    this.notificationService.getUserNotifications(this.currentUserId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.notifications = res.data;
        }
      },
      error: (err) => console.error('Error fetching notifications:', err),
    });
  }

  loadUnreadCount(): void {
    if (!this.currentUserId) return;

    this.notificationService.getUnreadCount(this.currentUserId).subscribe({
      next: (res) => {
        if (res.success) {
          this.unreadCount = res.count;
        }
      },
      error: (err) => console.error('Error fetching unread count:', err),
    });
  }

  onNotificationClick(notification: BackendNotification): void {
    // 1. Mark as read on backend if currently unread
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: (res) => {
          if (res.success) {
            notification.isRead = true;
            this.unreadCount = Math.max(0, this.unreadCount - 1);
          }
        },
        error: (err) => console.error('Error marking notification as read:', err),
      });
    }

    // 2. Navigate to route if present in DB
    if (notification.route) {
      this.router.navigateByUrl(notification.route);
    }
  }

  markAllAsRead(): void {
    if (!this.currentUserId) return;

    this.notificationService.markAllAsRead(this.currentUserId).subscribe({
      next: (res) => {
        if (res.success) {
          this.notifications.forEach((n) => (n.isRead = true));
          this.unreadCount = 0;
        }
      },
      error: (err) => console.error('Error marking all as read:', err),
    });
  }
}