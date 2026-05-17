import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProduitDTO } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private baseUrl = `${environment.apiUrl}/produit`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<ProduitDTO> {
    return this.http.get<ProduitDTO>(`${this.baseUrl}/get/${id}`);
  }

  getByNom(nom: string): Observable<ProduitDTO> {
    return this.http.get<ProduitDTO>(`${this.baseUrl}/get/nom/${nom}`);
  }

  add(produit: ProduitDTO): Observable<ProduitDTO> {
    return this.http.post<ProduitDTO>(`${this.baseUrl}/add`, produit);
  }

  update(id: number, produit: ProduitDTO): Observable<ProduitDTO> {
    return this.http.put<ProduitDTO>(`${this.baseUrl}/modif/${id}`, produit);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/supp/${id}`);
  }
}
