import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdreFabricationService } from '../../core/services/ordre-fabrication.service';
import { ProduitService } from '../../core/services/produit.service';
import { MachineService } from '../../core/services/machine.service';
import { OrdreFabricationDTO, ProduitDTO, MachineDTO } from '../../core/models/models';
import { NotificationService } from '../../core/services/notification.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-ordres-fabrication',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">◉ Ordres de Fabrication</h1>
          <p class="page-sub">Création, suivi et gestion des ordres de production</p>
        </div>
        <button class="btn-primary" (click)="openAdd()">+ Nouvel Ordre</button>
      </div>

      <!-- Filter tabs -->
      <div class="filter-tabs">
        <button class="tab" [class.active]="activeFilter === ''" (click)="filterAll()">
          Tous <span class="tab-count">{{ allOrdres.length }}</span>
        </button>
        <button
          class="tab attente"
          [class.active]="activeFilter === 'En attente'"
          (click)="filterByEtat('En attente')"
        >
          ⏳ En Attente <span class="tab-count">{{ countByEtat('En attente') }}</span>
        </button>
        <button
          class="tab en-cours"
          [class.active]="activeFilter === 'En cours'"
          (click)="filterByEtat('En cours')"
        >
          ▶ En Cours <span class="tab-count">{{ countByEtat('En cours') }}</span>
        </button>
        <button
          class="tab termine"
          [class.active]="activeFilter === 'Terminé'"
          (click)="filterByEtat('Terminé')"
        >
          ✓ Terminé <span class="tab-count">{{ countByEtat('Terminé') }}</span>
        </button>
        <button
          class="tab annule"
          [class.active]="activeFilter === 'Annulé'"
          (click)="filterByEtat('Annulé')"
        >
          ✕ Annulé <span class="tab-count">{{ countByEtat('Annulé') }}</span>
        </button>

        <div class="search-inline">
          <input
            class="search-input"
            placeholder="ID ordre..."
            [(ngModel)]="searchId"
            (keyup.enter)="searchById()"
          />
          <button class="btn-search" (click)="searchById()">↵</button>
        </div>
      </div>

      <!-- Ordres Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Projet</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Date</th>
              <th>Machine</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let o of filteredOrdres" class="table-row">
              <td>
                <span class="id-badge">#{{ o.id }}</span>
              </td>
              <td>
                <span class="projet-cell">{{ o.projet }}</span>
              </td>
              <td>
                <span class="produit-ref">Produit #{{ o.produitId }}</span>
              </td>
              <td>
                <span class="qty-cell">{{ o.quantite | number }}</span>
              </td>
              <td>
                <span class="date-cell">{{ o.date | date: 'dd/MM/yyyy' }}</span>
              </td>
              <td>
                <span *ngIf="o.machineId" class="machine-ref">Machine #{{ o.machineId }}</span>
                <span *ngIf="!o.machineId" class="no-machine">—</span>
              </td>
              <td>
                <span class="etat-badge" [class]="'badge-' + getEtatClass(o.etat)">
                  {{ formatEtat(o.etat) }}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <!-- Workflow actions -->
                  <button
                    *ngIf="o.etat === 'En attente'"
                    class="btn-action start"
                    (click)="demarrer(o.id!)"
                  >
                    ▶ Démarrer
                  </button>
                  <button
                    *ngIf="o.etat === 'En cours'"
                    class="btn-action finish"
                    (click)="terminer(o.id!)"
                  >
                    ✓ Terminer
                  </button>
                  <button
                    *ngIf="o.etat === 'En attente' || o.etat === 'En cours'"
                    class="btn-action cancel"
                    (click)="annuler(o.id!)"
                  >
                    ✕ Annuler
                  </button>
                  <button
                    *ngIf="o.etat === 'En attente' || o.etat === 'En cours'"
                    class="btn-action assign"
                    (click)="openAssignMachine(o)"
                  >
                    ⟳ Machine
                  </button>
                  <!-- Edit/Delete -->
                  <!-- <button class="btn-icon edit" (click)="openEdit(o)">✎</button> -->
                  <button
                    *ngIf="o.etat !== 'Terminé' && o.etat !== 'Annulé'"
                    class="btn-icon edit"
                    (click)="openEdit(o)"
                  >
                    ✎
                  </button>
                  <button class="btn-icon del" (click)="delete(o.id!)">✕</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredOrdres.length === 0">
              <td colspan="8" class="empty-row">Aucun ordre trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Add/Edit -->
      <app-modal
        [title]="editingId ? 'Modifier Ordre #' + editingId : 'Nouvel Ordre de Fabrication'"
        [visible]="showModal"
        (close)="closeModal()"
      >
        <form class="form" (ngSubmit)="save()">
          <div class="form-group">
            <label>Projet *</label>
            <input
              class="form-input"
              [(ngModel)]="form.projet"
              name="projet"
              required
              placeholder="Nom du projet"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Produit *</label>
              <select class="form-input" [(ngModel)]="form.produitId" name="produitId" required>
                <option [ngValue]="undefined">-- Sélectionner --</option>
                <option *ngFor="let p of produits" [ngValue]="p.id">
                  {{ p.nom }} (#{{ p.id }})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Quantité *</label>
              <input
                class="form-input"
                type="number"
                [(ngModel)]="form.quantite"
                name="quantite"
                required
                min="1"
              />
            </div>
          </div>
          <!-- <div class="form-row">
            <div class="form-group">
              <label>Date *</label>
              <input class="form-input" type="date" [(ngModel)]="form.date" name="date" required />
            </div>
            <div class="form-group">
              <label>État *</label>
              <select class="form-input" [(ngModel)]="form.etat" name="etat" required>
                <option value="">-- Sélectionner --</option>
                <option value="En attente">En Attente</option>
                <option value="En cours">En Cours</option>
                <option value="Terminé">Terminé</option>
                <option value="Annulé">Annulé</option>
              </select>
            </div>
          </div> -->
          <div class="form-group">
            <label>Machine (optionnel)</label>
            <select class="form-input" [(ngModel)]="form.machineId" name="machineId">
              <option [ngValue]="undefined">-- Aucune --</option>
              <option *ngFor="let m of machines" [ngValue]="m.id">{{ m.nom }} (#{{ m.id }})</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="closeModal()">Annuler</button>
            <button type="submit" class="btn-primary" [disabled]="loading">
              {{ loading ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </app-modal>

      <!-- Modal Assign Machine to Ordre -->
      <app-modal
        title="Assigner Machine à l'Ordre"
        [visible]="showAssignModal"
        (close)="closeAssignModal()"
      >
        <div class="assign-info" *ngIf="assigningOrdre">
          <p>
            Ordre : <strong>#{{ assigningOrdre.id }} — {{ assigningOrdre.projet }}</strong>
          </p>
          <p>
            Machine actuelle :
            <strong *ngIf="assigningOrdre.machineId"
              >Machine #{{ assigningOrdre.machineId }}</strong
            >
            <span *ngIf="!assigningOrdre.machineId" class="no-machine">Aucune</span>
          </p>
        </div>
        <div class="form-group" style="margin-top:16px;">
          <label>Machine</label>
          <select class="form-input" [(ngModel)]="selectedMachineId">
            <option [ngValue]="undefined">-- Sélectionner --</option>
            <option *ngFor="let m of machines" [ngValue]="m.id">
              {{ m.nom }} (#{{ m.id }}) — {{ m.etat }}
            </option>
          </select>
        </div>
        <div class="form-actions" style="margin-top:16px;">
          <button class="btn-cancel" (click)="closeAssignModal()">Annuler</button>
          <button
            class="btn-primary"
            (click)="confirmAssignMachine()"
            [disabled]="!selectedMachineId || loading"
          >
            {{ loading ? 'Assignation...' : 'Confirmer' }}
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

      /* Tabs */
      .filter-tabs {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .tab {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #0d1225;
        border: 1px solid #1e2a45;
        color: #4a6080;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        font-family: 'IBM Plex Sans', sans-serif;
        transition: all 0.2s;
      }

      .tab:hover {
        color: #e8f4ff;
        border-color: #2a4060;
      }
      .tab.active {
        color: #e8f4ff;
        background: #111827;
        border-color: #2a4060;
      }
      .tab.attente.active {
        color: #ffaa00;
        border-color: #ffaa0050;
        background: #1a1000;
      }
      .tab.en-cours.active {
        color: #00d4ff;
        border-color: #00d4ff50;
        background: #001020;
      }
      .tab.termine.active {
        color: #00ff9d;
        border-color: #00ff9d50;
        background: #001a0d;
      }
      .tab.annule.active {
        color: #ff4466;
        border-color: #ff446650;
        background: #1a0005;
      }

      .tab-count {
        background: #0a0e1a;
        border-radius: 10px;
        padding: 1px 7px;
        font-size: 10px;
        font-family: 'IBM Plex Mono', monospace;
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
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-family: 'IBM Plex Sans', sans-serif;
        outline: none;
        width: 110px;
      }

      .btn-search {
        background: #001a2e;
        border: 1px solid #00d4ff30;
        color: #00d4ff;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
      }

      /* Table */
      .table-container {
        background: #0d1225;
        border: 1px solid #1e2a45;
        border-radius: 12px;
        overflow: auto;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 900px;
      }

      .data-table th {
        padding: 12px 14px;
        text-align: left;
        font-size: 10px;
        font-weight: 700;
        color: #2d4060;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        background: #0a0e1a;
        border-bottom: 1px solid #1e2a45;
        white-space: nowrap;
      }

      .table-row {
        border-bottom: 1px solid #111827;
        transition: background 0.15s;
      }

      .table-row:hover {
        background: #111827;
      }

      .data-table td {
        padding: 12px 14px;
        font-size: 13px;
        color: #7090b0;
        white-space: nowrap;
      }

      .id-badge {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        color: #4a6080;
      }

      .projet-cell {
        color: #e8f4ff;
        font-weight: 600;
      }

      .produit-ref,
      .machine-ref {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12px;
        color: #00d4ff;
      }

      .qty-cell {
        font-family: 'IBM Plex Mono', monospace;
        font-weight: 700;
        color: #ffaa00;
      }

      .date-cell {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12px;
      }

      .no-machine {
        color: #2d4060;
      }

      .etat-badge {
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      .badge-en-attente {
        background: #ffaa0015;
        color: #ffaa00;
        border: 1px solid #ffaa0030;
      }
      .badge-en-cours {
        background: #00d4ff15;
        color: #00d4ff;
        border: 1px solid #00d4ff30;
      }
      .badge-termine {
        background: #00ff9d15;
        color: #00ff9d;
        border: 1px solid #00ff9d30;
      }
      .badge-annule {
        background: #ff446615;
        color: #ff4466;
        border: 1px solid #ff446630;
      }

      /* Action buttons */
      .action-btns {
        display: flex;
        gap: 5px;
        align-items: center;
        flex-wrap: wrap;
      }

      .btn-action {
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 600;
        font-family: 'IBM Plex Sans', sans-serif;
        transition: all 0.2s;
        border: 1px solid;
      }

      .btn-action.start {
        background: #001020;
        border-color: #00d4ff30;
        color: #00d4ff;
      }
      .btn-action.finish {
        background: #001a0d;
        border-color: #00ff9d30;
        color: #00ff9d;
      }
      .btn-action.cancel {
        background: #1a0005;
        border-color: #ff446630;
        color: #ff4466;
      }
      .btn-action.assign {
        background: #1a1000;
        border-color: #ffaa0030;
        color: #ffaa00;
      }

      .btn-action:hover {
        filter: brightness(1.3);
      }

      .btn-icon {
        width: 28px;
        height: 28px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .btn-icon.edit {
        background: #1a2a1a;
        border: 1px solid #00ff9d20;
        color: #00ff9d;
      }
      .btn-icon.del {
        background: #1a0005;
        border: 1px solid #ff446620;
        color: #ff4466;
      }
      .btn-icon:hover {
        filter: brightness(1.3);
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
export class OrdresFabricationComponent implements OnInit {
  allOrdres: OrdreFabricationDTO[] = [];
  filteredOrdres: OrdreFabricationDTO[] = [];
  produits: ProduitDTO[] = [];
  machines: MachineDTO[] = [];

  showModal = false;
  showAssignModal = false;
  editingId: number | null = null;
  assigningOrdre: OrdreFabricationDTO | null = null;
  selectedMachineId: number | undefined;
  loading = false;
  activeFilter = '';
  searchId = '';

  form: OrdreFabricationDTO = {
    projet: '',
    produitId: 0,
    quantite: 1,
    date: new Date().toISOString().split('T')[0],
    etat: 'En attente',
  };

  constructor(
    private ordreSvc: OrdreFabricationService,
    private produitSvc: ProduitService,
    private machineSvc: MachineService,
    private notif: NotificationService,
  ) {}

  ngOnInit() {
    this.loadAll();
    this.loadProduits();
    this.loadMachines();
  }

  loadAll() {
    this.ordreSvc.getAll().subscribe({
      next: (data) => {
        this.allOrdres = data.sort((a, b) => b.id! - a.id!);
        this.applyFilter();
      },
      error: () => {
        this.allOrdres = [];
      },
    });
  }

  loadProduits() {
    this.produits = [];
    for (let i = 1; i <= 50; i++) {
      this.produitSvc.getById(i).subscribe({
        next: (p) => {
          if (p && !this.produits.find((prod) => prod.id === p.id)) {
            this.produits = [...this.produits, p].sort((a, b) => a.id! - b.id!);
          }
        },
        error: () => {},
      });
    }
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

  filterAll() {
    this.activeFilter = '';
    this.applyFilter();
  }

  filterByEtat(etat: string) {
    this.activeFilter = etat;
    this.ordreSvc.getByEtat(etat).subscribe({
      next: (data) => {
        this.filteredOrdres = data;
      },
      error: () => {
        this.filteredOrdres = [];
      },
    });
  }

  applyFilter() {
    if (!this.activeFilter) {
      this.filteredOrdres = [...this.allOrdres];
    } else {
      this.filteredOrdres = this.allOrdres.filter((o) => o.etat === this.activeFilter);
    }
  }

  countByEtat(etat: string): number {
    return this.allOrdres.filter((o) => o.etat === etat).length;
  }

  searchById() {
    const id = parseInt(this.searchId);
    if (isNaN(id)) return;
    this.ordreSvc.getById(id).subscribe({
      next: (o) => {
        this.filteredOrdres = [o];
        this.activeFilter = '';
      },
      error: () => {
        this.filteredOrdres = [];
        this.notif.error('Ordre introuvable');
      },
    });
  }

  openAdd() {
    this.editingId = null;
    this.form = {
      projet: '',
      produitId: 0,
      quantite: 1,
      date: new Date().toISOString().split('T')[0],
      etat: 'En attente',
    };
    this.showModal = true;
  }

  openEdit(o: OrdreFabricationDTO) {
    this.editingId = o.id!;
    this.form = { ...o };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
  }

  save() {
    this.loading = true;
    const req = this.editingId
      ? this.ordreSvc.update(this.editingId, this.form)
      : this.ordreSvc.add(this.form);

    req.subscribe({
      next: (result) => {
        if (this.editingId) {
          this.notif.success('Ordre modifié');
        } else {
          this.notif.success('Ordre créé avec succès');
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
    if (!confirm('Supprimer cet ordre de fabrication ?')) return;
    this.ordreSvc.delete(id).subscribe({
      next: () => {
        this.notif.success('Ordre supprimé');
        this.loadAll();
      },
      error: () => this.notif.error('Erreur lors de la suppression'),
    });
  }

  demarrer(id: number) {
    this.ordreSvc.demarrer(id).subscribe({
      next: (updated) => {
        this.notif.success('Ordre démarré');
        this.loadAll();
      },
      error: () => this.notif.error("Impossible de démarrer l'ordre"),
    });
  }

  terminer(id: number) {
    this.ordreSvc.terminer(id).subscribe({
      next: (updated) => {
        this.notif.success('Ordre terminé');
        this.loadAll();
      },
      error: () => this.notif.error("Impossible de terminer l'ordre"),
    });
  }

  annuler(id: number) {
    if (!confirm('Annuler cet ordre ?')) return;
    this.ordreSvc.annuler(id).subscribe({
      next: (updated) => {
        this.notif.success('Ordre annulé');
        this.loadAll();
      },
      error: () => this.notif.error("Impossible d'annuler l'ordre"),
    });
  }

  openAssignMachine(o: OrdreFabricationDTO) {
    this.assigningOrdre = o;
    this.selectedMachineId = o.machineId;
    this.showAssignModal = true;
  }

  closeAssignModal() {
    this.showAssignModal = false;
    this.assigningOrdre = null;
    this.selectedMachineId = undefined;
  }

  confirmAssignMachine() {
    if (!this.assigningOrdre || !this.selectedMachineId) return;
    this.loading = true;
    this.ordreSvc.assignerMachine(this.assigningOrdre.id!, this.selectedMachineId).subscribe({
      next: (updated) => {
        this.notif.success("Machine assignée à l'ordre");
        this.closeAssignModal();
        this.loadAll();
        this.loading = false;
      },
      error: () => {
        this.notif.error("Erreur lors de l'assignation");
        this.loading = false;
      },
    });
  }

  getEtatClass(etat: string): string {
    const map: Record<string, string> = {
      'En attente': 'en-attente',
      'En cours': 'en-cours',
      Terminé: 'termine',
      Annulé: 'annule',
    };
    return map[etat] || 'en-attente';
  }

  formatEtat(etat: string): string {
    return etat;
  }
}
