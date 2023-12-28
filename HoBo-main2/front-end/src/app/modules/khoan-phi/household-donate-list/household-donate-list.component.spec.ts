import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdDonateListComponent } from './household-donate-list.component';

describe('HouseholdDonateListComponent', () => {
  let component: HouseholdDonateListComponent;
  let fixture: ComponentFixture<HouseholdDonateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdDonateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdDonateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
