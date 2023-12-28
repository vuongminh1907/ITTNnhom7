import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdDonateAddComponent } from './household-donate-add.component';

describe('HouseholdDonateAddComponent', () => {
  let component: HouseholdDonateAddComponent;
  let fixture: ComponentFixture<HouseholdDonateAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdDonateAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdDonateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
