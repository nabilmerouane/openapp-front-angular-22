import { Routes } from '@angular/router';
import { HomePageComponent } from './home/home-page.component';
import { personneResolver } from './services/personne-resolver';
import { SignalsDemoComponent } from './signals-demo/signals-demo.component';
import { PersonneComponent } from './demo-personnes/personne-component/personne-component';
import { PersonnesListeComponent } from './demo-personnes/personnes-liste/personnes-liste-component';
import { PersonneFormComponent } from './demo-personnes/personne-form/personne-form.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'signals-demo', component: SignalsDemoComponent },
  {
    path: 'personnes',
    component: PersonnesListeComponent,
  },
  {
    path: 'personnes/nouveau',
    component: PersonneFormComponent,
  },
  {
    path: 'personnes/:personneId',
    component: PersonneComponent,
    resolve: {
      personne: personneResolver,
    },
  },
  { path: '**', redirectTo: '' },
];
