import { TestBed } from '@angular/core/testing';
import { PersonneService } from './personne-service';

describe('Personne', () => {
  let personneService: PersonneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    personneService = TestBed.inject(PersonneService);
  });

  it('should be created', () => {
    expect(personneService).toBeTruthy();
  });
});
