export interface ProduitDTO {
  id?: number;
  nom: string;
  type: string;
  stock: number;
  fournisseur: string;
}

export interface MachineDTO {
  id?: number;
  nom: string;
  etat: string;
  derniereMaintenance: string;
}

export interface EmployeDTO {
  id?: number;
  nom: string;
  poste: string;
  machineId?: number;
}

export interface OrdreFabricationDTO {
  id?: number;
  projet: string;
  produitId: number;
  quantite: number;
  date: string;
  etat: string;
  machineId?: number;
}

export enum EtatOrdre {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  ANNULE = 'ANNULE',
}

export enum EtatMachine {
  DISPONIBLE = 'DISPONIBLE',
  EN_MARCHE = 'EN_MARCHE',
  EN_MAINTENANCE = 'EN_MAINTENANCE',
  HORS_SERVICE = 'HORS_SERVICE',
}
