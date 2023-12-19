import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamVangListComponent } from './tam-vang-list.component';

describe('TamVangListComponent', () => {
  let component: TamVangListComponent;
  let fixture: ComponentFixture<TamVangListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TamVangListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TamVangListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
