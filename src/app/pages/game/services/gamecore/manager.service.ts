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

  private gameBoard: GameBoard;
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

    // update resources for newPlayer
    currentPlayer.redResources += currentPlayer.redPerTurn;
    currentPlayer.blueResources += currentPlayer.bluePerTurn;
    currentPlayer.yellowResources += currentPlayer.yellowPerTurn;
    currentPlayer.greenResources += currentPlayer.greenPerTurn;
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

    let otherPlayer;
    let otherOwner;
    let currentOwner;

    if (endPlayer === this.playerOne) {
      otherPlayer = this.playerTwo;
      otherOwner = "PLAYERTWO";
      currentOwner = "PLAYERONE";
    }
    else {
      otherPlayer = this.playerOne;
      otherOwner = "PLAYERONE";
      currentOwner = "PLAYERTWO";
    }
      
    
    for (let i = 0; i < this.gameBoard.tiles.length; i++) {
      const currentTileOwner = this.gameBoard.tiles[i].capturedBy;
      if (this.checkForCaptures(endPlayer, i) === true) {
        if (this.gameBoard.tiles[i].activelyExhausted)
        {
          this.gameBoard.tiles[i].activelyExhausted = false;
          
          const currentTileColor = this.gameBoard.tiles[i].getColor();
          
          // if new owner has nodes, give them resources per turn
          const trNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getTopRightNode()]; 
          const brNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getBottomRightNode()];
          const blNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getBottomLeftNode()];
          const tlNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getTopLeftNode()];

          if (trNode.getOwner() === currentOwner) {
            this.incrementResource(endPlayer, currentTileColor);
          }
          if (brNode.getOwner() === currentOwner) {
            this.incrementResource(endPlayer, currentTileColor);
          }
          if (blNode.getOwner() === currentOwner) {
            this.incrementResource(endPlayer, currentTileColor);
          }
          if (tlNode.getOwner() === currentOwner) {
            this.incrementResource(endPlayer, currentTileColor);
          }
        }
        endPlayer.numTilesCaptured++;
      }
      else {
        // allows for reversing of captured tiles to exhausted tile state
        if(this.gameBoard.tiles[i].capturedBy != otherOwner) {
          this.gameBoard.tiles[i].setCapturedBy("NONE");  // <-------------------------------------------------------------------------------------------FIXME: absolutely no idea
          if (this.gameBoard.tiles[i].capturedBy != currentTileOwner) {
            endPlayer.currentScore--;
            if (this.gameBoard.tiles[i].passivelyExhausted){
              this.gameBoard.tiles[i].activelyExhausted = true;
              // check if the currentTileOwner had nodes, decrement the resources per turn
              const currentTileColor = this.gameBoard.tiles[i].getColor();
              
              const trNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getTopRightNode()]; 
              const brNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getBottomRightNode()];
              const blNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getBottomLeftNode()];
              const tlNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getTopLeftNode()];

              if (trNode.getOwner() === currentOwner) {
                this.decrementResource(endPlayer, currentTileColor);
              }
              if (brNode.getOwner() === currentOwner) {
                this.decrementResource(endPlayer, currentTileColor);
              }
              if (blNode.getOwner() === currentOwner) {
                this.decrementResource(endPlayer, currentTileColor);
              }
              if (tlNode.getOwner() === currentOwner) {
                this.decrementResource(endPlayer, currentTileColor);
              }
            }
          }
        } 
      }
    }

    for (let i = 0; i < this.gameBoard.tiles.length; i++) {
      if (this.gameBoard.tiles[i].capturedBy != "NONE" && this.gameBoard.tiles[i].activelyExhausted == true) {
        this.gameBoard.tiles[i].activelyExhausted = false;
      }
      else if (this.gameBoard.tiles[i].capturedBy == "NONE" && this.gameBoard.tiles[i].passivelyExhausted == true) {
        this.gameBoard.tiles[i].activelyExhausted = true;
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

    let otherOwner;

    if (currentPlayer === this.playerOne) {
      otherOwner = "PLAYERTWO";
    }
    else {
      otherOwner = "PLAYERONE";
    }

    if (this.gameBoard.nodes[possibleNode].getOwner() === "NONE") {

      if (this.gameBoard.nodes[possibleNode].getTopRightTile() != -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].nodeCount++;
        
        if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].nodeCount >
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].maxNodes) &&
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].passivelyExhausted == false) {

          // checking if tile is captured to set activelyExhausted and decrement tiles in tileExhaustion
          if(this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].capturedBy == "NONE")
          {         
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].activelyExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getTopRightTile(), true);
          }
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].passivelyExhausted = true;
        }
        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].activelyExhausted === false &&
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].capturedBy != otherOwner)
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].getColor());
      }

      if (this.gameBoard.nodes[possibleNode].getBottomRightTile() != -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].nodeCount++;
        
        if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].nodeCount >
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].maxNodes) &&
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].passivelyExhausted == false) {

          // checking if tile is captured to set activelyExhausted and decrement tiles in tileExhaustion
          if(this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].capturedBy == "NONE") {
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].activelyExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getBottomRightTile(), true);
          }   
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].passivelyExhausted = true;
        }
        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].activelyExhausted === false &&
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].capturedBy != otherOwner)
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].getColor());
      }

      if (this.gameBoard.nodes[possibleNode].getBottomLeftTile() != -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].nodeCount++;

        if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].nodeCount >
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].maxNodes) && 
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].passivelyExhausted == false) {
          
          // checking if tile is captured to set activelyExhausted and decrement tiles in tileExhaustion
          if(this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].capturedBy == "NONE"){
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].activelyExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getBottomLeftTile(), true);
          }
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].passivelyExhausted = true;
        }
        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].activelyExhausted === false &&
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].capturedBy != otherOwner)
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].getColor());
      }
      
      if (this.gameBoard.nodes[possibleNode].getTopLeftTile() != -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].nodeCount++;

        if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].nodeCount >
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].maxNodes) &&
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].passivelyExhausted == false) {
            
          // checking if tile is captured to set activelyExhausted and decrement tiles in tileExhaustion
          if(this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].capturedBy == "NONE") {
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].activelyExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getTopLeftTile(), true);
          }
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].passivelyExhausted = true;
        }
        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].activelyExhausted === false &&
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].capturedBy != otherOwner)
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].getColor());
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

    if (currentPlayer.greenResources < 2 || currentPlayer.yellowResources < 2) {
      return false;
    }

    if (this.gameBoard.nodes[possibleNode].getOwner() === "NONE") {

      let nodeOwner;
      let otherOwner;
      if (currentPlayer === this.playerOne) {
        nodeOwner = "PLAYERONE";
        otherOwner = "PLAYERTWO";
      }
      else {
        nodeOwner = "PLAYERTWO";
        otherOwner = "PLAYERONE";
      }
        

      if (this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getTopBranch()].getOwner() === nodeOwner ||
      this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getLeftBranch()].getOwner() === nodeOwner ||
      this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getBottomBranch()].getOwner() === nodeOwner ||
      this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getRightBranch()].getOwner() === nodeOwner) {

        // add to nodeCount of tiles and check for if it has been exhaused
        if (this.gameBoard.nodes[possibleNode].getTopRightTile() != -1) {
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].nodeCount++;
          
          if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].nodeCount >
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].maxNodes) &&
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].passivelyExhausted == false) {
            // checking if tile is captured to set activelyExhausted and decrement tiles in tileExhaustion
            if(this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].capturedBy == "NONE")
            {         
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].activelyExhausted = true;
              this.tileExhaustion(this.gameBoard.nodes[possibleNode].getTopRightTile(), true);
            }
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].passivelyExhausted = true;
          }
          // checks for if resource productions ought to be incremented
          if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].activelyExhausted === false &&
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].capturedBy != otherOwner) {
            this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].getColor());
          }
        }

        if (this.gameBoard.nodes[possibleNode].getBottomRightTile() != -1) {
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].nodeCount++;
          
          if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].nodeCount >
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].maxNodes) &&
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].passivelyExhausted == false) {
            
            // checking if tile is captured to set activelyExhausted and decrement tiles in tileExhaustion
            if(this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].capturedBy == "NONE") {
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].activelyExhausted = true;
              this.tileExhaustion(this.gameBoard.nodes[possibleNode].getBottomRightTile(), true); 
            }   
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].passivelyExhausted = true;
          }
        }
        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].activelyExhausted === false &&
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].capturedBy != otherOwner) {
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].getColor());
        }
      }

      if (this.gameBoard.nodes[possibleNode].getBottomLeftTile() != -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].nodeCount++;

        if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].nodeCount >
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].maxNodes) &&
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].passivelyExhausted == false) {

          // checking if tile is captured to set activelyExhausted and decrement tiles in tileExhaustion
          if(this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].capturedBy == "NONE"){
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].activelyExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getBottomLeftTile(), true);
          }
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].passivelyExhausted = true;
        }
        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].activelyExhausted === false &&
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].capturedBy != otherOwner) {
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].getColor());
        }
      }
        
      if (this.gameBoard.nodes[possibleNode].getTopLeftTile() != -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].nodeCount++;

        if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].nodeCount >
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].maxNodes) &&
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].passivelyExhausted == false) {
                
          // checking if tile is captured to set activelyExhausted and decrement tiles in tileExhaustion
          if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].capturedBy == "NONE") {
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].activelyExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getTopLeftTile(), true);
          }
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].passivelyExhausted = true;
        }
        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].activelyExhausted === false &&
                  this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].capturedBy != otherOwner) {
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].getColor());
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
        

  generalBranchPlacement(possibleBranch:number, currentPlayer:Player): boolean {

    if (currentPlayer.redResources < 1 || currentPlayer.blueResources < 1) {
      return false;
    }

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
      
      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].passivelyExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].activelyExhausted = false;
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].passivelyExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getTopRightTile(), false);
        }
      }
    }
    
    if (this.gameBoard.nodes[reverseNode].getTopLeftTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].nodeCount--;

      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].passivelyExhausted) {
        
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].activelyExhausted = false;
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].passivelyExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getTopLeftTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getBottomRightTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].nodeCount--;

      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].passivelyExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].activelyExhausted = false;
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].passivelyExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getBottomRightTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getBottomLeftTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].nodeCount--;

      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].passivelyExhausted) {
        
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].activelyExhausted = false;
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].passivelyExhausted = false;
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
      
      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].passivelyExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].activelyExhausted = false;
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].passivelyExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getTopRightTile(), false);
        }
      }
    }
    
    if (this.gameBoard.nodes[reverseNode].getTopLeftTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].nodeCount--;

      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].passivelyExhausted) {
        
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].activelyExhausted = false;
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].passivelyExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getTopLeftTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getBottomRightTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].nodeCount--;

      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].passivelyExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].activelyExhausted = false;
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].passivelyExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getBottomRightTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getBottomLeftTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].nodeCount--;

      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].passivelyExhausted) {
        
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].nodeCount <=
              this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].maxNodes)
        {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].activelyExhausted = false;
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].passivelyExhausted = false;
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
        if (nodeOwner.redPerTurn > 0)
          nodeOwner.redPerTurn--;
        break;
      case TileColor.BLUE:
        if (nodeOwner.bluePerTurn > 0)
          nodeOwner.bluePerTurn--;
        break;
      case TileColor.YELLOW:
        if (nodeOwner.redPerTurn > 0)
          nodeOwner.yellowPerTurn--;
        break;
      case TileColor.GREEN:
        if (nodeOwner.greenPerTurn > 0)
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

    if (branchOwner.branchScanner.includes(currentBranch) === false) {
      return;
    }
    
    branchOwner.branchScanner.push(currentBranch);
    branchOwner.currentLength++;

    let branch1Owner = "NONE"; 
    let branch2Owner = "NONE"; 
    let branch3Owner = "NONE"; 
    let branch4Owner = "NONE";
    let branch5Owner = "NONE";
    let branch6Owner = "NONE";
    
    if (branchOwner.currentLength > branchOwner.currentLongest) {
      branchOwner.currentLongest = branchOwner.currentLength;
    }

    if (this.gameBoard.branches[currentBranch].getBranch(1) != -1) {
      branch1Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch(1)].getOwner();
    }

    if (this.gameBoard.branches[currentBranch].getBranch(2) != -1) {
      branch2Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch(2)].getOwner();
    }
    
    if (this.gameBoard.branches[currentBranch].getBranch(3) != -1) {
      branch3Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch(3)].getOwner();
    }

    if (this.gameBoard.branches[currentBranch].getBranch(4) != -1) {
      branch4Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch(4)].getOwner();
    }

    if (this.gameBoard.branches[currentBranch].getBranch(5) != -1) {
      branch5Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch(5)].getOwner();
    }
    
    if (this.gameBoard.branches[currentBranch].getBranch(6) != -1) {
      branch6Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch(6)].getOwner();
    }
    
    if (branchOwner === this.playerOne) {

      if (branch1Owner === "PLAYERONE") {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch(1));
      }
      if (branch2Owner === "PLAYERONE") {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch(2));
      }
      if (branch3Owner === "PLAYERONE") {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch(3));
      }
      if (branch4Owner === "PLAYERONE") {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch(4));
      }
      if (branch5Owner === "PLAYERONE") {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch(5));
      }
      if (branch6Owner === "PLAYERONE") {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch(6));
      }
    }

    else {
      if (branch1Owner === "PLAYERTWO") {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch(1));
      }
      if (branch2Owner === "PLAYERTWO") {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch(2));
      }
      if (branch3Owner === "PLAYERTWO") {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch(3));
      }
      if (branch4Owner === "PLAYERTWO") {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch(4));
      }
      if (branch5Owner === "PLAYERTWO") {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch(5));
      }
      if (branch6Owner === "PLAYERTWO") {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch(6));
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
