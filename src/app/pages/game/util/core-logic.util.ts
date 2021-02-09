// Defines helper methods for core game logic

import { State } from '../classes/ai/ai.class.State';
import { GameBoard } from '../classes/gamecore/game.class.GameBoard';
import { Player } from '../classes/gamecore/game.class.Player';

interface Move {
  tradedIn:string[],
  received:string,
  nodesPlaced:number[],
  branchesPlaced:number[]
}

export class CoreLogic {

  getStartingState(player1:Player, player2:Player, gameBoard:GameBoard, currentPlayer:number):State{
    const newBoard = new GameBoard();
    newBoard.tiles = gameBoard.tiles.slice();
    newBoard.nodes = gameBoard.nodes.slice();
    newBoard.branches = gameBoard.branches.slice();
    
    return new State([], newBoard, currentPlayer, player1, player2);
  }

  static getLegalMoves(state:State): string[] {
    //TODO: write this method
    return [''];
  }

  //return 1 if winner, -1 if loser, 0 if draw, -Infinity if there is no winner yet
  static determineIfWinner(state:State):number {
    //TODO: write this method

    return 0;
  }

  static nextState(state:State, move:string):State{
    const newHistory = state.moveHistory.slice();
    newHistory.push(move);
    const newBoard = new GameBoard();
    newBoard.tiles = state.gameBoard.tiles.slice();
    newBoard.nodes = state.gameBoard.nodes.slice();
    newBoard.branches = state.gameBoard.branches.slice();

    //TODO: apply the move to the new board
    
    //currentPlayer is 1 for player 1 and -1 for player 2
    return new State(newHistory, newBoard, -state.currentPlayer, state.player1, state.player2);
  }

  static moveToString(move:Move):string{
    let result = '';

    for(const resource of move.tradedIn){
      result += resource + ',';
    }
    result += move.received + ';';

    for(const node of move.nodesPlaced){
      result += node.toString();

      if(node !== move.nodesPlaced[-1]){
        result += ',';
      }
      else{
        result += ';';
      }
    }

    for(const branch of move.branchesPlaced){
      result += branch.toString();

      if(branch !== move.branchesPlaced[-1]){
        result += ',';
      }
    }

    return result; //result should be a string formatted like 'R,R,R,Y;8;3,18'
  }

  static stringToMove(moveString:string):Move{
    const result:Move = {tradedIn:[],received:'',nodesPlaced:[],branchesPlaced:[]};

    const moveSections = moveString.split(';');

    const trade = moveSections[0].split(',');
    result.tradedIn.push(trade[0]);
    result.tradedIn.push(trade[1]);
    result.tradedIn.push(trade[2]);
    result.received = trade[3];

    const nodes = moveSections[1].split(',');
    for(const node of nodes){
      result.nodesPlaced.push(parseInt(node));
    }

    const branches = moveSections[2].split(',');
    for(const branch of branches){
      result.branchesPlaced.push(parseInt(branch));
    }

    return result;
  }
}