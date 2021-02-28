import { Injectable } from '@angular/core';

import { MonteCarlo } from '../..//classes/ai/ai.class.MonteCarlo';
import { State } from '../../classes/ai/ai.class.State';
import { GameBoard } from '../../classes/gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';
import { Owner } from '../../enums/game.enums';
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

  getAIMove(previousMove:string):string{
    //console.log('before first next state');
    this.currentState = CoreLogic.nextState(this.currentState, previousMove);

    const stats = this.mcts.runSearch(this.currentState, 5.95);
    
    console.log(stats);
    const result = this.mcts.calculateBestMove(this.currentState,'max');

    //console.log('Before last next state');
    this.currentState = CoreLogic.nextState(this.currentState, result);

    return result;
  }

  randomAIFirstMove():string{

    const moves = CoreLogic.getLegalMoves(this.currentState);


    const resultIndex = this.weightMoves(moves);
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
   
    const resultIndex = this.weightMoves(moves);

    const result = moves[resultIndex];

    this.currentState = CoreLogic.nextState(this.currentState, result);

    return result;
  }

  weightMoves(moves:string[]):number{
    const weights = Array<string>();

    for(let i = 0; i<moves.length;i++){
      const moveObj = CoreLogic.stringToMove(moves[i]);
      if(moveObj.tradedIn.length > 0){
        weights.push(moves[i]);
      }
      if(moveObj.nodesPlaced.length > 0){
        weights.push(moves[i]);
      }
      if(moveObj.branchesPlaced.length > 0){
        weights.push(moves[i]);
      }

      if(moveObj.nodesPlaced.includes(8)){
        weights.push(moves[i]);
        weights.push(moves[i]);
      }
      if(moveObj.nodesPlaced.includes(9)){
        weights.push(moves[i]);
        weights.push(moves[i]);
      }
      if(moveObj.nodesPlaced.includes(14)){
        weights.push(moves[i]);
        weights.push(moves[i]);
      }
      if(moveObj.nodesPlaced.includes(15)){
        weights.push(moves[i]);
        weights.push(moves[i]);
      }

      if(moveObj.nodesPlaced.includes(3)){
        weights.push(moves[i]);
      }
      if(moveObj.nodesPlaced.includes(4)){
        weights.push(moves[i]);
      }
      if(moveObj.nodesPlaced.includes(10)){
        weights.push(moves[i]);
      }
      if(moveObj.nodesPlaced.includes(16)){
        weights.push(moves[i]);
      }
      if(moveObj.nodesPlaced.includes(20)){
        weights.push(moves[i]);
      }
      if(moveObj.nodesPlaced.includes(19)){
        weights.push(moves[i]);
      }
      if(moveObj.nodesPlaced.includes(13)){
        weights.push(moves[i]);
      }
      if(moveObj.nodesPlaced.includes(7)){
        weights.push(moves[i]);
      }
      
      const currentOwner = this.currentState.currentPlayer === 1 ? Owner.PLAYERONE : Owner.PLAYERTWO;
      const affectedPlayer = this.currentState.currentPlayer === 1 ? CoreLogic.clonePlayer(this.currentState.player1) : CoreLogic.clonePlayer(this.currentState.player2);
      
      for(const branchIndex of moveObj.branchesPlaced){
        const clonedState = State.cloneState(this.currentState);
        clonedState.gameBoard.branches[branchIndex].setOwner(currentOwner);

        for (let i = 0; i < clonedState.gameBoard.tiles.length; i++) {
          clonedState.tilesBeingChecked = [];
          if (CoreLogic.checkForCaptures(clonedState,affectedPlayer, i) === true) {
            weights.push(moves[i]);
          }
        }
      }

      if(moveObj.tradedIn.length === 0 && moveObj.nodesPlaced.length === 0 && moveObj.branchesPlaced.length === 0){
        weights.push(moves[i]);
      }
    }
    console.log(weights.length, weights);
    return moves.indexOf(weights[Math.floor(Math.random()*weights.length)]);
  }

  
}




