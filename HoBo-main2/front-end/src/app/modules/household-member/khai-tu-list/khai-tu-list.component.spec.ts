import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhaiTuListComponent } from './khai-tu-list.component';

describe('KhaiTuListComponent', () => {
  let component: KhaiTuListComponent;
  let fixture: ComponentFixture<KhaiTuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhaiTuListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhaiTuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
