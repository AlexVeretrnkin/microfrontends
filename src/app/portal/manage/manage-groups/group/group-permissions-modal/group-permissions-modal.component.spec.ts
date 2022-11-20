import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPermissionsModalComponent } from './group-permissions-modal.component';

describe('GroupPermissionsModalComponent', () => {
  let component: GroupPermissionsModalComponent;
  let fixture: ComponentFixture<GroupPermissionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupPermissionsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPermissionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
