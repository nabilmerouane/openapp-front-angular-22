import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Page } from '../../models/page';
import { PersonneResponse } from '../../models/personne-response';
import { PersonneService } from '../../services/personne-service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { ProgressBar } from 'primeng/progressbar';
import { Table, TablePageEvent } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HttpErrorResponse } from '@angular/common/http';

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
    ButtonModule,
    ProgressBar,
    Message,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './personnes-liste.component.html',
  styleUrl: './personnes-liste.component.scss',
})
export class PersonnesListeComponent {
  private readonly personneService = inject(PersonneService);
  private confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

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

  confirmerSuppression(personne: PersonneResponse): void {
    this.confirmationService.confirm({
      header: 'Confirmer la suppression',
      message: `Voulez-vous vraiment supprimer ${personne.prenom} ${personne.nom} ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => {
        this.personneService.deletePersonne(personne.id).subscribe({
          next: () => {
            const derniereLigneDeLaPage = this.personnes().length === 1;
            this.messageService.add({
              severity: 'success',
              summary: 'Personne supprimée',
              detail: `${personne.prenom} ${personne.nom} a bien été supprimé(e).`,
              life: 3000,
            });
            // Cas particulier : supprimer la dernière ligne d’une page qui contient un élément sur la page précédente. Dans ce cas, on revient à la page précédente.
            if (derniereLigneDeLaPage && this.page() > 0) {
              this.page.update((p) => p - 1); // la modification du signal relance la ressource toute seule
            } else {
              this.resultat.reload();
            }
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 404) {
              this.resultat.reload();
            }
            this.messageService.add({
              severity: 'error',
              summary: 'Échec de la suppression',
              detail: err.error?.detail ?? 'Une erreur est survenue. Réessayez plus tard.',
            });
          },
        });
      },
    });
  }
}
