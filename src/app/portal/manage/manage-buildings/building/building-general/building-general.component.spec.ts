import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingGeneralComponent } from './building-general.component';

describe('BuildingGeneralComponent', () => {
  let component: BuildingGeneralComponent;
  let fixture: ComponentFixture<BuildingGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
