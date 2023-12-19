import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DongGopAddComponent } from './dong-gop-add.component';

describe('DongGopAddComponent', () => {
  let component: DongGopAddComponent;
  let fixture: ComponentFixture<DongGopAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DongGopAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DongGopAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
