import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamVangAddComponent } from './tam-vang-add.component';

describe('TamVangAddComponent', () => {
  let component: TamVangAddComponent;
  let fixture: ComponentFixture<TamVangAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TamVangAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TamVangAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
