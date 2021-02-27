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

  it('serializeStack should translate the stack into a string', () => {
    const expectedString = 'R,G,B,Y;1,2,3;1,2,3';
    service.stack = [
      ['T', 'R'],
      ['T', 'G'],
      ['T', 'B'],
      ['T', 'Y'],
      ['N', 1],
      ['N', 2],
      ['N', 3],
      ['B', 1],
      ['B', 2],
      ['B', 3],
    ]

    service.getCurrentPlayer().hasTraded = true;
    const stackString = service.serializeStack();
    expect(stackString).toEqual(expectedString);
  });
});
