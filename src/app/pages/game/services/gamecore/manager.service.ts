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

    this.makeInitialPlacements(this.playerOne, false);
    this.makeInitialPlacements(this.playerTwo, false);
    this.makeInitialPlacements(this.playerTwo, false);
    this.makeInitialPlacements(this.playerOne, false);

    this.endTurn(this.playerOne); 
  }

  nextTurn(currentPlayer: Player): void { 
    currentPlayer.hasTraded = false;
    let stack = [];

    //let obj = {pieceType: 'N', index: 13};
    //let str = obj.pieceType;

    // make moves -- check resources 
    clickNode(event: MouseEvent) {
      let nodeId = event.target.id.subString(1,1) as number;
      if (this.generalNodePlacement(nodeId, currentPlayer)){
        let obj = {pieceType: 'N', index: nodeId};
        stack.push(obj);
      }
     }

     clickBranch(event: MouseEvent) {
      let branchId = event.target.id.subString(1,1) as number;
      if(this.generalBranchPlacement(branchId, currentPlayer)) {
        let obj = {pieceType: 'B', index: branchId};
        stack.push(obj);
      }
     }
    // take back placements -- reverseNodePlacement and reverseBranchPlacement
    clickUndo(event: MouseEvent) {
      let placement = stack.pop();
      this.undoPlacement(placement.pieceType, placement.index, currentPlayer);
    }
    // can call trading fuction 
    clickTrade(event: MouseEvent) {
      this.makeTrade(currentPlayer);
    }
    
    // end turn button
    clickEndTurn(event: MouseEvent) {
      this.endTurn(currentPlayer);
    }
  }

  makeTrade(currentPlayer:Player): void {

      let tradedResources = [];

      if(currentPlayer.hasTraded === false)
      {
        clickRed(event: MouseEvent) {
          if (currentPlayer.redResources > 0 && tradedResources.length <= 3) {
            tradedResources.push('R');
            currentPlayer.redResources--;
          }
        }
        clickBlue(event: MouseEvent) {
          if (currentPlayer.blueResources > 0 && tradedResources.length <= 3) {
            tradedResources.push('B');
            currentPlayer.blueResources--;
          }
        }
        clickYellow(event: MouseEvent) {
          if (currentPlayer.yellowResources > 0 && tradedResources.length <= 3) {
            tradedResources.push('Y');
            currentPlayer.yellowResources--;
          }
        }
        clickGreen(event: MouseEvent) {
          if (currentPlayer.greenResources > 0 && tradedResources.length <= 3) {
            tradedResources.push('G');
            currentPlayer.greenResources--;
          }
        }

        clickUndoSelectedResource(event: MouseEvent) {
          if (tradedResources.length > 0) {
            let selectedResource = event.target.id.subString(1,1) as string;
            let index = tradedResources.indexOf(selectedResource);
            if (index != -1) {
              tradedResources.splice(index, 1);
              switch (selectedResource) {
                case 'R':
                  currentPlayer.redResources++;
                  break;
                case 'B':
                  currentPlayer.blueResources++;
                  break;
                case 'Y':
                  currentPlayer.yellowResources++;
                  break;
                case 'G':
                  currentPlayer.greenResources++;
                  break;
                }
            }
          }  
        }

        clickTradeFor(event: MouseEvent) {
          if(tradedResources.length === 3) {
            let selectedResource = event.target.id.subString(1,1) as string;
            let index = tradedResources.indexOf(selectedResource);
            if(index === -1)
            {
              clickConfirmTrade(event: MouseEvent) {
                switch (selectedResource) {
                  case 'R':
                    currentPlayer.redResources++;
                    break;
                  case 'B':
                    currentPlayer.blueResources++;
                    break;
                  case 'Y':
                    currentPlayer.yellowResources++;
                    break;
                  case 'G':
                    currentPlayer.greenResources++;
                    break;
                  }
              }
            }
          }
          
        }

      }
  }

  undoPlacement(piece: string, index: number, currentPlayer: Player){
    if (piece === 'N'){
      this.reverseNodePlacement(index, currentPlayer);
    }
    else {
      this.reverseBranchPlacement(index, currentPlayer);
    }
  }
   
  makeInitialPlacements(currentPlayer: Player, legalNodeMove: boolean): boolean {

    let legalBranchMove = false;
    let nodeId;
    let branchId;

    if(!legalNodeMove){
      clickNode(event: MouseEvent) {
        nodeId = event.target.id.subString(1,1) as number;
        legalNodeMove = this.initialNodePlacements(nodeId, currentPlayer);
        }
    }
    if(legalNodeMove){
      clickBranch(event: MouseEvent) {
        branchId = event.target.id.subString(1,1) as number;
        legalBranchMove = this.initialBranchPlacements(nodeId, branchId, currentPlayer);
       }
       
      clickUndo(event: MouseEvent){
        if (legalBranchMove)
        {
          this.reverseInitialBranchPlacement(branchId, currentPlayer)
          legalBranchMove = false;
        }
        else {
          this.reverseInitialNodePlacement(nodeId, currentPlayer);
          legalNodeMove = false;
        }
      }

       if (!legalBranchMove)
          this.makeInitialPlacements(currentPlayer, true);
    }
    else{
        this.makeInitialPlacements(currentPlayer, false);
    }

    clickEndTurn (event:MouseEvent){
      return true;
    }
  }

  initialNodePlacements(possibleNode:number, currentPlayer:Player): boolean { 
    if (this.gameBoard.nodes[possibleNode].getOwner() === "NONE") {
        if (currentPlayer == this.playerOne) {
          this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERONE);
          this.playerOne.numNodesPlaced++;
          this.playerOne.currentScore++;

        }
        else {
          this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERTWO);
          this.playerTwo.numNodesPlaced++;
          this.playerTwo.currentScore++;
          
        }
        return true;
    }
    else {
      return false;
    }
  }

  initialBranchPlacements(selectedNode:number, possibleBranch:number, currentPlayer:Player): boolean {
    if (this.gameBoard.branches[possibleBranch].getOwner() === "NONE") {
      if (this.gameBoard.nodes[selectedNode].getTopBranch() === possibleBranch ||
          this.gameBoard.nodes[selectedNode].getLeftBranch() === possibleBranch ||
          this.gameBoard.nodes[selectedNode].getBottomBranch() === possibleBranch ||
          this.gameBoard.nodes[selectedNode].getRightBranch() === possibleBranch
        ) 
      {
        if (currentPlayer == this.playerOne) {
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

  generalNodePlacement(possibleNode:number, currentPlayer:Player): boolean {
    if (this.gameBoard.nodes[possibleNode].getOwner() === "NONE") {

      let nodeOwner;
      if (currentPlayer === this.playerOne)
        nodeOwner = "PLAYERONE";
      else
        nodeOwner = "PLAYERTWO";

      if (this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getTopBranch()].getOwner() === nodeOwner ||
      this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getLeftBranch()].getOwner() === nodeOwner ||
      this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getBottomBranch()].getOwner() === nodeOwner ||
      this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getRightBranch()].getOwner() === nodeOwner) {

      if (currentPlayer == this.playerOne) {

        this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERONE);
        this.playerOne.greenResources -= 2;
        this.playerOne.yellowResources -= 2;
        this.playerOne.numNodesPlaced++;
        this.playerOne.currentScore++;
      }
      else {

        this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERTWO);
        this.playerTwo.greenResources -= 2;
        this.playerTwo.yellowResources -= 2;
        this.playerTwo.numNodesPlaced++;
        this.playerTwo.currentScore++;
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

  generalBranchPlacement(possibleBranch:number, currentPlayer:Player): boolean {
    if (this.gameBoard.branches[possibleBranch].getOwner() === "NONE") {

      let branchOwner;
      if (currentPlayer === this.playerOne)
        branchOwner = "PLAYERONE";
      else
        branchOwner = "PLAYERTWO";

      if (this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch(1)].getOwner() === branchOwner ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch(2)].getOwner() === branchOwner ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch(3)].getOwner() === branchOwner ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch(4)].getOwner() === branchOwner ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch(5)].getOwner() === branchOwner ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch(6)].getOwner() === branchOwner) {

        if (currentPlayer == this.playerOne) {
    
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

  reverseNodePlacement(reverseNode: number, currentPlayer: Player): void {
    this.gameBoard.nodes[reverseNode].setOwner(Owner.NONE);
    if (currentPlayer === this.playerOne) {
      this.playerOne.numNodesPlaced--;
      this.playerOne.currentScore--;
      this.playerOne.yellowResources += 2;
      this.playerOne.greenResources += 2;
    }
    else {
      this.playerTwo.numNodesPlaced--;
      this.playerTwo.currentScore--;
      this.playerTwo.yellowResources += 2;
      this.playerTwo.greenResources += 2;
    }
  }

  reverseInitialNodePlacement(reverseNode: number, currentPlayer: Player): void {
    this.gameBoard.nodes[reverseNode].setOwner(Owner.NONE);
    if (currentPlayer === this.playerOne) {
      this.playerOne.numNodesPlaced--;
      this.playerOne.currentScore--;
    }
    else {
      this.playerTwo.numNodesPlaced--;
      this.playerTwo.currentScore--;
    }
  }

  reverseBranchPlacement(reverseBranch: number, currentPlayer: Player): void {
    this.gameBoard.branches[reverseBranch].setOwner(Owner.NONE);
    if (currentPlayer === this.playerOne) {
      this.playerOne.redResources++;
      this.playerOne.blueResources++;
    }
    else {
      this.playerTwo.redResources++;
      this.playerTwo.blueResources++;
    }
  }

  reverseInitialBranchPlacement(reverseBranch: number, currentPlayer: Player): void {
    this.gameBoard.branches[reverseBranch].setOwner(Owner.NONE);
  }

  endTurn(endPlayer: Player): void { 
    if (this.playerOne.currentScore >= 10 ||
        this.playerTwo.currentScore >= 10) {
          if (this.playerOne.currentScore > this.playerTwo.currentScore) {
            // playerOne wins
          }
          else {
            // playerTwo wins
          }
        }
      else {
        // update resources of next player
       
        if (endPlayer === this.playerOne) {
          this.nextTurn(this.playerTwo);
        }
        else {
          this.nextTurn(this.playerOne);
        }
      }     
  }

  // clickEvent(event: MouseEvent) {
  //   const pieceType = event.target.id.subString(0,0);
  //   const tileId = event.target.id.subString(1,1);
  //   tiles[tileId];
  // }

  // <div id="T1" (click)="this.ManagerService.clickTile($event)" />
}
