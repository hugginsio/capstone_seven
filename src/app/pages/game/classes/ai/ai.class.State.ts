import { GameBoard } from '../gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';
import { CoreLogic } from '../../util/core-logic.util';
import { MCTSNode } from './ai.class.MCTSNode';

export class State {
    
  board:GameBoard;
  playerNumber:number;
  visitCount:number;
  winScore:number;

  copyState():State{

  }

  getAllPossibleStates():Array<State>{
    // constructs a list of all possible states from current state
  }

  randomPlay():void{
    /* get a list of all possible positions on the board and 
           play a random move */
  }
}