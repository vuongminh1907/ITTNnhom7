import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousholdMemberListComponent } from './houshold-member-list.component';

describe('HousholdMemberListComponent', () => {
  let component: HousholdMemberListComponent;
  let fixture: ComponentFixture<HousholdMemberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HousholdMemberListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousholdMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
