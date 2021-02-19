import { Injectable } from '@angular/core';

import { MonteCarlo } from '../..//classes/ai/ai.class.MonteCarlo';
import { State } from '../../classes/ai/ai.class.State';
import { GameBoard } from '../../classes/gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';
import { CoreLogic } from '../../util/core-logic.util';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  
  mcts: MonteCarlo;
  explorationParameter:number;
  currentState:State;
  difficulty:string;

  constructor(gameBoard:GameBoard, player1:Player,player2:Player, difficulty:string) {
    this.explorationParameter = 1.41;
    this.mcts = new MonteCarlo(gameBoard, this.explorationParameter);

    this.currentState = CoreLogic.getStartingState(player1, player2,gameBoard,1);
    
    this.difficulty = difficulty;
  }

  getMove(previousMove:string):string{
    const newState = CoreLogic.nextState(this.currentState, previousMove);

    this.mcts.runSearch(newState, 5);
    const result = this.mcts.calculateBestMove(newState,'max');

    this.currentState = CoreLogic.nextState(newState, result);

    return result;
  }

  randomAIMove(previousMove:string):string{
    const newState = CoreLogic.nextState(this.currentState, previousMove);

    
    const moves = CoreLogic.getLegalMoves(newState);
    const resultIndex = Math.floor(Math.random()*moves.length);
    const result = moves[resultIndex];

    this.currentState = CoreLogic.nextState(newState, result);

    return result;
  }
}




