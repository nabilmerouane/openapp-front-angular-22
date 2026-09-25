import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneComponent } from './personne-component';
import { ActivatedRoute } from '@angular/router';

describe('PersonneComponent', () => {
  let component: PersonneComponent;
  let fixture: ComponentFixture<PersonneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonneComponent],
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
    }).compileComponents();

    fixture = TestBed.createComponent(PersonneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
