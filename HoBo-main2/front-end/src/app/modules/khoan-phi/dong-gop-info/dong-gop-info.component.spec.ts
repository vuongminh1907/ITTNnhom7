import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DongGopInfoComponent } from './dong-gop-info.component';

describe('DongGopInfoComponent', () => {
  let component: DongGopInfoComponent;
  let fixture: ComponentFixture<DongGopInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DongGopInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DongGopInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
