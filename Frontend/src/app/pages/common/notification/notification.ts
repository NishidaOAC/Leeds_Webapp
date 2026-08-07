import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

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
  notifications: NotificationItem[] = [];
  unreadCount = 0;

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    // Replace this with your actual Backend API service call
    this.notifications = [
      {
        id: '1',
        title: 'New Message',
        message: 'You have received a new message from Support.',
        timestamp: new Date(),
        read: false,
      },
      {
        id: '2',
        title: 'System Update',
        message: 'System maintenance scheduled for tonight at 12 AM.',
        timestamp: new Date(Date.now() - 3600000),
        read: true,
      },
    ];

    this.updateUnreadCount();
  }

  updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter((n) => !n.read).length;
  }

  markAsRead(notification: NotificationItem): void {
    if (!notification.read) {
      notification.read = true;
      this.updateUnreadCount();
      // TODO: Call backend service to update single notification status
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
    this.updateUnreadCount();
    // TODO: Call backend service to mark all notifications as read
  }
}