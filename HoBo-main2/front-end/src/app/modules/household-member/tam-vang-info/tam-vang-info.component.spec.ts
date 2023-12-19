import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamVangInfoComponent } from './tam-vang-info.component';

describe('TamVangInfoComponent', () => {
  let component: TamVangInfoComponent;
  let fixture: ComponentFixture<TamVangInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TamVangInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TamVangInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
