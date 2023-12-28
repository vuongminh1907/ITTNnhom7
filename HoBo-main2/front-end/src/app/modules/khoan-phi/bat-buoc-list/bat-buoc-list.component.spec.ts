import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatBuocListComponent } from './bat-buoc-list.component';

describe('BatBuocListComponent', () => {
  let component: BatBuocListComponent;
  let fixture: ComponentFixture<BatBuocListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatBuocListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatBuocListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
