import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnesListeComponent } from '../personnes-liste/personnes-liste-component';

describe('PersonnesComponent', () => {
  let component: PersonnesListeComponent;
  let fixture: ComponentFixture<PersonnesListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnesListeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonnesListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
