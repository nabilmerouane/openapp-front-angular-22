import { TestBed } from '@angular/core/testing';

import { personneResolver } from './personne-resolver';

describe('personneResolverResolver', () => {
  const executeResolver = (...resolverParameters: Parameters<typeof personneResolver>) =>
      TestBed.runInInjectionContext(() => personneResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
