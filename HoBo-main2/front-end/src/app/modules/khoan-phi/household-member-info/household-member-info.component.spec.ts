import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdMemberInfoComponent } from './household-member-info.component';

describe('HouseholdMemberInfoComponent', () => {
  let component: HouseholdMemberInfoComponent;
  let fixture: ComponentFixture<HouseholdMemberInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdMemberInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdMemberInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
