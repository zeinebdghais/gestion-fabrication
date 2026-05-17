import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notif-container">
      <div *ngFor="let n of notifications"
           class="notif notif-{{n.type}}"
           (click)="dismiss(n.id)">
        <span class="notif-icon">{{ icons[n.type] }}</span>
        <span class="notif-msg">{{ n.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .notif-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 360px;
    }

    .notif {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      animation: slideIn 0.3s ease;
      backdrop-filter: blur(10px);
      border: 1px solid;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .notif-success {
      background: #001a0d;
      color: #00ff9d;
      border-color: #00ff9d30;
    }

    .notif-error {
      background: #1a0005;
      color: #ff4466;
      border-color: #ff446630;
    }

    .notif-warning {
      background: #1a1000;
      color: #ffaa00;
      border-color: #ffaa0030;
    }

    .notif-info {
      background: #001020;
      color: #00d4ff;
      border-color: #00d4ff30;
    }

    .notif-icon { font-size: 16px; }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  icons: Record<string, string> = {
    success: '✓', error: '✗', warning: '⚠', info: 'ℹ'
  };
  private sub!: Subscription;

  constructor(private notifSvc: NotificationService) {}

  ngOnInit() {
    this.sub = this.notifSvc.notifications$.subscribe(n => {
      this.notifications.push(n);
      setTimeout(() => this.dismiss(n.id), 4000);
    });
  }

  dismiss(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
