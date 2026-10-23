import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withXhr()),
    MessageService,
    providePrimeNG({
      theme: { preset: Aura },
      license:
        'eyJpZCI6ImJjYWUxYmM3LWU4ZDUtNDU0MS1iODZlLTMzNjkxN2RlMjA2ZiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTIzOTY5MzUsImV4cCI6MTgyMzkzMjkzNX0.Cofa1R-805yTvxWx_7Cq6b8_wkPv3cK0wm90IUwT8mOHSzIpjmjm7W1r-rPYmEHLnxfksuVtEG4K76W9j7AiDA',
    }),
  ],
};
