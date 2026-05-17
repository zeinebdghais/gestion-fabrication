import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MachineService } from '../../core/services/machine.service';
import { MachineDTO } from '../../core/models/models';
import { NotificationService } from '../../core/services/notification.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-machines',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">◫ Machines</h1>
          <p class="page-sub">Suivi des disponibilités et maintenances</p>
        </div>
        <button class="btn-primary" (click)="openAdd()">+ Nouvelle Machine</button>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <span class="filter-label">Filtrer par état :</span>
        <button class="filter-btn" [class.active]="activeFilter === ''" (click)="filterByEtat('')">
          Tout
        </button>
        <button
          class="filter-btn disponible"
          [class.active]="activeFilter === 'DISPONIBLE'"
          (click)="filterByEtat('DISPONIBLE')"
        >
          Disponible
        </button>
        <button
          class="filter-btn maintenance"
          [class.active]="activeFilter === 'EN_MAINTENANCE'"
          (click)="filterByEtat('EN_MAINTENANCE')"
        >
          Maintenance
        </button>
        <button
          class="filter-btn hors-service"
          [class.active]="activeFilter === 'HORS_SERVICE'"
          (click)="filterByEtat('HORS_SERVICE')"
        >
          Hors Service
        </button>

        <div class="search-inline">
          <input
            class="search-input"
            placeholder="ID machine..."
            [(ngModel)]="searchId"
            (keyup.enter)="searchById()"
          />
          <button class="btn-search" (click)="searchById()">↵</button>
        </div>
      </div>

      <!-- Cards Grid -->
      <div class="machines-grid" *ngIf="machines.length > 0">
        <div
          class="machine-card"
          *ngFor="let m of machines"
          [class]="'card-' + getEtatClass(m.etat)"
        >
          <div class="card-top">
            <div class="card-id">#{{ m.id }}</div>
            <span class="etat-badge" [class]="'badge-' + getEtatClass(m.etat)">{{
              formatEtat(m.etat)
            }}</span>
          </div>
          <div class="card-name">{{ m.nom }}</div>
          <div class="card-maintenance">
            <span class="maint-label">Dernière maintenance</span>
            <span class="maint-date">{{ m.derniereMaintenance | date: 'dd/MM/yyyy' }}</span>
          </div>
          <div class="card-actions">
            <button
              class="btn-maint"
              (click)="declencherMaintenance(m.id!)"
              title="Déclencher maintenance"
            >
              🔧 Maintenance
            </button>
            <button class="btn-edit-sm" (click)="openEdit(m)">✎</button>
            <button class="btn-del-sm" (click)="delete(m.id!)">✕</button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="machines.length === 0">
        <div class="empty-icon">◫</div>
        <p>Aucune machine trouvée</p>
      </div>

      <!-- Modal Add/Edit -->
      <app-modal
        [title]="editingId ? 'Modifier Machine #' + editingId : 'Nouvelle Machine'"
        [visible]="showModal"
        (close)="closeModal()"
      >
        <form class="form" (ngSubmit)="save()">
          <div class="form-group">
            <label>Nom *</label>
            <input
              class="form-input"
              [(ngModel)]="form.nom"
              name="nom"
              required
              placeholder="Nom de la machine"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>État *</label>
              <select class="form-input" [(ngModel)]="form.etat" name="etat" required>
                <option value="">-- Sélectionner --</option>
                <option value="DISPONIBLE">Disponible</option>
                <option value="EN_MAINTENANCE">En Maintenance</option>
                <option value="HORS_SERVICE">Hors Service</option>
              </select>
            </div>
            <div class="form-group">
              <label>Dernière Maintenance *</label>
              <input
                class="form-input"
                type="date"
                [(ngModel)]="form.derniereMaintenance"
                name="derniereMaintenance"
                required
              />
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="closeModal()">Annuler</button>
            <button type="submit" class="btn-primary" [disabled]="loading">
              {{ loading ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </app-modal>
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
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 28px;
      }

      .page-title {
        font-size: 26px;
        font-weight: 700;
        color: #e8f4ff;
        margin: 0 0 4px;
        font-family: 'IBM Plex Mono', monospace;
      }

      .page-sub {
        color: #4a6080;
        font-size: 13px;
        margin: 0;
      }

      .btn-primary {
        background: #00d4ff15;
        border: 1px solid #00d4ff40;
        color: #00d4ff;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        font-family: 'IBM Plex Sans', sans-serif;
        transition: all 0.2s;
      }

      .btn-primary:hover {
        background: #00d4ff25;
        border-color: #00d4ff80;
      }

      .filter-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 24px;
        flex-wrap: wrap;
      }

      .filter-label {
        font-size: 12px;
        color: #4a6080;
        margin-right: 4px;
      }

      .filter-btn {
        background: #0d1225;
        border: 1px solid #1e2a45;
        color: #4a6080;
        padding: 7px 14px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 12px;
        font-family: 'IBM Plex Sans', sans-serif;
        transition: all 0.2s;
      }

      .filter-btn:hover,
      .filter-btn.active {
        color: #e8f4ff;
        border-color: #2a4060;
        background: #111827;
      }
      .filter-btn.disponible.active {
        color: #00ff9d;
        border-color: #00ff9d50;
        background: #001a0d;
      }
      .filter-btn.en-marche.active {
        color: #00d4ff;
        border-color: #00d4ff50;
        background: #001020;
      }
      .filter-btn.maintenance.active {
        color: #ffaa00;
        border-color: #ffaa0050;
        background: #1a1000;
      }
      .filter-btn.hors-service.active {
        color: #ff4466;
        border-color: #ff446650;
        background: #1a0005;
      }

      .search-inline {
        display: flex;
        gap: 6px;
        margin-left: auto;
      }

      .search-input {
        background: #0d1225;
        border: 1px solid #1e2a45;
        color: #e8f4ff;
        padding: 7px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-family: 'IBM Plex Sans', sans-serif;
        outline: none;
        width: 120px;
      }

      .search-input:focus {
        border-color: #00d4ff40;
      }

      .btn-search {
        background: #001a2e;
        border: 1px solid #00d4ff30;
        color: #00d4ff;
        padding: 7px 12px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
      }

      /* Cards */
      .machines-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;
      }

      .machine-card {
        background: #0d1225;
        border: 1px solid #1e2a45;
        border-radius: 12px;
        padding: 20px;
        transition: all 0.2s;
        position: relative;
        overflow: hidden;
      }

      .machine-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
      }

      .card-disponible::before {
        background: #00ff9d;
      }
      .card-en-marche::before {
        background: #00d4ff;
      }
      .card-maintenance::before {
        background: #ffaa00;
      }
      .card-hors-service::before {
        background: #ff4466;
      }

      .machine-card:hover {
        border-color: #2a4060;
        transform: translateY(-2px);
      }

      .card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .card-id {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        color: #2d4060;
      }

      .etat-badge {
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      .badge-disponible {
        background: #00ff9d15;
        color: #00ff9d;
        border: 1px solid #00ff9d30;
      }
      .badge-en-marche {
        background: #00d4ff15;
        color: #00d4ff;
        border: 1px solid #00d4ff30;
      }
      .badge-maintenance {
        background: #ffaa0015;
        color: #ffaa00;
        border: 1px solid #ffaa0030;
      }
      .badge-hors-service {
        background: #ff446615;
        color: #ff4466;
        border: 1px solid #ff446630;
      }

      .card-name {
        font-size: 16px;
        font-weight: 700;
        color: #e8f4ff;
        margin-bottom: 14px;
      }

      .card-maintenance {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-bottom: 16px;
      }

      .maint-label {
        font-size: 10px;
        color: #2d4060;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .maint-date {
        font-size: 13px;
        color: #5a7090;
        font-family: 'IBM Plex Mono', monospace;
      }

      .card-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .btn-maint {
        flex: 1;
        background: #1a1000;
        border: 1px solid #ffaa0030;
        color: #ffaa00;
        padding: 8px 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-family: 'IBM Plex Sans', sans-serif;
        transition: all 0.2s;
      }

      .btn-maint:hover {
        background: #2a1a00;
        border-color: #ffaa0060;
      }

      .btn-edit-sm,
      .btn-del-sm {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .btn-edit-sm {
        background: #1a2a1a;
        border: 1px solid #00ff9d20;
        color: #00ff9d;
      }

      .btn-edit-sm:hover {
        background: #002000;
      }

      .btn-del-sm {
        background: #1a0005;
        border: 1px solid #ff446620;
        color: #ff4466;
      }

      .btn-del-sm:hover {
        background: #200010;
      }

      .empty-state {
        text-align: center;
        padding: 80px 0;
        color: #2d4060;
      }

      .empty-icon {
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.4;
      }

      /* Form */
      .form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .form-group label {
        font-size: 11px;
        font-weight: 600;
        color: #4a6080;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .form-input {
        background: #0a0e1a;
        border: 1px solid #1e2a45;
        color: #e8f4ff;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 13px;
        font-family: 'IBM Plex Sans', sans-serif;
        outline: none;
        transition: border-color 0.2s;
      }

      .form-input:focus {
        border-color: #00d4ff40;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 8px;
      }

      .btn-cancel {
        background: none;
        border: 1px solid #1e2a45;
        color: #4a6080;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-family: 'IBM Plex Sans', sans-serif;
        transition: all 0.2s;
      }

      .btn-cancel:hover {
        color: #e8f4ff;
        border-color: #2a4060;
      }
    `,
  ],
})
export class MachinesComponent implements OnInit {
  machines: MachineDTO[] = [];
  showModal = false;
  editingId: number | null = null;
  loading = false;
  activeFilter = '';
  searchId = '';

  form: MachineDTO = { nom: '', etat: '', derniereMaintenance: '' };

  constructor(
    private machineSvc: MachineService,
    private notif: NotificationService,
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.machines = [];
    for (let i = 1; i <= 50; i++) {
      this.machineSvc.getById(i).subscribe({
        next: (m) => {
          if (m && !this.machines.find((mach) => mach.id === m.id)) {
            this.machines = [...this.machines, m].sort((a, b) => a.id! - b.id!);
          }
        },
        error: () => {},
      });
    }
  }

  filterByEtat(etat: string) {
    this.activeFilter = etat;
    if (!etat) {
      this.loadAll();
      return;
    }
    this.machineSvc.getByEtat(etat).subscribe({
      next: (data) => {
        this.machines = data;
      },
      error: () => {
        this.machines = [];
        this.notif.error('Erreur de chargement');
      },
    });
  }

  searchById() {
    const id = parseInt(this.searchId);
    if (isNaN(id)) return;
    this.machineSvc.getById(id).subscribe({
      next: (m) => {
        this.machines = [m];
        this.activeFilter = '';
      },
      error: () => {
        this.machines = [];
        this.notif.error('Machine introuvable');
      },
    });
  }

  openAdd() {
    this.editingId = null;
    this.form = { nom: '', etat: '', derniereMaintenance: new Date().toISOString().split('T')[0] };
    this.showModal = true;
  }

  openEdit(m: MachineDTO) {
    this.editingId = m.id!;
    this.form = { ...m };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
  }

  save() {
    this.loading = true;
    const req = this.editingId
      ? this.machineSvc.update(this.editingId, this.form)
      : this.machineSvc.add(this.form);

    req.subscribe({
      next: (result) => {
        if (this.editingId) {
          this.notif.success('Machine modifiée');
        } else {
          this.notif.success('Machine ajoutée');
        }
        this.closeModal();
        this.loadAll();
        this.loading = false;
      },
      error: () => {
        this.notif.error("Erreur lors de l'enregistrement");
        this.loading = false;
      },
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer cette machine ?')) return;
    this.machineSvc.delete(id).subscribe({
      next: () => {
        this.notif.success('Machine supprimée');
        this.loadAll();
      },
      error: () => this.notif.error('Erreur lors de la suppression'),
    });
  }

  declencherMaintenance(id: number) {
    this.machineSvc.declencherMaintenance(id).subscribe({
      next: (updated) => {
        this.notif.success('Maintenance déclenchée');
        this.loadAll();
      },
      error: () => this.notif.error('Erreur lors du déclenchement'),
    });
  }

  getEtatClass(etat: string): string {
    const map: Record<string, string> = {
      DISPONIBLE: 'disponible',
      EN_MARCHE: 'en-marche',
      EN_MAINTENANCE: 'maintenance',
      HORS_SERVICE: 'hors-service',
    };
    return map[etat] || 'disponible';
  }

  formatEtat(etat: string): string {
    const map: Record<string, string> = {
      DISPONIBLE: 'Disponible',
      EN_MAINTENANCE: 'Maintenance',
      HORS_SERVICE: 'Hors Service',
    };
    return map[etat] || etat;
  }
}
