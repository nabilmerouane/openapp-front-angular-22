import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PersonneService } from '../../services/personne-service';

@Component({
  selector: 'app-personnes-liste-component',
  imports: [],
  templateUrl: './personnes-liste-component.html',
  styleUrl: './personnes-liste-component.css',
})
export class PersonnesListeComponent {
  private readonly personneService = inject(PersonneService);

  readonly personnes = toSignal(this.personneService.getPersonnes(), { initialValue: [] });
}
