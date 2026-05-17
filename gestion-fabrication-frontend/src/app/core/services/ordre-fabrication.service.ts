import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdreFabricationDTO } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdreFabricationService {
  private baseUrl = `${environment.apiUrl}/ordre`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<OrdreFabricationDTO[]> {
    return this.http.get<OrdreFabricationDTO[]>(`${this.baseUrl}/get`);
  }

  getById(id: number): Observable<OrdreFabricationDTO> {
    return this.http.get<OrdreFabricationDTO>(`${this.baseUrl}/get/${id}`);
  }

  getByEtat(etat: string): Observable<OrdreFabricationDTO[]> {
    return this.http.get<OrdreFabricationDTO[]>(`${this.baseUrl}/get/etat/${etat}`);
  }

  add(ordre: OrdreFabricationDTO): Observable<OrdreFabricationDTO> {
    return this.http.post<OrdreFabricationDTO>(`${this.baseUrl}/add`, ordre);
  }

  update(id: number, ordre: OrdreFabricationDTO): Observable<OrdreFabricationDTO> {
    return this.http.put<OrdreFabricationDTO>(`${this.baseUrl}/modif/${id}`, ordre);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/supp/${id}`);
  }

  demarrer(id: number): Observable<OrdreFabricationDTO> {
    return this.http.put<OrdreFabricationDTO>(`${this.baseUrl}/demarrer/${id}`, {});
  }

  terminer(id: number): Observable<OrdreFabricationDTO> {
    return this.http.put<OrdreFabricationDTO>(`${this.baseUrl}/terminer/${id}`, {});
  }

  annuler(id: number): Observable<OrdreFabricationDTO> {
    return this.http.put<OrdreFabricationDTO>(`${this.baseUrl}/annuler/${id}`, {});
  }

  assignerMachine(idOrdre: number, idMachine: number): Observable<OrdreFabricationDTO> {
    return this.http.put<OrdreFabricationDTO>(`${this.baseUrl}/assigner/${idOrdre}/${idMachine}`, {});
  }
}
