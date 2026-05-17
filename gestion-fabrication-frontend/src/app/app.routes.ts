import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'produits',
    loadComponent: () => import('./features/produits/produits.component').then(m => m.ProduitsComponent)
  },
  {
    path: 'machines',
    loadComponent: () => import('./features/machines/machines.component').then(m => m.MachinesComponent)
  },
  {
    path: 'employes',
    loadComponent: () => import('./features/employes/employes.component').then(m => m.EmployesComponent)
  },
  {
    path: 'ordres',
    loadComponent: () => import('./features/ordres-fabrication/ordres-fabrication.component').then(m => m.OrdresFabricationComponent)
  }
];
