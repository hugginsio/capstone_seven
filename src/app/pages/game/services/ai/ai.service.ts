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
  
  constructor(gameBoard:GameBoard, player1:Player,player2:Player) {
    this.mcts = new MonteCarlo(gameBoard, player1, player2); 
  }

  getAIMove(gameboard:GameBoard,player1:Player,player2:Player,previousPlayerNo:number):string{
    const newState = new State(gameboard,player1, player2);
    newState.playerNumber = previousPlayerNo;

    const result = this.mcts.findNextMove(newState,5000);
    return result;
  }

  player2InitialMoveSpecialCase(previousMove:string,playerNo:number):void{

    this.mcts.opponent = 3 - playerNo;

    const rootNode = this.mcts.tree.getRoot();
    const rootState = rootNode.getState();

    if(rootState.move !== previousMove){
      if(rootNode.getChildArray().length > 0){
        for(let i = 0; i < rootNode.getChildArray.length; i++){
          const childNode = rootNode.getChildArray()[i];
          const childState = rootNode.getChildArray()[i].getState();
          if(childState.move === previousMove){
            i = rootNode.getChildArray().length;
            this.mcts.tree.setRoot(childNode);
          }
        }
      }
      else if(rootNode.getState().player1.numNodesPlaced >= 1 && rootNode.getState().player2.numNodesPlaced >= 2){
        rootNode.getState().setPlayerNo(this.mcts.opponent);
        rootNode.getState().applyMove(previousMove);
        rootNode.getState().setPlayerNo(playerNo);

      }
      else if(rootNode.getChildArray().length === 0 || rootState.move === ''){
        //rootNode.getState().setPlayerNo(this.opponent);
        rootNode.getState().applyMove(previousMove); 
      }

    }
  }

  // randomAIFirstMove():string{

  //   const moves = CoreLogic.getLegalMoves(this.currentState);


    
  //   const resultIndex = this.weightMoves(moves);
  //   let result = moves[resultIndex];


  //   if(result === undefined){
  //     result = ';;';
  //   }

  //   const newState = CoreLogic.nextState(this.currentState, result);
  //   this.currentState = newState;

  //   return result;
  // }

  // randomAIMove(move:string,resources:Resources):string{
  //   this.currentState = CoreLogic.nextState(this.currentState, move);
    
  //   if(!this.currentState.inInitialMoves){
  //     if(this.currentState.currentPlayer === 1){
  //       this.currentState.player1.redResources = resources.red;
  //       this.currentState.player1.blueResources = resources.blue;

  //       this.currentState.player1.greenResources = resources.green;
  //       this.currentState.player1.yellowResources = resources.yellow;

  //     }
  //     else{
  //       this.currentState.player2.redResources = resources.red;
  //       this.currentState.player2.blueResources = resources.blue;

  //       this.currentState.player2.greenResources = resources.green;
  //       this.currentState.player2.yellowResources = resources.yellow;

  //     }
  //   }

  //   const moves = CoreLogic.getLegalMoves(this.currentState);
   
  //   const resultIndex = this.weightMoves(moves);

  //   let result = moves[resultIndex];

  //   if(result === undefined){
  //     result = ';;';
  //   }

  //   this.currentState = CoreLogic.nextState(this.currentState, result);

  //   return result;
  // }

  // weightMoves(moves:string[]):number{
  //   const weights = Array<string>();
  //   const currentPlayer = this.currentState.currentPlayer === 1 ? this.currentState.player1 : this.currentState.player2;

  //   for(let i = 0; i<moves.length;i++){
  //     const moveObj = CoreLogic.stringToMove(moves[i]);
  //     const red = currentPlayer.redResources;
  //     const blue = currentPlayer.blueResources;
  //     const green = currentPlayer.greenResources;
  //     const yellow = currentPlayer.yellowResources;

  //     let numRedTraded = 0;
  //     let numBlueTraded = 0;
  //     let numGreenTraded = 0;
  //     let numYellowTraded = 0;

  //     if(moveObj.tradedIn.length > 0){
  //       for(const resource of moveObj.tradedIn){
  //         switch(resource){
  //           case 'R':
  //             numRedTraded++;
  //             break;
  //           case 'B':
  //             numBlueTraded++;
  //             break;
  //           case 'G':
  //             numGreenTraded++;
  //             break;
  //           case 'Y':
  //             numYellowTraded++;
  //             break;
  //         }
  //       }

  //       if(moveObj.received === 'R'){
  //         if((blue - numBlueTraded) >=1){
  //           weights.push(moves[i]);
  //           if(moveObj.branchesPlaced.length > 0){
  //             weights.push(moves[i]);
  //           }
  //         }
  //       }
  //       if(moveObj.received === 'B'){
  //         if((red - numRedTraded) >=1){
  //           weights.push(moves[i]);
  //           if(moveObj.branchesPlaced.length > 0){
  //             weights.push(moves[i]);
  //           }
  //         }
  //       }
  //       if(moveObj.received === 'G'){
  //         if((green - numGreenTraded) >=2){
  //           weights.push(moves[i]);
  //           if(moveObj.nodesPlaced.length > 0){
  //             weights.push(moves[i]);
  //           }
  //         }
  //       }
  //       if(moveObj.received === 'Y'){
  //         if((yellow - numYellowTraded) >=2){
  //           weights.push(moves[i]);
  //           if(moveObj.nodesPlaced.length > 0){
  //             weights.push(moves[i]);
  //           }
  //         }
  //       }
  //     }
  //     else{
  //       weights.push(moves[i]);
  //     }


  //     const cornerNodes = [2,0,1,5,6,12,11,17,18,21,22,23];
  //     if(moveObj.nodesPlaced.length > 0){
        
  //       for(const nodeIndex of moveObj.nodesPlaced){
         
  //         if(this.currentState.gameBoard.nodes[nodeIndex].getTopRightTile() !== -1 && this.currentState.gameBoard.tiles[this.currentState.gameBoard.nodes[nodeIndex].getTopRightTile()].getMaxNodes() === 3){
  //           weights.push(moves[i]);
  //           weights.push(moves[i]);  
  //           weights.push(moves[i]);        
  //         }
  //         else if(this.currentState.gameBoard.nodes[nodeIndex].getTopRightTile() !== -1 && this.currentState.gameBoard.tiles[this.currentState.gameBoard.nodes[nodeIndex].getTopRightTile()].getMaxNodes() === 2){ 
  //           weights.push(moves[i]);
  //           weights.push(moves[i]);
  //         }
  //         else if(this.currentState.gameBoard.nodes[nodeIndex].getTopRightTile() !== -1 && this.currentState.gameBoard.tiles[this.currentState.gameBoard.nodes[nodeIndex].getTopRightTile()].getMaxNodes() === 1){ 
  //           weights.push(moves[i]);
  //         }

  //         if(this.currentState.gameBoard.nodes[nodeIndex].getBottomRightTile() !== -1 && this.currentState.gameBoard.tiles[this.currentState.gameBoard.nodes[nodeIndex].getBottomRightTile()].getMaxNodes() === 3){
  //           weights.push(moves[i]);
  //           weights.push(moves[i]);  
  //           weights.push(moves[i]);        
  //         }
  //         else if(this.currentState.gameBoard.nodes[nodeIndex].getBottomRightTile() !== -1 && this.currentState.gameBoard.tiles[this.currentState.gameBoard.nodes[nodeIndex].getBottomRightTile()].getMaxNodes() === 2){ 
  //           weights.push(moves[i]);
  //           weights.push(moves[i]);
  //         }
  //         else if(this.currentState.gameBoard.nodes[nodeIndex].getBottomRightTile() !== -1 && this.currentState.gameBoard.tiles[this.currentState.gameBoard.nodes[nodeIndex].getBottomRightTile()].getMaxNodes() === 1){ 
  //           weights.push(moves[i]);
  //         }

  //         if(this.currentState.gameBoard.nodes[nodeIndex].getBottomLeftTile() !== -1 && this.currentState.gameBoard.tiles[this.currentState.gameBoard.nodes[nodeIndex].getBottomLeftTile()].getMaxNodes() === 3){
  //           weights.push(moves[i]);
  //           weights.push(moves[i]);  
  //           weights.push(moves[i]);        
  //         }
  //         else if(this.currentState.gameBoard.nodes[nodeIndex].getBottomLeftTile() !== -1 && this.currentState.gameBoard.tiles[this.currentState.gameBoard.nodes[nodeIndex].getBottomLeftTile()].getMaxNodes() === 2){ 
  //           weights.push(moves[i]);
  //           weights.push(moves[i]);
  //         }
  //         else if(this.currentState.gameBoard.nodes[nodeIndex].getBottomLeftTile() !== -1 && this.currentState.gameBoard.tiles[this.currentState.gameBoard.nodes[nodeIndex].getBottomLeftTile()].getMaxNodes() === 1){ 
  //           weights.push(moves[i]);
  //         }

  //         if(this.currentState.gameBoard.nodes[nodeIndex].getTopLeftTile() !== -1 && this.currentState.gameBoard.tiles[this.currentState.gameBoard.nodes[nodeIndex].getTopLeftTile()].getMaxNodes() === 3){
  //           weights.push(moves[i]);
  //           weights.push(moves[i]);  
  //           weights.push(moves[i]);        
  //         }
  //         else if(this.currentState.gameBoard.nodes[nodeIndex].getTopLeftTile() !== -1 && this.currentState.gameBoard.tiles[this.currentState.gameBoard.nodes[nodeIndex].getTopLeftTile()].getMaxNodes() === 2){ 
  //           weights.push(moves[i]);
  //           weights.push(moves[i]);
  //         }
  //         else if(this.currentState.gameBoard.nodes[nodeIndex].getTopLeftTile() !== -1 && this.currentState.gameBoard.tiles[this.currentState.gameBoard.nodes[nodeIndex].getTopLeftTile()].getMaxNodes() === 1){ 
  //           weights.push(moves[i]);
  //         }
  //         if(cornerNodes.includes(nodeIndex)){
  //           while(weights.includes(moves[i])){
  //             weights.splice(weights.indexOf(moves[i]),1);
  //           }
  //         }
  //         weights.push(moves[i]);
  //       }
        
          
        
  //     }


  //     if(moveObj.branchesPlaced.length > 0){
  //       weights.push(moves[i]);
  //     }

  //     if(moveObj.nodesPlaced.includes(8)){
  //       weights.push(moves[i]);
  //       weights.push(moves[i]);
  //       weights.push(moves[i]);
  //     }
  //     if(moveObj.nodesPlaced.includes(9)){
  //       weights.push(moves[i]);
  //       weights.push(moves[i]);
  //       weights.push(moves[i]);
  //     }
  //     if(moveObj.nodesPlaced.includes(14)){
  //       weights.push(moves[i]);
  //       weights.push(moves[i]);
  //       weights.push(moves[i]);
  //     }
  //     if(moveObj.nodesPlaced.includes(15)){
  //       weights.push(moves[i]);
  //       weights.push(moves[i]);
  //       weights.push(moves[i]);
  //     }

  //     if(moveObj.nodesPlaced.includes(3)){
  //       weights.push(moves[i]);
  //     }
  //     if(moveObj.nodesPlaced.includes(4)){
  //       weights.push(moves[i]);
  //     }
  //     if(moveObj.nodesPlaced.includes(10)){
  //       weights.push(moves[i]);
  //     }
  //     if(moveObj.nodesPlaced.includes(16)){
  //       weights.push(moves[i]);
  //     }
  //     if(moveObj.nodesPlaced.includes(20)){
  //       weights.push(moves[i]);
  //     }
  //     if(moveObj.nodesPlaced.includes(19)){
  //       weights.push(moves[i]);
  //     }
  //     if(moveObj.nodesPlaced.includes(13)){
  //       weights.push(moves[i]);
  //     }
  //     if(moveObj.nodesPlaced.includes(7)){
  //       weights.push(moves[i]);
  //     }
      
  //     const currentOwner = this.currentState.currentPlayer === 1 ? Owner.PLAYERONE : Owner.PLAYERTWO;
  //     const affectedPlayer = this.currentState.currentPlayer === 1 ? CoreLogic.clonePlayer(this.currentState.player1) : CoreLogic.clonePlayer(this.currentState.player2);
      
  //     for(const branchIndex of moveObj.branchesPlaced){
  //       const clonedState = State.cloneState(this.currentState);
  //       clonedState.gameBoard.branches[branchIndex].setOwner(currentOwner);

  //       for (let i = 0; i < clonedState.gameBoard.tiles.length; i++) {
  //         clonedState.tilesBeingChecked = [];
  //         if (CoreLogic.checkForCaptures(clonedState,affectedPlayer, i) === true) {
  //           weights.push(moves[i]);
  //           weights.push(moves[i]);
  //         }
  //       }
  //     }

  //     if(this.currentState.inInitialMoves){
  //       for(const nodeIndex of moveObj.nodesPlaced){
  //         if(cornerNodes.includes(nodeIndex)){
  //           while(weights.includes(moves[i])){
  //             weights.splice(weights.indexOf(moves[i]),1);
  //           }
  //         }
  //       }
  //     }
      


  //     if(moveObj.tradedIn.length === 0 && moveObj.nodesPlaced.length === 0 && moveObj.branchesPlaced.length === 0){
  //       weights.push(moves[i]);
  //     }
  //   }


  //   console.log(weights.length, weights);
  //   return moves.indexOf(weights[Math.floor(Math.random()*weights.length)]);
  // }

  
}




