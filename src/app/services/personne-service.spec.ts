import { TestBed } from '@angular/core/testing';

import { Personne } from './personne';

describe('Personne', () => {
  let service: Personne;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Personne);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
