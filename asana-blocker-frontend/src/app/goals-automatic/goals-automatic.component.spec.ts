import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsAutomaticComponent } from './goals-automatic.component';

describe('GoalsAutomaticComponent', () => {
  let component: GoalsAutomaticComponent;
  let fixture: ComponentFixture<GoalsAutomaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoalsAutomaticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalsAutomaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
