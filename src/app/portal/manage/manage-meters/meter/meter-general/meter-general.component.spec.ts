import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterGeneralComponent } from './meter-general.component';

describe('MeterGeneralComponent', () => {
  let component: MeterGeneralComponent;
  let fixture: ComponentFixture<MeterGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
