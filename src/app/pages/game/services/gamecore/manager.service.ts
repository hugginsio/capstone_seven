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

   startGame(): void {

    this.makeInitialPlacements(Owner.PLAYERONE);
    this.makeInitialPlacements(Owner.PLAYERTWO);
    this.makeInitialPlacements(Owner.PLAYERTWO);
    this.makeInitialPlacements(Owner.PLAYERONE);

    this.nextTurn(this.playerTwo);
  }

  nextTurn(currentPlayer: Player): void { 
    // make moves -- check resources 
    // take back placements -- reverseNodePlacement and reverseBranchPlacement
    // can call trading fuction 
    
    // end turn button
  }

  // lol how da heck we gettin the node and branch selections??
  makeInitialPlacements(currentPlayer: Owner):void {
    let nodeNum = 0;
    let branchNum = 0;

    while(!this.initialNodePlacements(nodeNum, currentPlayer)){
      // take in new node selection???
    }
    while(!this.initialBranchPlacements(nodeNum, branchNum, currentPlayer)){
      // take in new branch selection???
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
        this.playerOne.greenResources -= 2;
        this.playerOne.yellowResources -= 2;

      }
      else {

        this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERTWO);
        this.playerTwo.greenResources -= 2;
        this.playerTwo.yellowResources -= 2;

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
          this.playerOne.redResources--;
          this.playerOne.blueResources--;
        }

        else {
          this.gameBoard.branches[possibleBranch].setOwner(Owner.PLAYERTWO);
          this.playerTwo.redResources--;
          this.playerTwo.blueResources--;
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

  reverseNodePlacement(reverseNode: number, currentPlayer: Owner): void {
    this.gameBoard.nodes[reverseNode].setOwner(Owner.NONE);
    if (currentPlayer === "PLAYERONE") {
      this.playerOne.yellowResources += 2;
      this.playerOne.greenResources += 2;
    }
    else {
      this.playerTwo.yellowResources += 2;
      this.playerTwo.greenResources += 2;
    }
  }

  reverseBranchPlacement(reverseBranch: number, currentPlayer: Owner): void {
    this.gameBoard.branches[reverseBranch].setOwner(Owner.NONE);
    if (currentPlayer === "PLAYERONE") {
      this.playerOne.redResources++;
      this.playerOne.blueResources++;
    }
    else {
      this.playerTwo.redResources++;
      this.playerTwo.blueResources++;
    }
  }

  endTurn(): void { 
    // did anyone win??
        // yes ? yay !! 
        // no ? 
          // update resources of next player
    // calls nextTurn
  }
}
