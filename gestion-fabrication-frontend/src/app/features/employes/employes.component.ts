import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeService } from '../../core/services/employe.service';
import { MachineService } from '../../core/services/machine.service';
import { EmployeDTO, MachineDTO } from '../../core/models/models';
import { NotificationService } from '../../core/services/notification.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-employes',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">◯ Employés</h1>
          <p class="page-sub">Gestion des affectations et postes</p>
        </div>
        <button class="btn-primary" (click)="openAdd()">+ Nouvel Employé</button>
      </div>

      <!-- Search -->
      <div class="search-bar">
        <input
          class="search-input"
          placeholder="Rechercher par ID..."
          [(ngModel)]="searchId"
          (keyup.enter)="searchById()"
        />
        <button class="btn-search" (click)="searchById()">Rechercher</button>
        <button class="btn-reset" (click)="reset()">Réinitialiser</button>
      </div>

      <!-- Table -->
      <div class="table-container">
        <div class="table-header-row">
          <span class="table-count">{{ employes.length }} employé(s)</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Poste</th>
              <th>Machine Assignée</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of employes" class="table-row">
              <td>
                <span class="id-badge">#{{ e.id }}</span>
              </td>
              <td>
                <div class="emp-cell">
                  <span class="emp-avatar">{{ getInitials(e.nom) }}</span>
                  <span class="emp-name">{{ e.nom }}</span>
                </div>
              </td>
              <td>
                <span class="poste-badge">{{ e.poste }}</span>
              </td>
              <td>
                <span *ngIf="e.machineId" class="machine-link">Machine #{{ e.machineId }}</span>
                <span *ngIf="!e.machineId" class="no-machine">Non assigné</span>
              </td>
              <td>
                <div class="action-btns">
                  <button class="btn-assign" (click)="openAssign(e)">⟳ Affecter Machine</button>
                  <button class="btn-edit" (click)="openEdit(e)">✎</button>
                  <button class="btn-delete" (click)="delete(e.id!)">✕</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="employes.length === 0">
              <td colspan="5" class="empty-row">Aucun employé trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Add/Edit -->
      <app-modal
        [title]="editingId ? 'Modifier Employé #' + editingId : 'Nouvel Employé'"
        [visible]="showModal"
        (close)="closeModal()"
      >
        <form class="form" (ngSubmit)="save()">
          <div class="form-group">
            <label>Nom Complet *</label>
            <input
              class="form-input"
              [(ngModel)]="form.nom"
              name="nom"
              required
              placeholder="Prénom Nom"
            />
          </div>
          <div class="form-group">
            <label>Poste *</label>
            <input
              class="form-input"
              [(ngModel)]="form.poste"
              name="poste"
              required
              placeholder="Ex: Opérateur, Technicien..."
            />
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="closeModal()">Annuler</button>
            <button type="submit" class="btn-primary" [disabled]="loading">
              {{ loading ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </app-modal>

      <!-- Modal Assign Machine -->
      <app-modal
        title="Affecter une Machine"
        [visible]="showAssignModal"
        (close)="closeAssignModal()"
      >
        <div class="assign-info" *ngIf="assigningEmploye">
          <p>
            Employé : <strong>{{ assigningEmploye.nom }}</strong>
          </p>
          <p>
            Machine actuelle :
            <strong *ngIf="assigningEmploye.machineId"
              >Machine #{{ assigningEmploye.machineId }}</strong
            >
            <span *ngIf="!assigningEmploye.machineId" class="no-machine">Aucune</span>
          </p>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label>Nouvelle Machine</label>
          <select class="form-input" [(ngModel)]="selectedMachineId">
            <option [ngValue]="undefined">-- Sélectionner --</option>
            <option *ngFor="let m of machines" [ngValue]="m.id">
              {{ m.nom }} (#{{ m.id }}) — {{ m.etat }}
            </option>
          </select>
        </div>
        <div class="form-actions" style="margin-top: 16px;">
          <button class="btn-cancel" (click)="closeAssignModal()">Annuler</button>
          <button
            class="btn-primary"
            (click)="confirmAssign()"
            [disabled]="!selectedMachineId || loading"
          >
            {{ loading ? 'Affectation...' : 'Confirmer' }}
          </button>
        </div>
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
      .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .search-bar {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      }

      .search-input {
        flex: 1;
        max-width: 300px;
        background: #0d1225;
        border: 1px solid #1e2a45;
        color: #e8f4ff;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-family: 'IBM Plex Sans', sans-serif;
        outline: none;
        transition: border-color 0.2s;
      }

      .search-input:focus {
        border-color: #00d4ff40;
      }

      .btn-search {
        background: #001a2e;
        border: 1px solid #00d4ff30;
        color: #00d4ff;
        padding: 10px 18px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-family: 'IBM Plex Sans', sans-serif;
        transition: all 0.2s;
      }

      .btn-reset {
        background: #0d1225;
        border: 1px solid #1e2a45;
        color: #4a6080;
        padding: 10px 18px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-family: 'IBM Plex Sans', sans-serif;
        transition: all 0.2s;
      }

      .btn-reset:hover {
        color: #e8f4ff;
      }

      .table-container {
        background: #0d1225;
        border: 1px solid #1e2a45;
        border-radius: 12px;
        overflow: hidden;
      }

      .table-header-row {
        padding: 14px 20px;
        border-bottom: 1px solid #1e2a45;
      }

      .table-count {
        font-size: 12px;
        color: #4a6080;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
      }

      .data-table th {
        padding: 12px 16px;
        text-align: left;
        font-size: 10px;
        font-weight: 700;
        color: #2d4060;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        background: #0a0e1a;
        border-bottom: 1px solid #1e2a45;
      }

      .table-row {
        border-bottom: 1px solid #111827;
        transition: background 0.15s;
      }

      .table-row:hover {
        background: #111827;
      }

      .data-table td {
        padding: 13px 16px;
        font-size: 13px;
        color: #7090b0;
      }

      .id-badge {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        color: #4a6080;
      }

      .emp-cell {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .emp-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, #001a2e, #00d4ff20);
        border: 1px solid #00d4ff30;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        color: #00d4ff;
        font-family: 'IBM Plex Mono', monospace;
        flex-shrink: 0;
      }

      .emp-name {
        color: #e8f4ff;
        font-weight: 500;
      }

      .poste-badge {
        background: #ff669915;
        border: 1px solid #ff669930;
        color: #ff6699;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
      }

      .machine-link {
        font-family: 'IBM Plex Mono', monospace;
        color: #00d4ff;
        font-size: 12px;
      }

      .no-machine {
        font-size: 11px;
        color: #2d4060;
        font-style: italic;
      }

      .action-btns {
        display: flex;
        gap: 6px;
      }

      .btn-assign {
        background: #001020;
        border: 1px solid #00d4ff20;
        color: #00d4ff;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 11px;
        font-family: 'IBM Plex Sans', sans-serif;
        transition: all 0.2s;
      }

      .btn-assign:hover {
        background: #002040;
        border-color: #00d4ff50;
      }

      .btn-edit {
        background: #1a2a1a;
        border: 1px solid #00ff9d20;
        color: #00ff9d;
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
      }

      .btn-edit:hover {
        background: #002000;
      }

      .btn-delete {
        background: #1a0005;
        border: 1px solid #ff446620;
        color: #ff4466;
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
      }

      .btn-delete:hover {
        background: #200010;
      }

      .empty-row {
        text-align: center;
        color: #2d4060;
        padding: 40px !important;
        font-style: italic;
      }

      /* Form */
      .form {
        display: flex;
        flex-direction: column;
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

      .assign-info {
        background: #0a0e1a;
        border: 1px solid #1e2a45;
        border-radius: 8px;
        padding: 14px;
        font-size: 13px;
        color: #7090b0;
        line-height: 1.8;
      }

      .assign-info strong {
        color: #e8f4ff;
      }
    `,
  ],
})
export class EmployesComponent implements OnInit {
  employes: EmployeDTO[] = [];
  machines: MachineDTO[] = [];
  showModal = false;
  showAssignModal = false;
  editingId: number | null = null;
  assigningEmploye: EmployeDTO | null = null;
  selectedMachineId: number | undefined;
  loading = false;
  searchId = '';

  form: EmployeDTO = { nom: '', poste: '' };

  constructor(
    private employeSvc: EmployeService,
    private machineSvc: MachineService,
    private notif: NotificationService,
  ) {}

  ngOnInit() {
    this.reset();
    this.loadMachines();
  }

  loadMachines() {
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

  reset() {
    this.searchId = '';
    this.employes = [];
    for (let i = 1; i <= 50; i++) {
      this.employeSvc.getById(i).subscribe({
        next: (e) => {
          if (e && !this.employes.find((emp) => emp.id === e.id)) {
            this.employes = [...this.employes, e].sort((a, b) => a.id! - b.id!);
          }
        },
        error: () => {},
      });
    }
  }

  searchById() {
    const id = parseInt(this.searchId);
    if (isNaN(id)) return;
    this.employeSvc.getById(id).subscribe({
      next: (e) => {
        this.employes = [e];
      },
      error: () => {
        this.employes = [];
        this.notif.error('Employé introuvable');
      },
    });
  }

  openAdd() {
    this.editingId = null;
    this.form = { nom: '', poste: '' };
    this.showModal = true;
  }

  openEdit(e: EmployeDTO) {
    this.editingId = e.id!;
    this.form = { ...e };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
  }

  save() {
    this.loading = true;
    const req = this.editingId
      ? this.employeSvc.update(this.editingId, this.form)
      : this.employeSvc.add(this.form);

    req.subscribe({
      next: (result) => {
        if (this.editingId) {
          this.notif.success('Employé modifié');
        } else {
          this.notif.success('Employé ajouté');
        }
        this.closeModal();
        this.reset();
        this.loading = false;
      },
      error: () => {
        this.notif.error("Erreur lors de l'enregistrement");
        this.loading = false;
      },
    });
  }

  delete(id: number) {
    if (!confirm('Supprimer cet employé ?')) return;
    this.employeSvc.delete(id).subscribe({
      next: () => {
        this.notif.success('Employé supprimé');
        this.reset();
      },
      error: () => this.notif.error('Erreur lors de la suppression'),
    });
  }

  openAssign(e: EmployeDTO) {
    this.assigningEmploye = e;
    this.selectedMachineId = e.machineId;
    this.showAssignModal = true;
  }

  closeAssignModal() {
    this.showAssignModal = false;
    this.assigningEmploye = null;
    this.selectedMachineId = undefined;
  }

  confirmAssign() {
    if (!this.assigningEmploye || !this.selectedMachineId) return;
    this.loading = true;
    this.employeSvc.assignerMachine(this.assigningEmploye.id!, this.selectedMachineId).subscribe({
      next: (updated) => {
        this.notif.success('Machine affectée avec succès');
        this.closeAssignModal();
        this.reset();
        this.loading = false;
      },
      error: () => {
        this.notif.error("Erreur lors de l'affectation");
        this.loading = false;
      },
    });
  }

  getInitials(nom: string): string {
    return nom
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
