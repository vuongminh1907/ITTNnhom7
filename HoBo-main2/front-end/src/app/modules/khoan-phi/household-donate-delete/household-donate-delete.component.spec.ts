import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdDonateDeleteComponent } from './household-donate-delete.component';

describe('HouseholdDonateAddComponent', () => {
  let component: HouseholdDonateDeleteComponent;
  let fixture: ComponentFixture<HouseholdDonateDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdDonateDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdDonateDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
