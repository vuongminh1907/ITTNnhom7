import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatBuocAddMoneyComponent } from './bat-buoc-add-money.component';

describe('BatBuocAddComponent', () => {
  let component: BatBuocAddMoneyComponent;
  let fixture: ComponentFixture<BatBuocAddMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatBuocAddMoneyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatBuocAddMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
