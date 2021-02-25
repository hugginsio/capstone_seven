import { GameBoard } from '../gamecore/game.class.GameBoard';
import { MCTSNode } from './ai.class.MCTSNode';
import { State } from './ai.class.State';
import { CoreLogic } from '../../util/core-logic.util';
import { state } from '@angular/animations';

interface GameStatistics {
  runtime: number,
  simulations: number
}


export class MonteCarlo {
  gameBoard:GameBoard;
  exploreParameter:number;
  mctsNodeKeys:string[];
  mctsNodeValues:MCTSNode[];

  constructor(gameBoard:GameBoard, exploreParameter:number) { 
    this.gameBoard = gameBoard;
    this.exploreParameter = exploreParameter;

    this.mctsNodeKeys = [];
    this.mctsNodeValues = [];
    
  }

  makeMCTSNode(state:State):void{
    if(!this.mctsNodeKeys.includes(state.hash())){
      const unexpandedMoves = CoreLogic.getLegalMoves(state);
      let move:string | null;
      if(state.moveHistory[state.moveHistory.length - 1] !== undefined){
        move = state.moveHistory[state.moveHistory.length - 1];
      }
      else{
        move = null;
      }
      //console.log(move);
      const newMCTSNode = new MCTSNode(null, move, state, unexpandedMoves);
      this.mctsNodeKeys.push(state.hash());
      this.mctsNodeValues.push(newMCTSNode);
    }
  }

  runSearch(state:State, timeout = 3):GameStatistics{
    this.makeMCTSNode(state);

    
    let totalSims = 0;
    const end = Date.now() + timeout * 1000;

    while (Date.now() < end){
      let node = this.selectMCTSNode(state);
      
      let winner = CoreLogic.determineIfWinner(node.state);

      if(!node.isLeaf() && winner === 0){
        node = this.expand(node);
        winner = this.simulate(node);
      }

      this.backPropagate(node,winner);

      totalSims++;


      

    }

    return {runtime: timeout, simulations:totalSims};
  }

  calculateBestMove(state:State, policy:string):string{
    this.makeMCTSNode(state);

    if (this.mctsNodeValues[this.mctsNodeKeys.indexOf(state.hash())] === null ||
        this.mctsNodeValues[this.mctsNodeKeys.indexOf(state.hash())] === undefined /*||
        !this.mctsNodeValues[this.mctsNodeKeys.indexOf(state.hash())].isFullyExpanded()*/){

      //console.log(state.hash());
      //console.log(this.mctsNodeKeys.indexOf(state.hash()));
      //console.log(this.mctsNodeValues[this.mctsNodeKeys.indexOf(state.hash())]);
      //console.log(this.mctsNodeValues[this.mctsNodeKeys.indexOf(state.hash())].getUnexpandedMoves());
      /*console.log(this.mctsNodeKeys.length, this.mctsNodeValues.length);
      console.log(this.mctsNodeKeys);
      console.log(this.mctsNodeValues[0],this.mctsNodeValues[1]);*/

      throw new Error("Not enough information!");
    }
    // console.log(this.mctsNodeKeys.length, this.mctsNodeValues.length);
    // console.log(this.mctsNodeKeys);
    const node = this.mctsNodeValues[this.mctsNodeKeys.indexOf(state.hash())];
    const allMoves = node?.getAllMoves();
    let bestMove = ';;';

    if(allMoves === undefined){
      throw new Error("No Moves");
    }

    if(policy === "robust"){
      let max = -Infinity;

      for(const move of allMoves){
        const childNode = node.childrenValues[node.childrenKeys.indexOf(move)].node;
        if(childNode?.visits as number > max){
          bestMove = move;
          max = childNode?.visits as number;
        }
      }
    }
    else if(policy === "max"){
      let max = -Infinity;

      for(const move of allMoves){
        const childNode = node.childrenValues[node.childrenKeys.indexOf(move)].node;
        if(childNode !== null){
          const visits = childNode.visits;
          const wins = childNode.wins;
          const ratio =  wins / visits;
          if(ratio > max){
            bestMove = move;
            max = ratio;
          }
        }

        
      }
    }
    return bestMove;
  }

  selectMCTSNode(state:State):MCTSNode{
    //console.log(state.hash());
    //console.log(this.mctsNodeKeys.indexOf(state.hash()));
    //console.log(this.mctsNodeValues[this.mctsNodeKeys.indexOf(state.hash())]);
    let node = this.mctsNodeValues[this.mctsNodeKeys.indexOf(state.hash())];
    //console.log(node);
    if(node === undefined){
      throw new Error("Node undefined");
    }
    while(node?.isFullyExpanded() && !node.isLeaf()){
      const moves = node.getAllMoves();
      let bestMove;
      let bestUCBValue = -Infinity;
      for(const move of moves){
        const childUCBValue = node.getChildNode(move).getUCBValue(this.exploreParameter);
        if(childUCBValue > bestUCBValue){
          bestMove = move;
          bestUCBValue = childUCBValue;
        }
      }
      node = node.getChildNode(bestMove as string);
    }
    //console.log(node);
    return node;
  }

  expand(node:MCTSNode):MCTSNode{
    const moves = node.getUnexpandedMoves();
    const index = Math.floor(Math.random() * moves.length);
    const move = moves[index];
    /*console.log(moves);
    console.log(index);
    console.log(move);*/

    const childState = CoreLogic.nextState(node.state, move);
    const childUnexpandedMoves = CoreLogic.getLegalMoves(childState);
    const childNode = node.expand(move, childState,childUnexpandedMoves);
    this.mctsNodeKeys.push(childState.hash());
    this.mctsNodeValues.push(childNode);

    return childNode;
  }

  simulate(node:MCTSNode):number{
    let state = node.state;
    let winner = CoreLogic.determineIfWinner(state);

    //console.log(state.currentPlayer,state.player1,state.player2);
    while(winner === 0){
      const moves = CoreLogic.getLegalMoves(state);
      //console.log(state);
      //console.log(moves);
      const move = moves[Math.floor(Math.random() * moves.length)];
      state = CoreLogic.nextState(state, move);
      winner = CoreLogic.determineIfWinner(state);  
     
      console.log(state);
        
    }

    return winner;
  }

  backPropagate(node:MCTSNode, winner:number):void{
    while (node !== null){
      node.visits += 1;

      if(node.state.isPlayer(-winner)){
        node.wins += 1;
      }
      
      node = node.parent as MCTSNode;
    }
  }

//   getStats(state:State):Stats{
//     const node = this.mctsNodes.get(state.hash()) as MCTSNode;
//     const stats = { visits: node.visits, wins: node.wins, children: [] };
//     for (const child in node.children.values()) {
//       if (node.children.get(child)?.node === null){ 
//         stats.children.push({ move: child, visits: null, wins: null});
//       }
//       else {
//         stats.children.push({ move: child, visits: node.children.get(child)?.node.visits, wins: node.children.get(child)?.node.wins});
//       }
//     }
//     return stats;
//   }
}