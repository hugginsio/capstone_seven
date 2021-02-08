import { GameBoard } from '../gamecore/game.class.GameBoard';
import { MCTSNode } from './ai.class.MCTSNode';
import { State } from './ai.class.State';
import { CoreLogic } from '../../util/core-logic.util';
import { Owner } from '../../enums/game.enums';

interface GameStatistics {
  runtime: number,
  simulations: number,
  draws: number
}

export class MonteCarlo {
  gameBoard:GameBoard;
  exploreParameter:number;
  mctsNodes:Map<string, MCTSNode>;

  constructor(gameBoard:GameBoard, exploreParameter:number) { 
    this.gameBoard = gameBoard;
    this.exploreParameter = exploreParameter;

    this.mctsNodes = new Map();
    
  }

  makeMCTSNode(state:State):void{
    if(!this.mctsNodes.has(state.hash())){
      const unexpandedMoves = CoreLogic.getLegalMoves(state).slice();

      const newMCTSNode = new MCTSNode(null, null, state, unexpandedMoves);
      this.mctsNodes.set(state.hash(), newMCTSNode);
    }
  }

  runSearch(state:State, timeout = 3):GameStatistics{
    this.makeMCTSNode(state);

    let draws = 0;
    let totalSims = 0;
    const end = Date.now() + timeout * 1000;

    while (Date.now() < end){
      let node = this.selectMCTSNode(state);
      let winner = CoreLogic.determineIfWinner(node.state);

      if(!node.isLeaf() && winner === null){
        node = this.expand(node);
        winner = this.simulate(node);
      }

      this.backPropagate(node,winner);

      
      if(winner === Owner.NONE){
        draws++;
      }
      totalSims++;
    }

    return {runtime: timeout, simulations:totalSims, draws:draws};
  }

  calculateBestMove(state:State, policy:string):string{
    this.makeMCTSNode(state);

    if (this.mctsNodes.get(state.hash()) === null ||
        this.mctsNodes.get(state.hash()) === undefined ||
        !this.mctsNodes.get(state.hash())?.isFullyExpanded()){
        
      throw new Error("Not enough information!");
    }

    const node = this.mctsNodes.get(state.hash());
    const allMoves = node?.getAllMoves();
    let bestMove = '';

    if(allMoves === undefined){
      throw new Error("No Moves");
    }

    if(policy === "robust"){
      let max = -Infinity;

      for(const move of allMoves){
        const childNode = node?.getChildNode(move);
        if(childNode?.visits as number > max){
          bestMove = move;
          max = childNode?.visits as number;
        }
      }
    }
    else if(policy === "max"){
      let max = -Infinity;

      for(const move of allMoves){
        const childNode = node?.getChildNode(move);
        const visits = childNode?.visits as number;
        const wins = childNode?.wins as number;
        const ratio =  wins / visits;
        if(ratio > max){
          bestMove = move;
          max = ratio;
        }
        
      }
    }
    return bestMove;
  }

  selectMCTSNode(state:State):MCTSNode{
    let node = this.mctsNodes.get(state.hash());
    if(node === undefined){
      throw new Error("Node undefined");
    }
    while(node?.isFullyExpanded && !node.isLeaf){
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
    return node;
  }

  expand(node:MCTSNode):MCTSNode{
    const moves = node.getUnexpandedMoves();
    const index = Math.floor(Math.random() * moves.length);
    const move = moves[index];

    const childState = CoreLogic.nextState(node.state, move);
    const childUnexpandedMoves = CoreLogic.getLegalMoves(childState);
    const childNode = node.expand(move, childState,childUnexpandedMoves);
    this.mctsNodes.set(childState.hash(), childNode);

    return childNode;
  }

  simulate(node:MCTSNode):Owner{
    let state = node.state;
    let winner = CoreLogic.determineIfWinner(state);

    while(winner === null){
      const moves = CoreLogic.getLegalMoves(state);
      const move = moves[Math.floor(Math.random() * moves.length)];
      state = CoreLogic.nextState(state, move);
      winner = CoreLogic.determineIfWinner(state);    
    }

    return winner;
  }

  backPropagate(node:MCTSNode, winner:Owner):void{
    while (node !== null){
      node.visits += 1;

      if(!node.state.isPlayer(winner)){
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