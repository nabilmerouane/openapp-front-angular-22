import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, of, throwError } from 'rxjs';
import { Personne } from '../models/personne';
import { PersonneService } from './personne-service';

export const personneResolver: ResolveFn<Personne> = (route) => {
  const personneService = inject(PersonneService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  return personneService.getPersonne(id).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 404) {
        return of(new RedirectCommand(router.parseUrl('/personnes')));
      }
      return throwError(() => err);
    }),
  );
};
