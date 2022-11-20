import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicTableItemComponent } from './basic-table-item.component';

describe('BasicTableItemComponent', () => {
  let component: BasicTableItemComponent;
  let fixture: ComponentFixture<BasicTableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicTableItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
