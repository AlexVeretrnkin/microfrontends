import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorGeneralComponent } from './floor-general.component';

describe('FloorGeneralComponent', () => {
  let component: FloorGeneralComponent;
  let fixture: ComponentFixture<FloorGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
