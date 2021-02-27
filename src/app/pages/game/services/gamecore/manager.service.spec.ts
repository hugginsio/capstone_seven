import { TestBed } from '@angular/core/testing';

import { ManagerService } from './manager.service';

describe('ManagerService', () => {
  let service: ManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  fit('serializeStack should translate the stack into a string', () => {
    const expectedString = 'R,G,B,Y;1,2,3;4,5,6';
    service.tradedResources = ['R', 'G', 'B'];
    service.selectedTrade = 'Y';
    service.stack = [
      ['N', 1],
      ['N', 2],
      ['N', 3],
      ['B', 4],
      ['B', 5],
      ['B', 6],
    ];

    service.getCurrentPlayer().hasTraded = true;
    const stackString = service.serializeStack();
    expect(stackString).toEqual(expectedString);
  });
});
