import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSubordinatesComponent } from './group-subordinates.component';

describe('GroupSubordinatesComponent', () => {
  let component: GroupSubordinatesComponent;
  let fixture: ComponentFixture<GroupSubordinatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupSubordinatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSubordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
