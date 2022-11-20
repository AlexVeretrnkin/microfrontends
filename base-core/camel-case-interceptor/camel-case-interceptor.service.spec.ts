import { TestBed } from '@angular/core/testing';

import { CamelCaseInterceptorService } from './camel-case-interceptor.service';

describe('CamelCaseInterceptorService', () => {
  let service: CamelCaseInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CamelCaseInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
