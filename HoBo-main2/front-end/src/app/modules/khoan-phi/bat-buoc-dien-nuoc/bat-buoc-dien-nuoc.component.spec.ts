import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatBuocDienNuocComponent } from './bat-buoc-dien-nuoc.component';

describe('BatBuocDienNuocComponent', () => {
  let component: BatBuocDienNuocComponent;
  let fixture: ComponentFixture<BatBuocDienNuocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatBuocDienNuocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatBuocDienNuocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
