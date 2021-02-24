import { TestBed } from '@angular/core/testing';
import { Branch } from '../../classes/gamecore/game.class.Branch';
import { GameBoard } from '../../classes/gamecore/game.class.GameBoard';

// import { AiService } from './ai.service';

describe('AiService', () => {
  // let service: AiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ GameBoard, Branch ]
    });
    // service = TestBed.inject(AiService);
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
});
