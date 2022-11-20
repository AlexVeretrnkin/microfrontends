import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedInputModalComponent } from './extended-input-modal.component';

describe('ExtedndedInputModalComponent', () => {
  let component: ExtendedInputModalComponent;
  let fixture: ComponentFixture<ExtendedInputModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedInputModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
