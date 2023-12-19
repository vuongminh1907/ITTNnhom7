import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdBookMemberComponent } from './household-book-member.component';

describe('HouseholdBookMemberComponent', () => {
  let component: HouseholdBookMemberComponent;
  let fixture: ComponentFixture<HouseholdBookMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdBookMemberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdBookMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
