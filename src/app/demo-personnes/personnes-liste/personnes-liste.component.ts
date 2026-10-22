import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { PersonneService } from '../../services/personne-service';
import { PersonneResponse } from '../../models/personne-response';
import { Page } from '../../models/page';

import { Table, TablePageEvent } from 'primeng/table';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { Message } from 'primeng/message';
// import { Badge } from 'primeng/badge';

@Component({
  selector: 'app-personnes-liste',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTableModule,
    Table,
    Card,
    Button,
    ProgressBar,
    Message,
    // Badge,
  ],
  templateUrl: './personnes-liste.component.html',
  styleUrl: './personnes-liste.component.scss',
})
export class PersonnesListeComponent {
  private readonly personneService = inject(PersonneService);

  readonly displayedColumns = ['id', 'prenom', 'nom'];

  readonly page = signal(0);
  readonly size = signal(20);

  private readonly resultat = rxResource({
    params: () => ({ page: this.page(), size: this.size() }),
    stream: ({ params }) => this.personneService.getPersonnes(params.page, params.size),
  });

  // Garde la dernière page reçue pendant le chargement de la suivante
  private readonly derniere = linkedSignal<
    Page<PersonneResponse> | undefined,
    Page<PersonneResponse> | undefined
  >({
    source: () => this.resultat.value(),
    computation: (value, previous) => value ?? previous?.value,
  });

  readonly personnes = computed(() => this.derniere()?.content ?? []);
  readonly total = computed(() => this.derniere()?.totalElements ?? 0);
  readonly chargement = this.resultat.isLoading;
  readonly erreur = this.resultat.error;
  readonly first = computed(() => this.page() * this.size());

  onPage(event: TablePageEvent) {
    this.page.set(event.first / event.rows);
    this.size.set(event.rows);
  }
}
