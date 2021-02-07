import { GameBoard } from '../gamecore/game.class.GameBoard';
import { Player } from '../gamecore/game.class.Player';

export class State {
    
  moveHistory:string[];
  gameBoard:GameBoard;
  currentPlayer:Player;

  constructor(moveHistory:string[], gameBoard:GameBoard, player:Player) {
    this.moveHistory = moveHistory;
    this.gameBoard = gameBoard;
    this.currentPlayer = player;
  }

  isPlayer(player:Player):boolean {
    return (player === this.currentPlayer);
  }

  hash():string {
    return JSON.stringify(this.moveHistory);
  }
}