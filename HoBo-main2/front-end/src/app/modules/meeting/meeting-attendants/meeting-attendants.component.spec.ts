import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAttendantsComponent } from './meeting-attendants.component';

describe('MeetingAttendantsComponent', () => {
  let component: MeetingAttendantsComponent;
  let fixture: ComponentFixture<MeetingAttendantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingAttendantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingAttendantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
