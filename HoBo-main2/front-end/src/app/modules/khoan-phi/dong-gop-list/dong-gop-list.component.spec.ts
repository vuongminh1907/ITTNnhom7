import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DongGopListComponent } from './dong-gop-list.component';

describe('DongGopListComponent', () => {
  let component: DongGopListComponent;
  let fixture: ComponentFixture<DongGopListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DongGopListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DongGopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
