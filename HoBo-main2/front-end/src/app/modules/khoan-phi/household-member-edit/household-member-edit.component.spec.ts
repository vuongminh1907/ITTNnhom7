import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdMemberEditComponent } from './household-member-edit.component';

describe('HouseholdMemberEditComponent', () => {
  let component: HouseholdMemberEditComponent;
  let fixture: ComponentFixture<HouseholdMemberEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdMemberEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdMemberEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
