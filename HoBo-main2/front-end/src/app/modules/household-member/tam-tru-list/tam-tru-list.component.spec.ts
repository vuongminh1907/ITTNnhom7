import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamTruListComponent } from './tam-tru-list.component';

describe('TamTruListComponent', () => {
  let component: TamTruListComponent;
  let fixture: ComponentFixture<TamTruListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TamTruListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TamTruListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
