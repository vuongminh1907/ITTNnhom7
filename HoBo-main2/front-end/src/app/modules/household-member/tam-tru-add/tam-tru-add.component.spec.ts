import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamTruAddComponent } from './tam-tru-add.component';

describe('TamTruAddComponent', () => {
  let component: TamTruAddComponent;
  let fixture: ComponentFixture<TamTruAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TamTruAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TamTruAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
