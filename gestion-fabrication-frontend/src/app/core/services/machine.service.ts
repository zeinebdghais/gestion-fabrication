import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MachineDTO } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MachineService {
  private baseUrl = `${environment.apiUrl}/machine`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<MachineDTO> {
    return this.http.get<MachineDTO>(`${this.baseUrl}/get/${id}`);
  }

  getByEtat(etat: string): Observable<MachineDTO[]> {
    return this.http.get<MachineDTO[]>(`${this.baseUrl}/get/etat/${etat}`);
  }

  add(machine: MachineDTO): Observable<MachineDTO> {
    return this.http.post<MachineDTO>(`${this.baseUrl}/add`, machine);
  }

  update(id: number, machine: MachineDTO): Observable<MachineDTO> {
    return this.http.put<MachineDTO>(`${this.baseUrl}/modif/${id}`, machine);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/supp/${id}`);
  }

  declencherMaintenance(id: number): Observable<MachineDTO> {
    return this.http.put<MachineDTO>(`${this.baseUrl}/maintenance/${id}`, {});
  }
}
