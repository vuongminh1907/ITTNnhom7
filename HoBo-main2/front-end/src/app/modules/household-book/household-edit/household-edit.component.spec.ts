import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdEditComponent } from './household-edit.component';

describe('HouseholdEditComponent', () => {
  let component: HouseholdEditComponent;
  let fixture: ComponentFixture<HouseholdEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
