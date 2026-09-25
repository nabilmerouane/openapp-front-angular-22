import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Personne } from '../../models/personne';

@Component({
  selector: 'app-personne-component',
  imports: [],
  providers: [
    {
      provide: ActivatedRoute,
      useValue: {
        snapshot: {
          data: { personne: { id: 1, nom: 'Doe', prenom: 'John' } },
        },
      },
    },
  ],
  templateUrl: './personne-component.html',
  styleUrl: './personne-component.css',
})
export class PersonneComponent {
  private readonly route = inject(ActivatedRoute);

  readonly personne = this.route.snapshot.data['personne'] as Personne;
}
