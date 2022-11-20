import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewerModalComponent } from './map-viewer-modal.component';

describe('MapViewerModalComponent', () => {
  let component: MapViewerModalComponent;
  let fixture: ComponentFixture<MapViewerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapViewerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
