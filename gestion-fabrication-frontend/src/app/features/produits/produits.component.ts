import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduitService } from '../../core/services/produit.service';
import { ProduitDTO } from '../../core/models/models';
import { NotificationService } from '../../core/services/notification.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">◧ Produits</h1>
          <p class="page-sub">Gestion du catalogue produits et stocks</p>
        </div>
        <button class="btn-primary" (click)="openAdd()">+ Nouveau Produit</button>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <input
          class="search-input"
          placeholder="Rechercher par ID ou nom..."
          [(ngModel)]="searchTerm"
          (keyup.enter)="search()"
        />
        <button class="btn-search" (click)="search()">Rechercher</button>
        <button class="btn-reset" (click)="reset()">Réinitialiser</button>
      </div>

      <!-- Table -->
      <div class="table-container">
        <div class="table-header-row">
          <span class="table-count">{{ produits.length }} produit(s)</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Type</th>
              <th>Stock</th>
              <th>Fournisseur</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of produits" class="table-row">
              <td>
                <span class="id-badge">#{{ p.id }}</span>
              </td>
              <td>
                <span class="name-cell">{{ p.nom }}</span>
              </td>
              <td>
                <span class="type-badge">{{ p.type }}</span>
              </td>
              <td>
                <span class="stock-cell" [class.stock-low]="p.stock < 10">
                  {{ p.stock }}
                </span>
              </td>
              <td>{{ p.fournisseur }}</td>
              <td>
                <div class="action-btns">
                  <button class="btn-edit" (click)="openEdit(p)">✎ Modifier</button>
                  <button class="btn-delete" (click)="delete(p.id!)">✕ Supprimer</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="produits.length === 0">
              <td colspan="6" class="empty-row">Aucun produit trouvé</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Add/Edit -->
      <app-modal
        [title]="editingId ? 'Modifier Produit #' + editingId : 'Nouveau Produit'"
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
              placeholder="Nom du produit"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Type *</label>
              <input
                class="form-input"
                [(ngModel)]="form.type"
                name="type"
                required
                placeholder="Type"
              />
            </div>
            <div class="form-group">
              <label>Stock *</label>
              <input
                class="form-input"
                type="number"
                [(ngModel)]="form.stock"
                name="stock"
                required
                min="0"
              />
            </div>
          </div>
          <div class="form-group">
            <label>Fournisseur *</label>
            <input
              class="form-input"
              [(ngModel)]="form.fournisseur"
              name="fournisseur"
              required
              placeholder="Nom du fournisseur"
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
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

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

      .search-bar {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      }

      .search-input {
        flex: 1;
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

      .btn-search:hover {
        background: #002040;
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
        border-color: #2a4060;
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

      .name-cell {
        color: #e8f4ff;
        font-weight: 500;
      }

      .type-badge {
        background: #00d4ff10;
        border: 1px solid #00d4ff20;
        color: #00d4ff;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
      }

      .stock-cell {
        font-family: 'IBM Plex Mono', monospace;
        font-weight: 600;
        color: #00ff9d;
      }

      .stock-cell.stock-low {
        color: #ff4466;
      }

      .action-btns {
        display: flex;
        gap: 8px;
      }

      .btn-edit {
        background: #1a2a1a;
        border: 1px solid #00ff9d20;
        color: #00ff9d;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-family: 'IBM Plex Sans', sans-serif;
        transition: all 0.2s;
      }

      .btn-edit:hover {
        background: #002000;
        border-color: #00ff9d50;
      }

      .btn-delete {
        background: #1a0005;
        border: 1px solid #ff446620;
        color: #ff4466;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-family: 'IBM Plex Sans', sans-serif;
        transition: all 0.2s;
      }

      .btn-delete:hover {
        background: #200010;
        border-color: #ff446650;
      }

      .empty-row {
        text-align: center;
        color: #2d4060;
        padding: 40px !important;
        font-style: italic;
      }

      /* Form styles */
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
export class ProduitsComponent implements OnInit {
  produits: ProduitDTO[] = [];
  showModal = false;
  editingId: number | null = null;
  loading = false;
  searchTerm = '';

  form: ProduitDTO = { nom: '', type: '', stock: 0, fournisseur: '' };

  constructor(
    private produitSvc: ProduitService,
    private notif: NotificationService,
  ) {}

  ngOnInit() {
    this.reset();
  }

  search() {
    if (!this.searchTerm.trim()) return;
    const id = parseInt(this.searchTerm);
    if (!isNaN(id)) {
      this.produitSvc.getById(id).subscribe({
        next: (p) => {
          this.produits = [p];
        },
        error: () => {
          this.produits = [];
          this.notif.error('Produit introuvable');
        },
      });
    } else {
      this.produitSvc.getByNom(this.searchTerm).subscribe({
        next: (p) => {
          this.produits = [p];
        },
        error: () => {
          this.produits = [];
          this.notif.error('Produit introuvable');
        },
      });
    }
  }

  reset() {
    this.searchTerm = '';
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

  openAdd() {
    this.editingId = null;
    this.form = { nom: '', type: '', stock: 0, fournisseur: '' };
    this.showModal = true;
  }

  openEdit(p: ProduitDTO) {
    this.editingId = p.id!;
    this.form = { ...p };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
  }

  save() {
    this.loading = true;
    if (this.editingId) {
      this.produitSvc.update(this.editingId, this.form).subscribe({
        next: (updated) => {
          this.notif.success('Produit modifié avec succès');
          this.closeModal();
          this.reset();
          this.loading = false;
        },
        error: () => {
          this.notif.error('Erreur lors de la modification');
          this.loading = false;
        },
      });
    } else {
      this.produitSvc.add(this.form).subscribe({
        next: (added) => {
          this.notif.success('Produit ajouté avec succès');
          this.closeModal();
          this.reset();
          this.loading = false;
        },
        error: () => {
          this.notif.error("Erreur lors de l'ajout");
          this.loading = false;
        },
      });
    }
  }

  delete(id: number) {
    if (!confirm('Supprimer ce produit ?')) return;
    this.produitSvc.delete(id).subscribe({
      next: () => {
        this.notif.success('Produit supprimé');
        this.reset();
      },
      error: () => this.notif.error('Erreur lors de la suppression'),
    });
  }
}
