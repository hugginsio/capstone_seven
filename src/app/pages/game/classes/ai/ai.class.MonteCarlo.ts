import { GameBoard } from '../gamecore/game.class.GameBoard';
import { MCTSNode } from './ai.class.MCTSNode';
import { State } from './ai.class.State';
import { CoreLogic } from '../../util/core-logic.util';

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

  

}