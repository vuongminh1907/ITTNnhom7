import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdSplitComponent } from './household-split.component';

describe('HouseholdSplitComponent', () => {
  let component: HouseholdSplitComponent;
  let fixture: ComponentFixture<HouseholdSplitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdSplitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
