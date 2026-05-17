import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificationsComponent],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="brand-icon">⚙</span>
          <div class="brand-text">
            <span class="brand-title">FabriManager</span>
            <span class="brand-sub">Gestion de Production</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section-label">PRINCIPAL</div>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">◈</span>
            <span>Tableau de Bord</span>
          </a>

          <div class="nav-section-label">PRODUCTION</div>
          <a routerLink="/ordres" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">◉</span>
            <span>Ordres de Fabrication</span>
          </a>
          <a routerLink="/produits" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">◧</span>
            <span>Produits</span>
          </a>

          <div class="nav-section-label">RESSOURCES</div>
          <a routerLink="/machines" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">◫</span>
            <span>Machines</span>
          </a>
          <a routerLink="/employes" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">◯</span>
            <span>Employés</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="status-indicator">
            <span class="status-dot"></span>
            <span>Système opérationnel</span>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <app-notifications></app-notifications>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      font-family: 'IBM Plex Sans', sans-serif;
    }

    .app-shell {
      display: flex;
      height: 100vh;
      background: #0a0e1a;
    }

    .sidebar {
      width: 260px;
      min-width: 260px;
      background: #0d1225;
      border-right: 1px solid #1e2a45;
      display: flex;
      flex-direction: column;
      padding: 0;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid #1e2a45;
    }

    .brand-icon {
      font-size: 28px;
      color: #00d4ff;
      filter: drop-shadow(0 0 8px #00d4ff80);
      animation: spin 10s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-size: 16px;
      font-weight: 700;
      color: #e8f4ff;
      letter-spacing: 0.5px;
    }

    .brand-sub {
      font-size: 10px;
      color: #4a6080;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .sidebar-nav {
      flex: 1;
      padding: 20px 0;
      overflow-y: auto;
    }

    .nav-section-label {
      font-size: 9px;
      font-weight: 700;
      color: #2d4060;
      letter-spacing: 2px;
      padding: 16px 20px 6px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 20px;
      color: #5a7090;
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 500;
      transition: all 0.2s;
      border-left: 3px solid transparent;
      margin: 1px 0;
    }

    .nav-item:hover {
      color: #a0c8e8;
      background: #111827;
      border-left-color: #1e3a5a;
    }

    .nav-item.active {
      color: #00d4ff;
      background: linear-gradient(90deg, #001a2e 0%, transparent 100%);
      border-left-color: #00d4ff;
    }

    .nav-icon {
      font-size: 15px;
      width: 18px;
      text-align: center;
    }

    .sidebar-footer {
      padding: 16px 20px;
      border-top: 1px solid #1e2a45;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: #3a5070;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #00ff9d;
      box-shadow: 0 0 6px #00ff9d;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      position: relative;
      background: #0a0e1a;
    }
  `]
})
export class AppComponent {}
