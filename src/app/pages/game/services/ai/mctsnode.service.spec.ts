import { TestBed } from '@angular/core/testing';

import { MCTSNodeService } from './mctsnode.service';

describe('MCTSNodeService', () => {
  let service: MCTSNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MCTSNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
