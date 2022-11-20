import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorRoomsComponent } from './floor-rooms.component';

describe('FloorRoomsComponent', () => {
  let component: FloorRoomsComponent;
  let fixture: ComponentFixture<FloorRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorRoomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
