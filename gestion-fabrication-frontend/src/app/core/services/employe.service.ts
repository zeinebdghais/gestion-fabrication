import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeDTO } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeService {
  private baseUrl = `${environment.apiUrl}/employe`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<EmployeDTO> {
    return this.http.get<EmployeDTO>(`${this.baseUrl}/get/${id}`);
  }

  add(employe: EmployeDTO): Observable<EmployeDTO> {
    return this.http.post<EmployeDTO>(`${this.baseUrl}/add`, employe);
  }

  update(id: number, employe: EmployeDTO): Observable<EmployeDTO> {
    return this.http.put<EmployeDTO>(`${this.baseUrl}/modif/${id}`, employe);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/supp/${id}`);
  }

  assignerMachine(idEmploye: number, idMachine: number): Observable<EmployeDTO> {
    return this.http.put<EmployeDTO>(`${this.baseUrl}/assigner/${idEmploye}/${idMachine}`, {});
  }

  getAll(): Observable<EmployeDTO[]> {
    return this.http.get<EmployeDTO[]>(`${this.baseUrl}/get`);
  }
}
