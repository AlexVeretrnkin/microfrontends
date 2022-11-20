import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBuildingTypesComponent } from './manage-building-types.component';

describe('ManageBuildingTypesComponent', () => {
  let component: ManageBuildingTypesComponent;
  let fixture: ComponentFixture<ManageBuildingTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageBuildingTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBuildingTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
