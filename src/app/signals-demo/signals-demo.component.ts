import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-signals-demo',
  standalone: true,
  templateUrl: './signals-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './signals-demo.component.css'
})
export class SignalsDemoComponent {
  readonly count = signal(0);
  readonly name = signal('Angular');
  readonly doubledCount = computed(() => this.count() * 2);
  readonly greeting = computed(() => `Bonjour ${this.name()} !`);

  increment(): void {
    this.count.update((value) => value + 1);
  }

  decrement(): void {
    this.count.update((value) => value - 1);
  }

  reset(): void {
    this.count.set(0);
  }

  updateName(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.name.set(input.value);
  }
}
