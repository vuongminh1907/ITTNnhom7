import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationInfoComponent } from './evaluation-info.component';

describe('EvaluationInfoComponent', () => {
  let component: EvaluationInfoComponent;
  let fixture: ComponentFixture<EvaluationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
