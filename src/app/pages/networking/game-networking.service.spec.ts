import { TestBed } from '@angular/core/testing';

import { GameNetworkingService } from './game-networking.service';

describe('GameNetworkingService', () => {
  let service: GameNetworkingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameNetworkingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
