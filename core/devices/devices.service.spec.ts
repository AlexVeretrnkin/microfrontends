import { TestBed } from '@angular/core/testing';

import { MetersService } from './meters.service';

describe('DevicesService', () => {
  let service: MetersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
