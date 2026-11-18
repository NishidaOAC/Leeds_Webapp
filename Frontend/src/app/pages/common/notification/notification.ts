import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService, BackendNotification } from './notification.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from '../../users/users-list/reset-password/reset-password.component';
import { UsersServices } from '../../users/users.service';

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
    MatPaginatorModule
  ],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification implements OnInit {
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private usersServices = inject(UsersServices);
   // Default items per page

  @ViewChild('menuTrigger') menuTrigger?: MatMenuTrigger;

  notifications: BackendNotification[] = [];
  unreadCount = 0;
  currentUserId: number | null = null;

  // Pagination State
  currentPage = 1;
  limit = 5;
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


  onPageChange(event: PageEvent): void {
    this.limit = event.pageSize;
    this.currentPage = event.pageIndex + 1; // Convert 0-based mat-paginator index to 1-based backend page
    this.loadNotifications(this.currentPage);
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
    // Automatically close the notification dropdown menu
    this.menuTrigger?.closeMenu();

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

    const message = notification.message || '';
    const route = notification.route || '';
    const isPasswordReset = 
      message.toLowerCase().includes('password reset') || 
      route.includes('reset');

    if (isPasswordReset) {
      this.handlePasswordResetNotification(notification);
      return;
    }

    if (notification.route) {
      const targetRoute = notification.route.startsWith('/users') 
        ? `/dashboard${notification.route}` 
        : notification.route;
      this.router.navigateByUrl(targetRoute);
    }
  }

  private handlePasswordResetNotification(notification: BackendNotification): void {
    const route = notification.route || '';
    const message = notification.message || '';

    let userId: number | null = null;
    let empNo = '';
    let username = '';

    // 1. Try to extract details from route query params
    if (route.includes('?')) {
      try {
        const queryPart = route.split('?')[1];
        const params = new URLSearchParams(queryPart);
        if (params.get('resetUserId')) userId = Number(params.get('resetUserId'));
        if (params.get('empNo')) empNo = params.get('empNo') || '';
        if (params.get('username')) username = params.get('username') || '';
      } catch (e) {
        console.warn('Could not parse route query params:', e);
      }
    }

    // 2. Fallback: Parse from message text: "Password reset request received from KAM (KAM001)."
    if (!empNo) {
      const match = message.match(/received from (.+?)\s*\(([^)]+)\)/i);
      if (match) {
        username = username || match[1].trim();
        empNo = match[2].trim();
      }
    }

    const navigateAndOpen = (id: number, eNo: string, uName: string) => {
      this.router.navigate(['/dashboard/users'], {
        queryParams: {
          openReset: 'true',
          resetUserId: id,
          empNo: eNo,
          username: uName
        }
      });
      this.openResetDialog(id, eNo, uName);
    };

    // 3. If we have the userId directly, navigate and open dialog
    if (userId) {
      navigateAndOpen(userId, empNo, username);
      return;
    }

    // 4. Otherwise, fetch user by empNo or username to obtain the user ID
    const searchTerm = empNo || username;
    if (searchTerm) {
      this.usersServices.getAllUsers(1, 10, searchTerm).subscribe({
        next: (res: any) => {
          const items = res?.items || res?.data || (Array.isArray(res) ? res : []);
          const targetUser = items.find((u: any) => 
            (empNo && u.empNo?.toLowerCase() === empNo.toLowerCase()) ||
            (username && u.name?.toLowerCase() === username.toLowerCase())
          ) || items[0];

          if (targetUser) {
            navigateAndOpen(targetUser.id, targetUser.empNo || empNo, targetUser.name || username);
          } else {
            this.router.navigateByUrl('/dashboard/users');
          }
        },
        error: () => {
          this.router.navigateByUrl('/dashboard/users');
        }
      });
    } else {
      this.router.navigateByUrl('/dashboard/users');
    }
  }

  private openResetDialog(id: number, empNo: string, username: string): void {
    if (this.dialog.openDialogs.some(d => d.componentInstance instanceof ResetPasswordComponent)) {
      return;
    }
    this.dialog.open(ResetPasswordComponent, {
      width: '450px',
      data: {
        id,
        empNo,
        username,
        paswordReset: false
      }
    });
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