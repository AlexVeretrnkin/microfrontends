import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedCheckboxComponent } from './animated-checkbox.component';

describe('AnimatedCheckboxComponent', () => {
  let component: AnimatedCheckboxComponent;
  let fixture: ComponentFixture<AnimatedCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimatedCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatedCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
