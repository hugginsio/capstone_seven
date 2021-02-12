// Defines helper methods for core game logic

import { State } from '../classes/ai/ai.class.State';
import { GameBoard } from '../classes/gamecore/game.class.GameBoard';
import { Player } from '../classes/gamecore/game.class.Player';
import { Owner } from '../enums/game.enums';

interface Move {
  tradedIn:string[],
  received:string,
  nodesPlaced:number[],
  branchesPlaced:number[]
}


export class CoreLogic {

  static getStartingState(player1:Player, player2:Player, gameBoard:GameBoard, currentPlayer:number):State{
    const newBoard = new GameBoard();
    newBoard.tiles = gameBoard.tiles.slice();
    newBoard.nodes = gameBoard.nodes.slice();
    newBoard.branches = gameBoard.branches.slice();
    
    return new State([], newBoard, currentPlayer, player1, player2,true);
  }

  static getLegalMoves(state:State): string[] {
    //TODO: write this method
    const result:string[] = [];
    if(state.inInitialMoves){
      //initial moves

      const nodePlacements = [];
      /*the initial moves the ai will treat the players as having enough resources
           for one node and one branch without the ability to trade*/
      if(state.currentPlayer === 1){
        state.player1.greenResources = 2;
        state.player1.yellowResources = 2;
        state.player1.redResources = 1;
        state.player1.blueResources = 1;
      }
      else{
        state.player2.greenResources = 2;
        state.player2.yellowResources = 2;
        state.player2.redResources = 1;
        state.player2.blueResources = 1;
      }

      //get starting move possibilities for player 1
      for(const node of state.gameBoard.nodes){
        if(node.getOwner() === Owner.NONE){
          nodePlacements.push(state.gameBoard.nodes.indexOf(node));
        }
      }

      const branchPlacements = [];
      for(const nodeIndex of nodePlacements){
        const branchesPerNode = [];
        if(state.gameBoard.nodes[nodeIndex].getTopBranch() >= 0){
          if ( state.gameBoard.branches[state.gameBoard.nodes[nodeIndex].getTopBranch()].getOwner() === Owner.NONE){
            branchesPerNode.push(state.gameBoard.nodes[nodeIndex].getTopBranch());
          }
        }

        if(state.gameBoard.nodes[nodeIndex].getRightBranch() >= 0){
          if ( state.gameBoard.branches[state.gameBoard.nodes[nodeIndex].getRightBranch()].getOwner() === Owner.NONE){
            branchesPerNode.push(state.gameBoard.nodes[nodeIndex].getRightBranch());
          }
        }

        if(state.gameBoard.nodes[nodeIndex].getBottomBranch() >= 0){
          if ( state.gameBoard.branches[state.gameBoard.nodes[nodeIndex].getBottomBranch()].getOwner() === Owner.NONE){
            branchesPerNode.push(state.gameBoard.nodes[nodeIndex].getBottomBranch());
          }
        }

        if(state.gameBoard.nodes[nodeIndex].getLeftBranch() >= 0){
          if ( state.gameBoard.branches[state.gameBoard.nodes[nodeIndex].getLeftBranch()].getOwner() === Owner.NONE){
            branchesPerNode.push(state.gameBoard.nodes[nodeIndex].getLeftBranch());
          }
        }

        branchPlacements.push(branchesPerNode);
      }
      

      for(const nodeMoveIndex of nodePlacements){
        for(const branchMoveIndex of branchPlacements[nodeMoveIndex]){
          result.push(CoreLogic.moveToString({tradedIn:[''],received:'',nodesPlaced:[nodeMoveIndex],branchesPlaced:[branchMoveIndex]}));
        }
      }

    }
    else{
      //general moves
    }
    return result;
  }

  //return 1 if winner, -1 if loser, 0 if draw, -Infinity if there is no winner yet
  static determineIfWinner(state:State):number {
    let result = -Infinity;

    //Probably need to take into account possible draws with less than ten points
    if(state.player1.currentScore >= 10 && state.player2.currentScore >= 10){
      result = 0;
    }

    if(state.currentPlayer === 1){
      if(state.player1.currentScore >= 10){
        result = state.currentPlayer;
      }
      
    }
    else{
      if(state.player2.currentScore >= 10){
        result = state.currentPlayer;
      }
    }

    return result;
  }

  static nextState(state:State, move:string):State{
    const newHistory = state.moveHistory.slice();
    newHistory.push(move);
    const newBoard = new GameBoard();
    newBoard.tiles = state.gameBoard.tiles.slice();
    newBoard.nodes = state.gameBoard.nodes.slice();
    newBoard.branches = state.gameBoard.branches.slice();

    
    const newState = new State(newHistory, newBoard, state.currentPlayer, state.player1, state.player2, state.inInitialMoves);

    if(state.currentPlayer === 1){
      CoreLogic.applyMove(move,newState.gameBoard,newState.player1, Owner.PLAYERONE);
    }
    else{
      CoreLogic.applyMove(move, newState.gameBoard,newState.player2, Owner.PLAYERTWO);
    }

    
    //currentPlayer is 1 for player 1 and -1 for player 2
    if(newState.moveHistory.length !== 2){
      newState.currentPlayer = -newState.currentPlayer;
    }

    if(!newState.inInitialMoves){
    //Next Player gets more resources
      if(newState.currentPlayer === 1){
        newState.player1.redResources += newState.player1.redPerTurn;
        newState.player1.blueResources += newState.player1.bluePerTurn;
        newState.player1.greenResources += newState.player1.greenPerTurn;
        newState.player1.yellowResources += newState.player1.yellowPerTurn;
      }
      else{
        newState.player2.redResources += newState.player2.redPerTurn;
        newState.player2.blueResources += newState.player2.bluePerTurn;
        newState.player2.greenResources += newState.player2.greenPerTurn;
        newState.player2.yellowResources += newState.player2.yellowPerTurn;
      }
    }
    
    if(newState.moveHistory.length === 4){
      newState.inInitialMoves = false;
    }

   
    return newState;
  }

  static applyMove(move:string, board:GameBoard, affectedPlayer:Player, owner:Owner):void{

    const moveObj:Move = CoreLogic.stringToMove(move);
    for(const resource of moveObj.tradedIn){
      if(resource === 'G'){
        affectedPlayer.greenResources--;
      }
      else if (resource === 'Y'){
        affectedPlayer.yellowResources--;
      }
      else if (resource === 'R'){
        affectedPlayer.redResources--;
      }
      else if (resource === 'B'){
        affectedPlayer.blueResources--;
      }
    }

    if(moveObj.received === 'G'){
      affectedPlayer.greenResources++;
    }
    else if (moveObj.received  === 'Y'){
      affectedPlayer.yellowResources++;
    }
    else if (moveObj.received  === 'R'){
      affectedPlayer.redResources++;
    }
    else if (moveObj.received  === 'B'){
      affectedPlayer.blueResources++;
    }

    for(const node of moveObj.nodesPlaced){
      board.nodes[node].setOwner(owner);
      affectedPlayer.greenResources -= 2;
      affectedPlayer.yellowResources -=2;
      affectedPlayer.currentScore++;
    }

    for(const branch of moveObj.branchesPlaced){
      board.branches[branch].setOwner(owner);
      affectedPlayer.redResources --;
      affectedPlayer.blueResources --;
    }

    //captured tile and longest network point allocation

    //Need to deal with tile exhaustion 

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