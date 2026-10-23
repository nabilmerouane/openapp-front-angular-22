import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PersonneService } from '../../services/personne-service';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Avatar } from 'primeng/avatar';
import { Skeleton } from 'primeng/skeleton';
import { Message } from 'primeng/message';
import { Divider } from 'primeng/divider';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-personne-detail',
  imports: [RouterLink, AsyncPipe, Card, Tag, Avatar, Skeleton, Message, Divider, ButtonDirective],
  templateUrl: './personne-detail.component.html',
  styleUrl: './personne-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonneDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private personneService = inject(PersonneService);

  readonly state$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) =>
      this.personneService.getPersonne(id).pipe(
        map((personne) => ({ status: 'success' as const, personne })),
        catchError((err: HttpErrorResponse) =>
          of({ status: err.status === 404 ? ('not-found' as const) : ('error' as const) }),
        ),
        startWith({ status: 'loading' as const }),
      ),
    ),
  );
}
