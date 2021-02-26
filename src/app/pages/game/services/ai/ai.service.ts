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
  
  constructor(gameBoard:GameBoard, player1:Player,player2:Player) {
    this.explorationParameter = 1.41;
    this.mcts = new MonteCarlo(gameBoard, this.explorationParameter);

    this.currentState = CoreLogic.getStartingState(player1, player2,gameBoard,1);
    
    this.difficulty = 'easy';
  }

  getAIFirstMove():string{

    const result = this.mcts.selectMove(this.currentState);

    

    this.currentState = CoreLogic.nextState(this.currentState, result);

    return result;
  }

  getAIMove(previousMove:string):string{
    //console.log('before first next state');
    this.currentState = CoreLogic.nextState(this.currentState, previousMove);

    const result = this.mcts.selectMove(this.currentState);

    //console.log('Before last next state');
    this.currentState = CoreLogic.nextState(this.currentState, result);

    return result;
  }

  randomAIFirstMove():string{

    const moves = CoreLogic.getLegalMoves(this.currentState);

    const moveWins = Array(moves.length).fill(0);

    const end = Date.now() + 5.5 * 1000;

    while (Date.now() < end){
      let weHaveAWinner = false;
      let playState = new State(this.currentState.moveHistory,CoreLogic.cloneGameBoard(this.currentState.gameBoard),this.currentState.currentPlayer,this.currentState.player1, this.currentState.player2,this.currentState.inInitialMoves);
      let newMoves = CoreLogic.getLegalMoves(playState);
      let chosenMoveIndex =  Math.floor(Math.random()*moves.length);
      const originalMoveIndex = chosenMoveIndex;
      while(!weHaveAWinner){
        
       
        
        const chosenMove = newMoves[chosenMoveIndex];
        playState = CoreLogic.nextState(playState,chosenMove);
        const winner = CoreLogic.determineIfWinner(this.currentState);
        newMoves = CoreLogic.getLegalMoves(playState);
        chosenMoveIndex =  Math.floor(Math.random()*newMoves.length);

        //console.log(`current winner state ${winner}`);

        if(winner === 1){
          //console.log('Player 1 Wins!');
          weHaveAWinner = true;
          moveWins[originalMoveIndex]++;
        }
        else if(winner === -1){
          //console.log('Player 2 Wins!');
          weHaveAWinner = true;
        }

      }
    }

    const resultIndex = Math.max(...moveWins);
 
    const result = moves[resultIndex];


    const newState = CoreLogic.nextState(this.currentState, result);
    this.currentState = newState;

    return result;
  }

  randomAIMove(move:string):string{
    this.currentState = CoreLogic.nextState(this.currentState, move);

    const moves = CoreLogic.getLegalMoves(this.currentState);

    const resultIndex = Math.floor(Math.random()*moves.length);

    const result = moves[resultIndex];

    this.currentState = CoreLogic.nextState(this.currentState, result);

    return result;
  }
}




