import { MonteCarlo } from '../..//classes/ai/ai.class.MonteCarlo';
import { State } from '../../classes/ai/ai.class.State';
import { GameBoard } from '../../classes/gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';



interface Resources{
  red:number,
  blue:number,
  green:number,
  yellow:number,
}

export class AI {
  
  mcts: MonteCarlo;
  
  constructor(gameBoard:GameBoard, player1:Player,player2:Player,explorationParameter:number) {
    this.mcts = new MonteCarlo(gameBoard, player1, player2,explorationParameter); 
  }

  getAIMove(gameboard:GameBoard,player1:Player,player2:Player,previousPlayerNo:number,pastMoveString:string):string{

    const start = Date.now();
    const newState = new State(gameboard,player1, player2);
    newState.playerNumber = previousPlayerNo;
    newState.move = pastMoveString;

    const result = this.mcts.findNextMove(newState,5700);

    console.warn(`Time for AI move = ${Date.now() - start}ms`);
    return result;
  }
}