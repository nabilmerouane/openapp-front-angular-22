import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePersonneRequest } from '../models/create-personne-request';
import { PersonneResponse } from '../models/personne-response';
import { UpdatePersonneRequest } from '../models/update-personne-request';

@Injectable({
  providedIn: 'root',
})
export class PersonneService {
  private readonly http = inject(HttpClient);

  getPersonnes(): Observable<PersonneResponse[]> {
    return this.http.get<PersonneResponse[]>('/api/personnes');
  }

  getPersonne(id: number): Observable<PersonneResponse> {
    return this.http.get<PersonneResponse>(`/api/personnes/${id}`);
  }

  addPersonne(request: CreatePersonneRequest): Observable<PersonneResponse> {
    return this.http.post<PersonneResponse>('/api/personnes', request);
  }

  updatePersonne(id: number, request: UpdatePersonneRequest): Observable<PersonneResponse> {
    return this.http.put<PersonneResponse>(`/api/personnes/${id}`, request);
  }
}
