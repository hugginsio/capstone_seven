import { Injectable, InjectionToken } from '@angular/core';

import { MonteCarlo } from '../..//classes/ai/ai.class.MonteCarlo';
import { State } from '../../classes/ai/ai.class.State';
import { GameBoard } from '../../classes/gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';
import { CoreLogic } from '../../util/core-logic.util';

const DIFF_TOKEN = new InjectionToken<string>('MyToken');

@Injectable({
  providedIn: 'root'
})
export class AiService {
  
  mcts: MonteCarlo;
  explorationParameter:number;
  currentState:State;
  // difficulty:string; TODO

  constructor(gameBoard:GameBoard, player1:Player,player2:Player) {
    this.explorationParameter = 1.41;
    this.mcts = new MonteCarlo(gameBoard, this.explorationParameter);

    this.currentState = CoreLogic.getStartingState(player1, player2,gameBoard,1);
  }

  getMove(previousMove:string):string{
    const newState = CoreLogic.nextState(this.currentState, previousMove);

    this.mcts.runSearch(newState, 5);
    const result = this.mcts.calculateBestMove(newState,'max');

    this.currentState = CoreLogic.nextState(newState, result);

    return result;
  }
}




