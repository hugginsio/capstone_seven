import { Injectable } from '@angular/core';
import { GameType, Owner } from '../../enums/game.enums';

import { GameBoard } from '../../classes/game.class.GameBoard';
import { Tile } from '../../classes/game.class.Tile';
import { Node } from '../../classes/game.class.Node';
import { Branch } from '../../classes/game.class.Branch';
import { Player } from '../../classes/game.class.Player';


@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private gameBoard: GameBoard;
  private playerOne: Player;
  private playerTwo: Player;
  private gameType: GameType;

  constructor() {
    this.gameBoard = new GameBoard();
    this.playerOne = new Player();
    this.playerTwo = new Player();
  }

  createBoard(random: boolean): void {

      if (random) {
        this.gameBoard.randomizeColorsAndMaxNodes();
      }
      else {
        // let user enter tile placement 
      }
   }

  initialNodePlacements(possibleNode:number, currentPlayer:Owner): boolean { 
    if (this.gameBoard.nodes[possibleNode].getOwner() === "NONE") {
        if (currentPlayer == Owner.PLAYERONE) {
          this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERONE);
        }
        else {
          this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERTWO);
        }
        // prompt for a branch placement
        // send node info
        return true;
    }
    else {
      // prompt for a correct node placement 
      return false;
    }
  }

  initialBranchPlacements(selectedNode:number, possibleBranch:number, currentPlayer:Owner): boolean { 
    if (this.gameBoard.branches[possibleBranch].getOwner() === "NONE") {
      if (this.gameBoard.nodes[selectedNode].getTopBranch() === possibleBranch ||
          this.gameBoard.nodes[selectedNode].getLeftBranch() === possibleBranch ||
          this.gameBoard.nodes[selectedNode].getBottomBranch() === possibleBranch ||
          this.gameBoard.nodes[selectedNode].getRightBranch() === possibleBranch
        ) 
      {
        if (currentPlayer == Owner.PLAYERONE) {
          this.gameBoard.branches[possibleBranch].setOwner(Owner.PLAYERONE);
        }
        else {
          this.gameBoard.branches[possibleBranch].setOwner(Owner.PLAYERONE);
        }
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  generalNodePlacement(possibleNode:number, currentPlayer:Owner): boolean {
    if (this.gameBoard.nodes[possibleNode].getOwner() === "NONE") {
      if (this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getTopBranch()].getOwner() === currentPlayer ||
      this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getLeftBranch()].getOwner() === currentPlayer ||
      this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getBottomBranch()].getOwner() === currentPlayer ||
      this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getRightBranch()].getOwner() === currentPlayer) {
      if (currentPlayer == Owner.PLAYERONE) {
        this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERONE);
      }
      else {
        this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERTWO);
      }
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}

  generalBranchPlacement(possibleBranch:number, currentPlayer:Owner): boolean {
    if (this.gameBoard.branches[possibleBranch].getOwner() === "NONE") {
      if (this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch(1)].getOwner() === currentPlayer ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch(2)].getOwner() === currentPlayer ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch(3)].getOwner() === currentPlayer ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch(4)].getOwner() === currentPlayer ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch(5)].getOwner() === currentPlayer ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch(6)].getOwner() === currentPlayer) {
        if (currentPlayer == Owner.PLAYERONE) {
          this.gameBoard.branches[possibleBranch].setOwner(Owner.PLAYERONE);
        }
        else {
          this.gameBoard.branches[possibleBranch].setOwner(Owner.PLAYERTWO);
        }
        return true;
      }
    }
    else {
      return false;
    }
  }

  nextTurn(): void { }
  endTurn(): void { }
}
