import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneDetailComponent } from './personne-detail.component';
import { ActivatedRoute } from '@angular/router';

describe('PersonneDetailComponent', () => {
  let component: PersonneDetailComponent;
  let fixture: ComponentFixture<PersonneDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonneDetailComponent],
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

    fixture = TestBed.createComponent(PersonneDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
