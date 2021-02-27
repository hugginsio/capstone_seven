import { Injectable } from '@angular/core';

import { MonteCarlo } from '../..//classes/ai/ai.class.MonteCarlo';
import { State } from '../../classes/ai/ai.class.State';
import { GameBoard } from '../../classes/gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';
import { CoreLogic } from '../../util/core-logic.util';

// @Injectable({
//   providedIn: 'root'
// })

interface Resources{
  red:number,
  blue:number,
  green:number,
  yellow:number,
}
export class AiService {
  
  mcts: MonteCarlo;
  explorationParameter:number;
  currentState:State;
  difficulty:string;
  
  constructor(gameBoard:GameBoard, player1:Player,player2:Player) {
    this.explorationParameter = 1.41;
    this.mcts = new MonteCarlo(gameBoard, this.explorationParameter);

    this.currentState = CoreLogic.getStartingState(player1, player2,gameBoard,1);
    
    this.difficulty = 'easy';
  }

  getAIFirstMove():string{

    const stats = this.mcts.runSearch(this.currentState, 5.95);

    //console.log(this.currentState);
    
    console.log(stats);
    const result = this.mcts.calculateBestMove(this.currentState,'max');

    

    this.currentState = CoreLogic.nextState(this.currentState, result);

    return result;
  }

  getAIMove(previousMove:string,resources:Resources):string{
    //console.log('before first next state');
    this.currentState = CoreLogic.nextState(this.currentState, previousMove);

    if(!this.currentState.inInitialMoves){
      if(this.currentState.currentPlayer === 1){
        this.currentState.player1.redResources = resources.red;
        this.currentState.player1.blueResources = resources.blue;

        this.currentState.player1.greenResources = resources.green;
        this.currentState.player1.yellowResources = resources.yellow;

      }
      else{
        this.currentState.player2.redResources = resources.red;
        this.currentState.player2.blueResources = resources.blue;

        this.currentState.player2.greenResources = resources.green;
        this.currentState.player2.yellowResources = resources.yellow;

      }
    }

    const stats = this.mcts.runSearch(this.currentState, 5.95);
    
    console.log(stats);
    const result = this.mcts.calculateBestMove(this.currentState,'max');

    //console.log('Before last next state');
    this.currentState = CoreLogic.nextState(this.currentState, result);

    return result;
  }

  randomAIFirstMove():string{

    const moves = CoreLogic.getLegalMoves(this.currentState);
 
    const resultIndex = Math.floor(Math.random()*moves.length);
    const result = moves[resultIndex];


    const newState = CoreLogic.nextState(this.currentState, result);
    this.currentState = newState;

    return result;
  }

  randomAIMove(move:string,resources:Resources):string{
    this.currentState = CoreLogic.nextState(this.currentState, move);
    
    if(!this.currentState.inInitialMoves){
      if(this.currentState.currentPlayer === 1){
        this.currentState.player1.redResources = resources.red;
        this.currentState.player1.blueResources = resources.blue;

        this.currentState.player1.greenResources = resources.green;
        this.currentState.player1.yellowResources = resources.yellow;

      }
      else{
        this.currentState.player2.redResources = resources.red;
        this.currentState.player2.blueResources = resources.blue;

        this.currentState.player2.greenResources = resources.green;
        this.currentState.player2.yellowResources = resources.yellow;

      }
    }

    const moves = CoreLogic.getLegalMoves(this.currentState);

    const resultIndex = Math.floor(Math.random()*moves.length);

    const result = moves[resultIndex];

    this.currentState = CoreLogic.nextState(this.currentState, result);

    return result;
  }
}




