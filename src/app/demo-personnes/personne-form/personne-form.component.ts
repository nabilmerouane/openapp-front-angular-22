import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, required, FormField } from '@angular/forms/signals';

import { PersonneService } from '../../services/personne-service';
import { CreatePersonneRequest } from '../../models/create-personne-request';

@Component({
  selector: 'app-personne-form',
  templateUrl: './personne-form.component.html',
  imports: [FormField],
})
export class PersonneFormComponent {
  private readonly personneService = inject(PersonneService);
  private readonly router = inject(Router);

  readonly createPersonne = signal<CreatePersonneRequest>({
    nom: '',
    prenom: '',
  });

  readonly personneForm = form(this.createPersonne, (schema) => {
    required(schema.nom);
    required(schema.prenom);
  });

  submit(event: SubmitEvent): void {
    event.preventDefault();

    if (this.personneForm().invalid()) {
      return;
    }

    this.personneService.addPersonne(this.createPersonne()).subscribe((personne) => {
      this.router.navigate(['/personnes', personne.id]);
    });
  }
}
