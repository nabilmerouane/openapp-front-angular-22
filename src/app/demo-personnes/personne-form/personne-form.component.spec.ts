import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonneFormComponent } from './personne-form.component';

describe('PersonneForm', () => {
  let component: PersonneFormComponent;
  let fixture: ComponentFixture<PersonneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonneFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PersonneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
