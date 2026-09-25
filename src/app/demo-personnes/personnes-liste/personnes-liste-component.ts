import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PersonneService } from '../../services/personne-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-personnes-liste-component',
  imports: [RouterLink],
  templateUrl: './personnes-liste-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './personnes-liste-component.css',
})
export class PersonnesListeComponent {
  private readonly personneService = inject(PersonneService);

  readonly personnes = toSignal(this.personneService.getPersonnes(), { initialValue: [] });
}
