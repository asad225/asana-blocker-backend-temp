import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsCredentialsStepperComponent } from './goals-credentials-stepper.component';

describe('GoalsCredentialsStepperComponent', () => {
  let component: GoalsCredentialsStepperComponent;
  let fixture: ComponentFixture<GoalsCredentialsStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoalsCredentialsStepperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalsCredentialsStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
