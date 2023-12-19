import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhaiTuInfoComponent } from './khai-tu-info.component';

describe('KhaiTuInfoComponent', () => {
  let component: KhaiTuInfoComponent;
  let fixture: ComponentFixture<KhaiTuInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhaiTuInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhaiTuInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
