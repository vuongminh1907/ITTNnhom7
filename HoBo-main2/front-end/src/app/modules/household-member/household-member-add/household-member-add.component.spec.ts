import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdMemberAddComponent } from './household-member-add.component';

describe('HouseholdMemberAddComponent', () => {
  let component: HouseholdMemberAddComponent;
  let fixture: ComponentFixture<HouseholdMemberAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdMemberAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdMemberAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
