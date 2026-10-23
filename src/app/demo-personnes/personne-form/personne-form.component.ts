import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, required, FormField } from '@angular/forms/signals';

import { PersonneService } from '../../services/personne-service';
import { CreatePersonneRequest } from '../../models/create-personne-request';
import { Personne } from '../../models/personne';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';
import { InputText } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/internal/operators/finalize';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonDirective, ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-personne-form',
  templateUrl: './personne-form.component.html',
  imports: [RouterLink, FormField, Card, InputText, Avatar, ButtonDirective, ButtonModule],
})
export class PersonneFormComponent {
  private readonly personneService = inject(PersonneService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);
  protected readonly saving = signal(false);

  readonly personne = this.route.snapshot.data['personne'] as Personne | undefined;

  readonly createPersonne = signal<CreatePersonneRequest>({
    nom: this.personne?.nom ?? '',
    prenom: this.personne?.prenom ?? '',
  });

  readonly personneForm = form(this.createPersonne, (schema) => {
    required(schema.nom);
    required(schema.prenom);
  });

  submit(event: SubmitEvent): void {
    event.preventDefault();

    if (this.personneForm().invalid() || this.saving()) {
      return;
    }

    const request$ = this.personne
      ? this.personneService.updatePersonne(this.personne.id, this.createPersonne())
      : this.personneService.addPersonne(this.createPersonne());

    this.saving.set(true);

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (personne) => {
        this.messageService.add({
          severity: 'success',
          summary: this.personne ? 'Personne modifiée' : 'Personne créée',
          detail: `${personne.prenom} ${personne.nom} a bien été enregistré(e).`,
          life: 3000,
        });
        this.router.navigate(['/personnes', personne.id]);
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: "Échec de l'enregistrement",
          detail: err.error?.detail ?? 'Une erreur est survenue. Réessayez plus tard.',
        });
      },
    });
  }
}
