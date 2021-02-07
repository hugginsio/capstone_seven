import { Injectable } from '@angular/core';

import { MonteCarlo } from '../..//classes/ai/ai.class.MonteCarlo';
import { GameBoard } from '../../classes/gamecore/game.class.GameBoard';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  
  mcts: MonteCarlo;
  explorationParameter:number;

  constructor(gameBoard:GameBoard) {
    this.explorationParameter = 1.41;
    this.mcts = new MonteCarlo(gameBoard, this.explorationParameter);
  }
}




