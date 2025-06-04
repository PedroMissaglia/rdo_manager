import { TestBed } from '@angular/core/testing';

import { SiengeApiService } from './sienge-api.service';

describe('SiengeApiService', () => {
  let service: SiengeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiengeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
