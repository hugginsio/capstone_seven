import { Injectable } from '@angular/core';

import { MonteCarlo, MCTSNode, State } from '../../interfaces/ai.interfaces';
import { GameBoard } from '../../interfaces/game.interfaces';
import { CoreLogic } from '../../util/core-logic.util';

@Injectable({
  providedIn: 'root'
})
export class AiService implements MonteCarlo {
  
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
      let unexpandedMoves = CoreLogic.getLegalMoves(state).slice();
      
      //TODO: create MCTSNodeService
      //let newMCTSNode = new MCTSNodeService(null, null, state, unexpandedMoves);
      //this.mctsNodes.set(state.hash(), newMCTSNode);
    }
  }
}




