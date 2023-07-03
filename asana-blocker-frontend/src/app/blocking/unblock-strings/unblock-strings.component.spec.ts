import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnblockStringsComponent } from './unblock-strings.component';

describe('UnblockStringsComponent', () => {
  let component: UnblockStringsComponent;
  let fixture: ComponentFixture<UnblockStringsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnblockStringsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnblockStringsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
