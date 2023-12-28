import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatBuocAddComponent } from './bat-buoc-add.component';

describe('BatBuocAddComponent', () => {
  let component: BatBuocAddComponent;
  let fixture: ComponentFixture<BatBuocAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatBuocAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatBuocAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
