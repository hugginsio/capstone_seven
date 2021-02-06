import { GameType } from '../interfaces/game.interfaces';
import { GameBoard } from './game.class.GameBoard';

  export class GameMaster {
    gameBoard: GameBoard;
    gameType: GameType;

    constructor (type: GameType) {
      this.gameType = type;

      this.gameBoard = new GameBoard;
    }
  }