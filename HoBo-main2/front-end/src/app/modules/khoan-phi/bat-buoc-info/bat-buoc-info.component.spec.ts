import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatBuocInfoComponent } from './bat-buoc-info.component';

describe('BatBuocInfoComponent', () => {
  let component: BatBuocInfoComponent;
  let fixture: ComponentFixture<BatBuocInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatBuocInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatBuocInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
