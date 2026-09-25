import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Personne } from '../models/personne';
import { PersonneService } from './personne-service';

export const personneResolver: ResolveFn<Personne> = (route, state): Observable<Personne> => {
  const personneService = inject(PersonneService);
  const personneId = route.params['personneId'];

  console.log('Resolver : personneId =', personneId);
  return personneService.getPersonne(personneId).pipe(
    tap(personne => {
      console.log('➡️ Resolver : personne reçue =', personne);
    })
  );
};
