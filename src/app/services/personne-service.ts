import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personne } from '../models/personne';
import { CreatePersonneRequest } from '../models/create-personne-request';

@Injectable({
  providedIn: 'root',
})
export class PersonneService {
  private readonly http = inject(HttpClient);

  getPersonnes(): Observable<Personne[]> {
    return this.http.get<Personne[]>('/api/personnes');
  }

  getPersonne(personneId: number): Observable<Personne> {
    return this.http.get<Personne>(`/api/personnes/${personneId}`);
  }

  addPersonne(request: CreatePersonneRequest): Observable<Personne> {
    return this.http.post<Personne>('/api/personnes', request);
  }
}
