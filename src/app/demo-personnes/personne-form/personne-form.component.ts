import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { form, required, FormField } from '@angular/forms/signals';

import { PersonneService } from '../../services/personne-service';
import { CreatePersonneRequest } from '../../models/create-personne-request';
import { Personne } from '../../models/personne';

@Component({
  selector: 'app-personne-form',
  templateUrl: './personne-form.component.html',
  imports: [FormField],
})
export class PersonneFormComponent {
  private readonly personneService = inject(PersonneService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

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

    if (this.personneForm().invalid()) {
      return;
    }

    if (this.personne) {
      this.personneService
        .updatePersonne(this.personne.id, this.createPersonne())
        .subscribe((personne) => {
          this.router.navigate(['/personnes', personne.id]);
        });

      return;
    }

    this.personneService.addPersonne(this.createPersonne()).subscribe((personne) => {
      this.router.navigate(['/personnes', personne.id]);
    });
  }
}
