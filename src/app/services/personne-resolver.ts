import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Personne } from '../models/personne';
import { PersonneService } from './personne-service';

export const personneResolver: ResolveFn<Personne> = (route): Observable<Personne> => {
  const personneService = inject(PersonneService);
  // const id = Number(route.params['id']);
  const id = route.params['id'];

  return personneService.getPersonne(id).pipe(
    tap((personne) => {
      console.log('➡️ Resolver : personne reçue =', personne);
    }),
  );
};
