import { TestBed } from '@angular/core/testing';

import { PositronStompService } from './positron-stomp.service';

describe('PositronStompService', () => {
  let service: PositronStompService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PositronStompService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
