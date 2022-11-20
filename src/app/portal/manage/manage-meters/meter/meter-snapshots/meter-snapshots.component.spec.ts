import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterSnapshotsComponent } from './meter-snapshots.component';

describe('MeterSnapshotsComponent', () => {
  let component: MeterSnapshotsComponent;
  let fixture: ComponentFixture<MeterSnapshotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterSnapshotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterSnapshotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
