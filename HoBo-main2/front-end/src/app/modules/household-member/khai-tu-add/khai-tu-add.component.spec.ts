import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhaiTuAddComponent } from './khai-tu-add.component';

describe('KhaiTuAddComponent', () => {
  let component: KhaiTuAddComponent;
  let fixture: ComponentFixture<KhaiTuAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhaiTuAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhaiTuAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
