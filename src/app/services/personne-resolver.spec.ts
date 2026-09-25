import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { personneResolver } from './personne-resolver';

describe('personneResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => personneResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
