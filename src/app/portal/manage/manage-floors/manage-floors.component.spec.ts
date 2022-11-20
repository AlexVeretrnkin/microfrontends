import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFloorsComponent } from './manage-floors.component';

describe('ManageFloorsComponent', () => {
  let component: ManageFloorsComponent;
  let fixture: ComponentFixture<ManageFloorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageFloorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFloorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
