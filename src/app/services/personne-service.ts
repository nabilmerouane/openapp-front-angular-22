import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePersonneRequest } from '../models/create-personne-request';
import { PersonneResponse } from '../models/personne-response';
import { UpdatePersonneRequest } from '../models/update-personne-request';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root',
})
export class PersonneService {
  private readonly http = inject(HttpClient);

  getPersonnes(page: number, size: number): Observable<Page<PersonneResponse>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<PersonneResponse>>('/api/personnes', { params });
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

  deletePersonne(id: number): Observable<void> {
    return this.http.delete<void>(`/api/personnes/${id}`);
  }
}
