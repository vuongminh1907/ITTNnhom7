import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdDonateInfoComponent } from './household-donate-info.component';

describe('HouseholdDonateInfoComponent', () => {
  let component: HouseholdDonateInfoComponent;
  let fixture: ComponentFixture<HouseholdDonateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdDonateInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdDonateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
