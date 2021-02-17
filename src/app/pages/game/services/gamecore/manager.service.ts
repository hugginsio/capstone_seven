import { Injectable } from '@angular/core';
import { GameType, Owner, TileColor } from '../../enums/game.enums';

import { GameBoard } from '../../classes/gamecore/game.class.GameBoard';
import { Tile } from '../../classes/gamecore/game.class.Tile';
import { Node } from '../../classes/gamecore/game.class.Node';
import { Branch } from '../../classes/gamecore/game.class.Branch';
import { Player } from '../../classes/gamecore/game.class.Player';


@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  public gameBoard: GameBoard;
  private playerOne: Player;
  private playerTwo: Player;
  private gameType: GameType;

  private tilesBeingChecked: [number];

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

    // if statement check to see if its local/network/AI
    // if AI then call the AI service

    this.makeInitialPlacements(this.playerOne, false);
    this.makeInitialPlacements(this.playerTwo, false);
    this.makeInitialPlacements(this.playerTwo, false);
    this.makeInitialPlacements(this.playerOne, false);

    this.endTurn(this.playerOne); 
  }

  // L52-96 will be refactored when integrating with UI

  nextTurn(currentPlayer: Player): void { 
    currentPlayer.hasTraded = false;
    // const stack = [];

    
    // call applyMove 
    // R,R,R,Y;8;3,18 (Trades; Nodes; Branches)
    // string AIMoveString = ai.service.getMove(board, p1, p2)
    // Move AIMove = stringToMove(AIMove: string)
    // gameboard.applyMove(AIMove);

    // make moves -- check resources 
  }

  // clickNode(event: MouseEvent) {
  //   let nodeId = event.target.id.subString(1, 1) as number;
  //   if (this.generalNodePlacement(nodeId, currentPlayer)) {
  //     let obj = { pieceType: 'N', index: nodeId };
  //     stack.push(obj);
  //   }
  // }

  // clickBranch(event: MouseEvent) {
  //   let branchId = event.target.id.subString(1, 1) as number;
  //   if (this.generalBranchPlacement(branchId, currentPlayer)) {
  //     let obj = { pieceType: 'B', index: branchId };
  //     stack.push(obj);
  //   }
  // }
  // // take back placements -- reverseNodePlacement and reverseBranchPlacement
  // clickUndo(event: MouseEvent) {
  //   let placement = stack.pop();
  //   this.undoPlacement(placement.pieceType, placement.index, currentPlayer);
  // }
  // // can call trading fuction 
  // clickTrade(event: MouseEvent) {
  //   this.makeTrade(currentPlayer);
  // }

  // // end turn button
  // clickEndTurn(event: MouseEvent) {
  //   this.endTurn(currentPlayer);
  // }

  endTurn(endPlayer: Player): void { 

    for (let i = 0; i < this.gameBoard.tiles.length; i++) {
      if (this.checkForCaptures(endPlayer, i)) {
        endPlayer.numTilesCaptured++;
      }
    }

    // empties tilesBeingChecked for next function call
    for (let i = 0; i < this.tilesBeingChecked.length; i++) {
      this.tilesBeingChecked.pop();
    }

    for (let i = 0; i < endPlayer.ownedBranches.length; i++) {
      this.checkForLongest(endPlayer, endPlayer.ownedBranches[i]);
    }

    if ((this.playerOne.currentLongest > this.playerTwo.currentLongest) && this.playerOne.hasLongestNetwork === false) {
      this.playerOne.hasLongestNetwork = true;
      this.playerOne.currentScore += 2;
      if (this.playerTwo.hasLongestNetwork === true) {
        this.playerTwo.hasLongestNetwork = false;
        this.playerTwo.currentScore -= 2;
      }
    }

    else if ((this.playerTwo.currentLongest > this.playerOne.currentLongest) && this.playerTwo.hasLongestNetwork === false) {
      this.playerTwo.hasLongestNetwork = true;
      this.playerTwo.currentScore += 2;
      if (this.playerOne.hasLongestNetwork === true) {
        this.playerOne.hasLongestNetwork = false;
        this.playerOne.currentScore -= 2;
      }
    }

    if (this.playerOne.currentScore >= 10 ||
        this.playerTwo.currentScore >= 10) {
      if (this.playerOne.currentScore > this.playerTwo.currentScore) {
        // playerOne wins (requires UI connection)
      }
      else {
        // playerTwo wins (requires UI connection)
      }
    }
    else {

      let newPlayer;

      if (endPlayer === this.playerOne){
        newPlayer = this.playerTwo;
      }
      else {
        newPlayer = this.playerOne;
      }
      // update resources for newPlayer
      newPlayer.redResources += newPlayer.redPerTurn;
      newPlayer.blueResources += newPlayer.bluePerTurn;
      newPlayer.yellowResources += newPlayer.yellowPerTurn;
      newPlayer.greenResources += newPlayer.greenPerTurn;
          
      this.nextTurn(newPlayer);
    }
  }  

  // L162 - 245 will be refactored upon integration with UI.

  makeTrade(currentPlayer: Player): void {

    const tradedResources = [];

    // if(currentPlayer.hasTraded === false)
    // {
    //   clickRed(event: MouseEvent) {
    //     if (currentPlayer.redResources > 0 && tradedResources.length <= 3) {
    //       tradedResources.push('R');
    //       currentPlayer.redResources--;
    //     }
    //   }
    //   clickBlue(event: MouseEvent) {
    //     if (currentPlayer.blueResources > 0 && tradedResources.length <= 3) {
    //       tradedResources.push('B');
    //       currentPlayer.blueResources--;
    //     }
    //   }
    //   clickYellow(event: MouseEvent) {
    //     if (currentPlayer.yellowResources > 0 && tradedResources.length <= 3) {
    //       tradedResources.push('Y');
    //       currentPlayer.yellowResources--;
    //     }
    //   }
    //   clickGreen(event: MouseEvent) {
    //     if (currentPlayer.greenResources > 0 && tradedResources.length <= 3) {
    //       tradedResources.push('G');
    //       currentPlayer.greenResources--;
    //     }
    //   }

    //   clickUndoSelectedResource(event: MouseEvent) {
    //     if (tradedResources.length > 0) {
    //       let selectedResource = event.target.id.subString(1,1) as string;
    //       let index = tradedResources.indexOf(selectedResource);
    //       if (index != -1) {
    //         tradedResources.splice(index, 1);
    //         switch (selectedResource) {
    //           case 'R':
    //             currentPlayer.redResources++;
    //             break;
    //           case 'B':
    //             currentPlayer.blueResources++;
    //             break;
    //           case 'Y':
    //             currentPlayer.yellowResources++;
    //             break;
    //           case 'G':
    //             currentPlayer.greenResources++;
    //             break;
    //           }
    //       }
    //     }  
    //   }

    //   clickTradeFor(event: MouseEvent) {
    //     if(tradedResources.length === 3) {
    //       let selectedResource = event.target.id.subString(1,1) as string;
    //       let index = tradedResources.indexOf(selectedResource);
    //       if(index === -1)
    //       {
    //         clickConfirmTrade(event: MouseEvent) {
    //           switch (selectedResource) {
    //             case 'R':
    //               currentPlayer.redResources++;
    //               break;
    //             case 'B':
    //               currentPlayer.blueResources++;
    //               break;
    //             case 'Y':
    //               currentPlayer.yellowResources++;
    //               break;
    //             case 'G':
    //               currentPlayer.greenResources++;
    //               break;
    //             }
    //         }
    //       }
    //     }
          
    //   }

    // }
  }

  undoPlacement(piece: string, index: number, currentPlayer: Player): void {
    if (piece === 'N'){
      this.reverseNodePlacement(index, currentPlayer);
    }
    else {
      this.reverseBranchPlacement(index, currentPlayer);
    }
  }
  
  // L258 - 297 will be refactored upon integration with the UI.

  makeInitialPlacements(currentPlayer: Player, legalNodeMove: boolean): void {

    // let legalBranchMove = false;
    // let nodeId;
    // let branchId;

    // if(!legalNodeMove){
    //   clickNode(event: MouseEvent) {
    //     nodeId = event.target.id.subString(1,1) as number;
    //     legalNodeMove = this.initialNodePlacements(nodeId, currentPlayer);
    //     }
    // }
    // if(legalNodeMove){
    //   clickBranch(event: MouseEvent) {
    //     branchId = event.target.id.subString(1,1) as number;
    //     legalBranchMove = this.initialBranchPlacements(nodeId, branchId, currentPlayer);
    //    }
       
    //   clickUndo(event: MouseEvent){
    //     if (legalBranchMove)
    //     {
    //       this.reverseInitialBranchPlacement(branchId, currentPlayer)
    //       legalBranchMove = false;
    //     }
    //     else {
    //       this.reverseInitialNodePlacement(nodeId, currentPlayer);
    //       legalNodeMove = false;
    //     }
    //   }

    //    if (!legalBranchMove)
    //       this.makeInitialPlacements(currentPlayer, true);
    // }
    // else{
    //     this.makeInitialPlacements(currentPlayer, false);
    // }

    // clickEndTurn (event:MouseEvent){
    //   return true;
    // }
  }

  initialNodePlacements(possibleNode:number, currentPlayer:Player): boolean { 
    if (this.gameBoard.nodes[possibleNode].getOwner() === "NONE") {

      if (this.gameBoard.nodes[possibleNode].getTopRightTile() != -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].nodeCount++;
        
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].nodeCount >
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].maxNodes) {
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].isExhausted = true;
          this.tileExhaustion(this.gameBoard.nodes[possibleNode].getTopRightTile(), true);
        }
      }

      if (this.gameBoard.nodes[possibleNode].getBottomRightTile() != -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].nodeCount++;
        
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].nodeCount >
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].maxNodes) {
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].isExhausted = true;
          this.tileExhaustion(this.gameBoard.nodes[possibleNode].getBottomRightTile(), true);
        }
      }

      if (this.gameBoard.nodes[possibleNode].getBottomLeftTile() != -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].nodeCount++;

        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].nodeCount >
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].maxNodes) {
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].isExhausted = true;
          this.tileExhaustion(this.gameBoard.nodes[possibleNode].getBottomLeftTile(), true);
        }
      }
      
      if (this.gameBoard.nodes[possibleNode].getTopLeftTile() != -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].nodeCount++;

        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].nodeCount >
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].maxNodes) {
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].isExhausted = true;
          this.tileExhaustion(this.gameBoard.nodes[possibleNode].getTopLeftTile(), true);
        }
      }

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
          this.playerOne.ownedBranches.push(possibleBranch);
        }
        else {
          this.gameBoard.branches[possibleBranch].setOwner(Owner.PLAYERTWO);
          this.playerTwo.ownedBranches.push(possibleBranch);
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

        // add to nodeCount of tiles and check for if it has been exhaused
        if (this.gameBoard.nodes[possibleNode].getTopRightTile() != -1) {
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].nodeCount++;
          
          if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].nodeCount >
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].maxNodes) {
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].isExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getTopRightTile(), true);
          }
        }

        if (this.gameBoard.nodes[possibleNode].getBottomRightTile() != -1) {
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].nodeCount++;
          
          if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].nodeCount >
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].maxNodes) {
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].isExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getBottomRightTile(), true);
          }
        }

        if (this.gameBoard.nodes[possibleNode].getBottomLeftTile() != -1) {
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].nodeCount++;

          if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].nodeCount >
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].maxNodes) {
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].isExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getBottomLeftTile(), true);
          }
        }
        
        if (this.gameBoard.nodes[possibleNode].getTopLeftTile() != -1) {
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].nodeCount++;

          if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].nodeCount >
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].maxNodes) {
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].isExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getTopLeftTile(), true);
          }
        }

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

      if (this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch('branch1')].getOwner() === branchOwner ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch('branch2')].getOwner() === branchOwner ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch('branch3')].getOwner() === branchOwner ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch('branch4')].getOwner() === branchOwner ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch('branch5')].getOwner() === branchOwner ||
      this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch('branch6')].getOwner() === branchOwner) {

        if (currentPlayer == this.playerOne) {
    
          this.gameBoard.branches[possibleBranch].setOwner(Owner.PLAYERONE);
          this.playerOne.ownedBranches.push(possibleBranch);
          this.playerOne.redResources--;
          this.playerOne.blueResources--;
        }

        else {
          this.gameBoard.branches[possibleBranch].setOwner(Owner.PLAYERTWO);
          this.playerTwo.ownedBranches.push(possibleBranch);
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

    if (this.gameBoard.nodes[reverseNode].getTopRightTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].nodeCount--;
      
      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].isExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getTopRightTile(), false);
        }
      }
    }
    
    if (this.gameBoard.nodes[reverseNode].getTopLeftTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].nodeCount--;

      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].isExhausted) {
        
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getTopLeftTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getBottomRightTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].nodeCount--;

      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].isExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getBottomRightTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getBottomLeftTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].nodeCount--;

      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].isExhausted) {
        
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getBottomLeftTile(), false);
        }
      }
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

    if (this.gameBoard.nodes[reverseNode].getTopRightTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].nodeCount--;
      
      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].isExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getTopRightTile(), false);
        }
      }
    }
    
    if (this.gameBoard.nodes[reverseNode].getTopLeftTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].nodeCount--;

      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].isExhausted) {
        
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getTopLeftTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getBottomRightTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].nodeCount--;

      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].isExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getBottomRightTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getBottomLeftTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].nodeCount--;

      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].isExhausted) {
        
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getBottomLeftTile(), false);
        }
      }
    }
  }

  reverseBranchPlacement(reverseBranch: number, currentPlayer: Player): void {
    this.gameBoard.branches[reverseBranch].setOwner(Owner.NONE);
    if (currentPlayer === this.playerOne) {
      this.playerOne.ownedBranches.pop();
      this.playerOne.redResources++;
      this.playerOne.blueResources++;
    }
    else {
      this.playerTwo.ownedBranches.pop();
      this.playerTwo.redResources++;
      this.playerTwo.blueResources++;
    }
  }

  reverseInitialBranchPlacement(reverseBranch: number, currentPlayer: Player): void {
    this.gameBoard.branches[reverseBranch].setOwner(Owner.NONE);
    if (currentPlayer == this.playerOne) {
      this.playerOne.ownedBranches.pop();
    }
    else {
      this.playerTwo.ownedBranches.pop();
    }
    
  }   

  tileExhaustion(tileNum: number, setAsExhausted: boolean): void {
    // check for whichever nodes are already on the tile and decrement their *color*PerTurn
    const currentTileColor = this.gameBoard.tiles[tileNum].color;
    let functionName;
    if (setAsExhausted){
      // gonna disable ESLint here and assume this works
      // eslint-disable-next-line @typescript-eslint/unbound-method
      functionName = this.decrementResource;
    }
    else{
      // eslint-disable-next-line @typescript-eslint/unbound-method
      functionName = this.incrementResource;
    }
    
    if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getTopRightNode()].getOwner() === Owner.PLAYERONE) {
      functionName(this.playerOne, currentTileColor);
    }
    else if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getTopRightNode()].getOwner() === Owner.PLAYERTWO) {
      functionName(this.playerTwo, currentTileColor);
    }

    if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getBottomRightNode()].getOwner() === Owner.PLAYERONE) {
      functionName(this.playerOne, currentTileColor);
    }
    else if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getBottomRightNode()].getOwner() === Owner.PLAYERTWO) {
      functionName( this.playerTwo, currentTileColor);
    }

    if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getBottomLeftNode()].getOwner() === Owner.PLAYERONE) {
      functionName(this.playerOne, currentTileColor);
    }
    else if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getBottomLeftNode()].getOwner() === Owner.PLAYERTWO) {
      functionName(this.playerTwo, currentTileColor);
    }
    
    if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getTopLeftNode()].getOwner() === Owner.PLAYERONE) {
      functionName(this.playerOne, currentTileColor);
    }
    else if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getTopLeftNode()].getOwner() === Owner.PLAYERTWO) {
      functionName(this.playerTwo, currentTileColor);
    }
  }

  decrementResource(nodeOwner: Player, currentTileColor: TileColor): void {
    switch (currentTileColor){
      case TileColor.RED:
        nodeOwner.redPerTurn--;
        break;
      case TileColor.BLUE:
        nodeOwner.bluePerTurn--;
        break;
      case TileColor.YELLOW:
        nodeOwner.yellowPerTurn--;
        break;
      case TileColor.GREEN:
        nodeOwner.greenPerTurn--;
        break;
    }
  }

  incrementResource(nodeOwner: Player, currentTileColor: TileColor): void {
    switch (currentTileColor){
      case TileColor.RED:
        nodeOwner.redPerTurn++;
        break;
      case TileColor.BLUE:
        nodeOwner.bluePerTurn++;
        break;
      case TileColor.YELLOW:
        nodeOwner.yellowPerTurn++;
        break;
      case TileColor.GREEN:
        nodeOwner.greenPerTurn++;
        break;
    }
  }

  checkForLongest(branchOwner: Player, currentBranch: number): void {

    branchOwner.branchScanner.push(currentBranch);
    branchOwner.currentLength++;
    
    if (branchOwner.currentLength > branchOwner.currentLongest) {
      branchOwner.currentLongest = branchOwner.currentLength;
    }

    const branch1Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch1')].getOwner();
    const branch2Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch2')].getOwner();
    const branch3Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch3')].getOwner();
    const branch4Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch4')].getOwner();
    const branch5Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch5')].getOwner();
    const branch6Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch6')].getOwner();

    if (branchOwner === this.playerOne) {

      if (branch1Owner === "PLAYERONE") {
        this.checkForLongest(branchOwner, Number(this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch1')]));
      }
      if (branch2Owner === "PLAYERONE") {
        this.checkForLongest(branchOwner, Number(this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch2')]));
      }
      if (branch3Owner === "PLAYERONE") {
        this.checkForLongest(branchOwner, Number(this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch3')]));
      }
      if (branch4Owner === "PLAYERONE") {
        this.checkForLongest(branchOwner, Number(this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch4')]));
      }
      if (branch5Owner === "PLAYERONE") {
        this.checkForLongest(branchOwner, Number(this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch5')]));
      }
      if (branch6Owner === "PLAYERONE") {
        this.checkForLongest(branchOwner, Number(this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch6')]));
      }
    }

    else {
      if (branch1Owner === "PLAYERTWO") {
        this.checkForLongest(branchOwner, Number(this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch1')]));
      }
      if (branch2Owner === "PLAYERTWO") {
        this.checkForLongest(branchOwner, Number(this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch2')]));
      }
      if (branch3Owner === "PLAYERTWO") {
        this.checkForLongest(branchOwner, Number(this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch3')]));
      }
      if (branch4Owner === "PLAYERTWO") {
        this.checkForLongest(branchOwner, Number(this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch4')]));
      }
      if (branch5Owner === "PLAYERTWO") {
        this.checkForLongest(branchOwner, Number(this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch5')]));
      }
      if (branch6Owner === "PLAYERTWO") {
        this.checkForLongest(branchOwner, Number(this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch6')]));
      }
    }

    branchOwner.branchScanner.pop();
  }

  checkForCaptures(capturer: Player, checkTile: number): boolean {

    let captured = true;

    // prevents infinite recursion
    if (this.tilesBeingChecked.includes(checkTile)) {
      return captured;
    }

    let currentPlayer;
    let otherPlayer;

    const currentTile = this.gameBoard.tiles[checkTile];
    const tileTopBranch = this.gameBoard.branches[currentTile.getTopBranch()];
    const tileRightBranch = this.gameBoard.branches[currentTile.getRightBranch()];
    const tileBottomBranch = this.gameBoard.branches[currentTile.getBottomBranch()];
    const tileLeftBranch = this.gameBoard.branches[currentTile.getLeftBranch()];

    if (capturer === this.playerOne) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      currentPlayer = "PLAYERONE";
      otherPlayer = "PLAYERTWO";
    }
    else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      currentPlayer = "PLAYERTWO";
      otherPlayer = "PLAYERONE";
    }

    // checks first instant fail condition: opponent has claimed any branches surrounding tile being checked
    if (tileTopBranch.getOwner() === otherPlayer ||
             tileRightBranch.getOwner() === otherPlayer ||
             tileBottomBranch.getOwner() === otherPlayer ||
             tileLeftBranch.getOwner() === otherPlayer) {
      captured = false;
    }
    // checks second instant fail condition: no other tile present next to one of current tile's empty-branch sides
    else if ((tileTopBranch.getOwner() === "NONE" && currentTile.getTopTile() === -1 ) ||
             (tileRightBranch.getOwner() === "NONE" && currentTile.getRightTile() === -1 ) ||
             (tileBottomBranch.getOwner() === "NONE" && currentTile.getBottomTile() === -1 ) ||
             (tileLeftBranch.getOwner() === "NONE" && currentTile.getLeftTile() === -1 )) {
      captured = false;
    }
    // begins recursive calls checking for multi-tile capture
    else {
      this.tilesBeingChecked.push(checkTile);

      if (tileTopBranch.getOwner() === "NONE") {
        if (this.checkForCaptures(capturer, currentTile.getTopTile()) === false) {
          captured = false;
        }
      }
      if (tileRightBranch.getOwner() === "NONE") {
        if (this.checkForCaptures(capturer, currentTile.getRightTile()) === false) {
          captured = false;
        }
      }
      if (tileBottomBranch.getOwner() === "NONE") {
        if (this.checkForCaptures(capturer, currentTile.getBottomTile()) === false) {
          captured = false;
        }
      }
      if (tileLeftBranch.getOwner() === "NONE") {
        if (this.checkForCaptures(capturer, currentTile.getLeftTile()) === false) {
          captured = false;
        }
      }
   
    }
    return captured;
  }
}
