import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomGeneralComponent } from './room-general.component';

describe('RoomGeneralComponent', () => {
  let component: RoomGeneralComponent;
  let fixture: ComponentFixture<RoomGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
