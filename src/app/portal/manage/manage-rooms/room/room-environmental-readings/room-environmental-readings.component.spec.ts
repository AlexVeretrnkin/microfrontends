import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomEnvironmentalReadingsComponent } from './room-environmental-readings.component';

describe('RoomEnvironmentalReadingsComponent', () => {
  let component: RoomEnvironmentalReadingsComponent;
  let fixture: ComponentFixture<RoomEnvironmentalReadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomEnvironmentalReadingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomEnvironmentalReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
