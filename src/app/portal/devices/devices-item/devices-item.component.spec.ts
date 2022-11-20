import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesItemComponent } from './devices-item.component';

describe('DevicesItemComponent', () => {
  let component: DevicesItemComponent;
  let fixture: ComponentFixture<DevicesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicesItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
