import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrdreFabricationService } from '../../core/services/ordre-fabrication.service';
import { MachineService } from '../../core/services/machine.service';
import { EmployeService } from '../../core/services/employe.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Tableau de Bord</h1>
          <p class="page-sub">
            Vue d'ensemble de la production — {{ today | date: 'EEEE d MMMM yyyy' : '' : 'fr' }}
          </p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card" *ngFor="let stat of stats">
          <div class="stat-header">
            <span class="stat-icon" [style.color]="stat.color">{{ stat.icon }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
          <div class="stat-value" [style.color]="stat.color">{{ stat.value }}</div>
          <div class="stat-desc">{{ stat.desc }}</div>
          <div class="stat-bar">
            <div
              class="stat-bar-fill"
              [style.width]="stat.pct + '%'"
              [style.background]="stat.color"
            ></div>
          </div>
        </div>
      </div>

      <!-- Ordres par état -->
      <div class="section-grid">
        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">◉ Ordres par État</h3>
            <a routerLink="/ordres" class="panel-link">Voir tout →</a>
          </div>
          <div class="etat-list">
            <div class="etat-row" *ngFor="let e of etats">
              <div class="etat-label">
                <span class="etat-dot" [style.background]="e.color"></span>
                {{ e.label }}
              </div>
              <div class="etat-count" [style.color]="e.color">{{ e.count }}</div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3 class="panel-title">◫ État des Machines</h3>
            <a routerLink="/machines" class="panel-link">Gérer →</a>
          </div>
          <div class="machine-status">
            <div class="machine-row" *ngFor="let m of machineEtats">
              <div class="machine-label">
                <span class="machine-dot" [style.background]="m.color"></span>
                {{ m.label }}
              </div>
              <div class="machine-count" [style.color]="m.color">{{ m.count }}</div>
            </div>
          </div>
        </div>

        <div class="panel actions-panel">
          <div class="panel-header">
            <h3 class="panel-title">⚡ Actions Rapides</h3>
          </div>
          <div class="quick-actions">
            <a routerLink="/ordres" class="quick-btn primary"> <span>+</span> Nouvel Ordre </a>
            <a routerLink="/produits" class="quick-btn"> <span>+</span> Nouveau Produit </a>
            <a routerLink="/machines" class="quick-btn"> <span>+</span> Nouvelle Machine </a>
            <a routerLink="/employes" class="quick-btn"> <span>+</span> Nouvel Employé </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .page {
        padding: 32px;
        color: #e8f4ff;
        font-family: 'IBM Plex Sans', sans-serif;
      }

      .page-header {
        margin-bottom: 32px;
      }

      .page-title {
        font-size: 28px;
        font-weight: 700;
        color: #e8f4ff;
        margin: 0 0 4px;
        font-family: 'IBM Plex Mono', monospace;
      }

      .page-sub {
        color: #4a6080;
        font-size: 13px;
        margin: 0;
        text-transform: capitalize;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 24px;
      }

      .stat-card {
        background: #0d1225;
        border: 1px solid #1e2a45;
        border-radius: 12px;
        padding: 20px;
        transition: border-color 0.2s;
      }

      .stat-card:hover {
        border-color: #2a4060;
      }

      .stat-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }

      .stat-icon {
        font-size: 18px;
      }

      .stat-label {
        font-size: 11px;
        color: #4a6080;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
      }

      .stat-value {
        font-size: 36px;
        font-weight: 800;
        font-family: 'IBM Plex Mono', monospace;
        margin-bottom: 4px;
      }

      .stat-desc {
        font-size: 11px;
        color: #3a5070;
        margin-bottom: 12px;
      }

      .stat-bar {
        height: 3px;
        background: #1e2a45;
        border-radius: 2px;
        overflow: hidden;
      }

      .stat-bar-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 1s ease;
      }

      .section-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
      }

      .panel {
        background: #0d1225;
        border: 1px solid #1e2a45;
        border-radius: 12px;
        padding: 20px;
      }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .panel-title {
        font-size: 13px;
        font-weight: 700;
        color: #a0c0e0;
        margin: 0;
        letter-spacing: 0.5px;
      }

      .panel-link {
        font-size: 11px;
        color: #00d4ff;
        text-decoration: none;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .panel-link:hover {
        opacity: 1;
      }

      .etat-list,
      .machine-status {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .etat-row,
      .machine-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .etat-label,
      .machine-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: #5a7090;
      }

      .etat-dot,
      .machine-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      .etat-count,
      .machine-count {
        font-size: 18px;
        font-weight: 700;
        font-family: 'IBM Plex Mono', monospace;
      }

      .quick-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .quick-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 11px 16px;
        border: 1px solid #1e2a45;
        border-radius: 8px;
        color: #5a7090;
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s;
      }

      .quick-btn:hover {
        color: #e8f4ff;
        border-color: #2a4060;
        background: #111827;
      }

      .quick-btn.primary {
        border-color: #00d4ff30;
        color: #00d4ff;
        background: #001a2e;
      }

      .quick-btn.primary:hover {
        background: #002040;
        border-color: #00d4ff60;
      }

      .quick-btn span {
        font-size: 16px;
        font-weight: 300;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  today = new Date();

  stats = [
    {
      icon: '◉',
      label: 'Ordres Total',
      value: '0',
      desc: 'Tous états confondus',
      color: '#00d4ff',
      pct: 0,
    },
    { icon: '▶', label: 'En Cours', value: '0', desc: 'En production', color: '#00ff9d', pct: 0 },
    { icon: '◫', label: 'Machines', value: '0', desc: 'Disponibles', color: '#ffaa00', pct: 0 },
    { icon: '◯', label: 'Employés', value: '0', desc: 'Affectés', color: '#ff6699', pct: 0 },
  ];

  etats = [
    { label: 'En Attente', color: '#ffaa00', count: 0 },
    { label: 'En Cours', color: '#00ff9d', count: 0 },
    { label: 'Terminé', color: '#00d4ff', count: 0 },
    { label: 'Annulé', color: '#ff4466', count: 0 },
  ];

  machineEtats = [
    { label: 'Disponible', color: '#00ff9d', count: 0 },
    { label: 'En Marche', color: '#00d4ff', count: 0 },
    { label: 'En Maintenance', color: '#ffaa00', count: 0 },
    { label: 'Hors Service', color: '#ff4466', count: 0 },
  ];

  constructor(
    private ordreSvc: OrdreFabricationService,
    private machineSvc: MachineService,
    private employeSvc: EmployeService,
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Load ordres counts by etat - using new format
    const etats = ['En attente', 'En cours', 'Terminé', 'Annulé'];
    const etatKeys = ['En attente', 'En cours', 'Terminé', 'Annulé'];
    let total = 0;
    let enCours = 0;

    etats.forEach((etat, i) => {
      this.ordreSvc.getByEtat(etat).subscribe({
        next: (data) => {
          this.etats[i].count = data.length;
          total += data.length;
          if (etat === 'En cours') enCours = data.length;
          this.stats[0].value = total.toString();
          this.stats[1].value = enCours.toString();
        },
        error: () => {},
      });
    });

    // Load machines by etat
    const machineEtats = ['Disponible', 'En marche', 'En maintenance', 'Hors service'];
    let dispo = 0;
    machineEtats.forEach((etat, i) => {
      this.machineSvc.getByEtat(etat).subscribe({
        next: (data) => {
          this.machineEtats[i].count = data.length;
          if (etat === 'Disponible') {
            dispo = data.length;
            this.stats[2].value = dispo.toString();
          }
        },
        error: () => {},
      });
    });

    // Load employees count
    this.employeSvc.getAll().subscribe({
      next: (data) => {
        this.stats[3].value = data.length.toString();
      },
      error: () => {},
    });
  }
}
