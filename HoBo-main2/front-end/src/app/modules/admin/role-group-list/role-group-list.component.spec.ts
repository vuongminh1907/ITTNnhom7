import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleGroupListComponent } from './role-group-list.component';

describe('RoleGroupListComponent', () => {
  let component: RoleGroupListComponent;
  let fixture: ComponentFixture<RoleGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleGroupListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
