import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingOwnerComponent } from './meeting-owner.component';

describe('MeetingOwnerComponent', () => {
  let component: MeetingOwnerComponent;
  let fixture: ComponentFixture<MeetingOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingOwnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
