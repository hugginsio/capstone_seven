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
    console.log('before first next state');
    const newState = CoreLogic.nextState(this.currentState, previousMove);

    this.mcts.runSearch(newState, 5);
    const result = this.mcts.calculateBestMove(newState,'max');

    console.log(result);
    console.log('Before last next state');
    this.currentState = CoreLogic.nextState(newState, result);

    return result;
  }

  randomAIFirstMove():string{
    
    //console.log(this.currentState);
    //console.log(newState);

    const moves = CoreLogic.getLegalMoves(this.currentState);
    //console.log(moves);
    //console.log(moves.length);
    const resultIndex = Math.floor(Math.random()*moves.length);
    //console.log(resultIndex);
    const result = moves[resultIndex];
    //console.log(result);

    const newState = CoreLogic.nextState(this.currentState, result);
    this.currentState = newState;//CoreLogic.nextState(this.currentState, result);

    return result;
  }

  randomAIMove(move:string):string{
    //const newState = CoreLogic.nextState(this.currentState, move);
    //console.log(this.currentState);
    //console.log(newState);

    const moves = CoreLogic.getLegalMoves(this.currentState);
    //console.log(moves);
    //console.log(moves.length);
    const resultIndex = Math.floor(Math.random()*moves.length);
    //console.log(resultIndex);
    const result = moves[resultIndex];
    //console.log(result);

    
    this.currentState = CoreLogic.nextState(this.currentState, result);

    return result;
  }
}




