import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyContractsComponent } from './supply-contracts.component';

describe('SupplyContractsComponent', () => {
  let component: SupplyContractsComponent;
  let fixture: ComponentFixture<SupplyContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplyContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
