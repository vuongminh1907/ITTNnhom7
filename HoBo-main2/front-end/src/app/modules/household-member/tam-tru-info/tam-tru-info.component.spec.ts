import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamTruInfoComponent } from './tam-tru-info.component';

describe('TamTruInfoComponent', () => {
  let component: TamTruInfoComponent;
  let fixture: ComponentFixture<TamTruInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TamTruInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TamTruInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
