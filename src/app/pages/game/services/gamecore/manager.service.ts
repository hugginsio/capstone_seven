import { Injectable } from '@angular/core';
import { GameType, Owner, PlayerType, TileColor } from '../../enums/game.enums';

import { GameBoard } from '../../classes/gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';
import { Subject } from 'rxjs';
import { CommPackage } from '../../interfaces/game.interface';
import { CommCode } from '../../interfaces/game.enum';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private gameBoard: GameBoard;
  private playerOne: Player;
  private playerTwo: Player;
  private gameType: GameType;
  private currentPlayer: Owner;
  private tilesBeingChecked: number[];

  public readonly commLink = new Subject<CommPackage>();

  constructor(
    private readonly storageService: LocalStorageService
  ) {
    this.gameBoard = new GameBoard();
    this.playerOne = new Player();
    this.playerTwo = new Player();
    this.currentPlayer = Owner.PLAYERONE;
    this.tilesBeingChecked = [];

    this.storageService.setContext('game');
    const gameMode = this.storageService.fetch('mode');
    this.playerOne.type = PlayerType.HUMAN;
    if (gameMode === 'pvp') {
      this.playerTwo.type = PlayerType.HUMAN;
    } else if (gameMode === 'pva') {
      this.playerTwo.type = PlayerType.AI;
    } else {
      this.playerTwo.type = PlayerType.NETWORK;
    }
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer === Owner.PLAYERONE ? this.playerOne : this.playerTwo;
  }

  getIdlePlayer(): Player {
    return this.currentPlayer === Owner.PLAYERONE ? this.playerTwo : this.playerOne;
  }

  getPlayerOne(): Player {
    return this.playerOne;
  }

  getPlayerTwo(): Player {
    return this.playerTwo;
  }

  getCurrentPlayerEnum(): Owner {
    // console.warn(this.currentPlayer);
    return this.currentPlayer;
  }

  // updatePlayer

  getBoard(): GameBoard {
    return this.gameBoard;
  }

  createBoard(random: boolean, boardString = "empty"): void {
    if (random) {
      this.gameBoard.randomizeColorsAndMaxNodes();
    } else {
      // let user enter tile placement 
      let boardStringArray = [];
      boardStringArray = boardString.split('X');

      for (let i = 0; i < boardStringArray.length; i++) {
        // assigns tile colors
        switch (boardStringArray[i].substring(0, 1)) {
          case 'R':
            this.gameBoard.tiles[i].color = TileColor.RED;
            break;
          case 'B':
            this.gameBoard.tiles[i].color = TileColor.BLUE;
            break;
          case 'Y':
            this.gameBoard.tiles[i].color = TileColor.YELLOW;
            break;
          case 'G':
            this.gameBoard.tiles[i].color = TileColor.GREEN;
            break;
          case '0':
            this.gameBoard.tiles[i].color = TileColor.BLANK;
            break;
        }
        // assigns tile node limits
        switch (boardStringArray[i].substring(1)) {
          case "1":
            this.gameBoard.tiles[i].maxNodes = 1;
            break;
          case "2":
            this.gameBoard.tiles[i].maxNodes = 2;
            break;
          case "3":
            this.gameBoard.tiles[i].maxNodes = 3;
            break;
          case "0":
            this.gameBoard.tiles[i].maxNodes = 0;
            break;
        }
      }
    }
  }

  startGame(gameType: GameType, playerNum = 0): void {
    // assigns human/ai roles in AI game
    if (this.gameType === GameType.AI) {
      if (playerNum == 1) {
        this.playerTwo.type = PlayerType.AI;
        this.playerOne.type = PlayerType.HUMAN;
      } else if (playerNum == 2) {
        this.playerOne.type = PlayerType.AI;
        this.playerTwo.type = PlayerType.HUMAN;
      }
    }

    // <-------------------------------------------------------------------------------------------------------FIXME: need to assign p1, p2, & GameType for networking game 

    // this.makeInitialPlacements(this.playerOne, false);
    // this.makeInitialPlacements(this.playerTwo, false);
    // this.makeInitialPlacements(this.playerTwo, false);
    // this.makeInitialPlacements(this.playerOne, false);

    // this.endTurn(this.playerOne); 
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

    // Set resources if still opening moves
    if (currentPlayer.numNodesPlaced < 2 && currentPlayer.ownedBranches.length < 2) {
      currentPlayer.redResources = 1;
      currentPlayer.blueResources = 1;
      currentPlayer.yellowResources = 2;
      currentPlayer.greenResources = 2;
    }

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
    const otherPlayer = endPlayer === this.playerOne ? this.playerTwo : this.playerOne;
    const otherOwner = endPlayer === this.playerOne ? Owner.PLAYERTWO : Owner.PLAYERONE;
    const currentOwner = endPlayer === this.playerOne ? Owner.PLAYERONE : Owner.PLAYERTWO;

    for (let i = 0; i < this.gameBoard.tiles.length; i++) {
      if (this.checkForCaptures(endPlayer, i) === true) {
        this.gameBoard.tiles[i].setCapturedBy(currentOwner);

        // if new owner has nodes, give them resources per turn
        const trNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getTopRightNode()];
        const brNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getBottomRightNode()];
        const blNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getBottomLeftNode()];
        const tlNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getTopLeftNode()];

        const currentTileColor = this.gameBoard.tiles[i].getColor();

        if (this.gameBoard.tiles[i].isExhausted) {
          this.gameBoard.tiles[i].isExhausted = false;

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
        } else {
          if (trNode.getOwner() === otherOwner) {
            this.decrementResource(otherPlayer, currentTileColor);
          }

          if (brNode.getOwner() === otherOwner) {
            this.decrementResource(otherPlayer, currentTileColor);
          }

          if (blNode.getOwner() === otherOwner) {
            this.decrementResource(otherPlayer, currentTileColor);
          }

          if (tlNode.getOwner() === otherOwner) {
            this.decrementResource(otherPlayer, currentTileColor);
          }
        }

        endPlayer.numTilesCaptured++;
        endPlayer.currentScore++;
        endPlayer.capturedTiles.push(i);
      }

      // empty tilesBeingChecked before looping
      this.tilesBeingChecked.splice(0, this.tilesBeingChecked.length);
    }

    // empties tilesBeingChecked for next function call
    this.tilesBeingChecked.splice(0, this.tilesBeingChecked.length);

    for (let i = 0; i < endPlayer.ownedBranches.length; i++) {
      endPlayer.currentLength = 0;
      endPlayer.branchScanner = [];
    
      this.checkForLongest(endPlayer, endPlayer.ownedBranches[i]);      
    }

    // updates scores and player data regarding hasLongestNetwork
    if ((this.playerOne.currentLongest > this.playerTwo.currentLongest) && this.playerOne.hasLongestNetwork === false) {
      this.playerOne.hasLongestNetwork = true;
      this.playerOne.currentScore += 2;
      if (this.playerTwo.hasLongestNetwork === true) {
        this.playerTwo.hasLongestNetwork = false;
        this.playerTwo.currentScore -= 2;
      }
    } else if ((this.playerTwo.currentLongest > this.playerOne.currentLongest) && this.playerTwo.hasLongestNetwork === false) {
      this.playerTwo.hasLongestNetwork = true;
      this.playerTwo.currentScore += 2;
      if (this.playerOne.hasLongestNetwork === true) {
        this.playerOne.hasLongestNetwork = false;
        this.playerOne.currentScore -= 2;
      }
    } else if (this.playerOne.currentLongest === this.playerTwo.currentLongest) {
      if (this.playerOne.hasLongestNetwork === true) {
        this.playerOne.hasLongestNetwork = false;
        this.playerOne.currentScore -= 2;
      } else if (this.playerTwo.hasLongestNetwork === true) {
        this.playerTwo.hasLongestNetwork = false;
        this.playerTwo.currentScore -= 2;
      }
    }

    if (this.playerOne.currentScore >= 10 || this.playerTwo.currentScore >= 10) {
      if (this.playerOne.currentScore > this.playerTwo.currentScore) {
        this.commLink.next({ code: CommCode.END_GAME, player: this.playerOne, magic: 'Player One' });
      } else {
        this.commLink.next({ code: CommCode.END_GAME, player: this.playerTwo, magic: 'Player Two' });
      }
    } else {
      const newPlayer = endPlayer === this.playerOne ? this.playerTwo : this.playerOne;
      this.currentPlayer = endPlayer === this.playerOne ? Owner.PLAYERTWO : Owner.PLAYERONE;

      // update resources for newPlayer
      newPlayer.redResources += newPlayer.redPerTurn;
      newPlayer.blueResources += newPlayer.bluePerTurn;
      newPlayer.yellowResources += newPlayer.yellowPerTurn;
      newPlayer.greenResources += newPlayer.greenPerTurn;

      // Set resources if still opening moves
      if (endPlayer.numNodesPlaced < 2 && endPlayer.ownedBranches.length < 2) {
        endPlayer.redResources = 1;
        endPlayer.blueResources = 1;
        endPlayer.yellowResources = 2;
        endPlayer.greenResources = 2;
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
    if (piece === 'N') {
      this.reverseNodePlacement(index, currentPlayer);
    } else {
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

  initialNodePlacements(possibleNode: number, currentPlayer: Player): boolean {
    const otherOwner = currentPlayer === this.playerOne ? Owner.PLAYERONE : Owner.PLAYERTWO;

    if (this.gameBoard.nodes[possibleNode].getOwner() === Owner.NONE) {
      if (this.gameBoard.nodes[possibleNode].getTopRightTile() !== -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].nodeCount++;

        if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].nodeCount >
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].maxNodes) &&
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].isExhausted === false) {
          // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
          if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].capturedBy === Owner.NONE) {
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].isExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getTopRightTile(), true);
          }
        }

        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].isExhausted === false &&
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].getColor());
        }
      }

      if (this.gameBoard.nodes[possibleNode].getBottomRightTile() !== -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].nodeCount++;

        if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].nodeCount >
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].maxNodes) &&
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].isExhausted === false) {
          // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
          if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].capturedBy === Owner.NONE) {
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].isExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getBottomRightTile(), true);
          }
        }
        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].isExhausted === false &&
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].capturedBy !== otherOwner)
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].getColor());
      }

      if (this.gameBoard.nodes[possibleNode].getBottomLeftTile() !== -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].nodeCount++;

        if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].nodeCount >
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].maxNodes) &&
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].isExhausted === false) {
          // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
          if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].capturedBy === Owner.NONE) {
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].isExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getBottomLeftTile(), true);
          }
        }

        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].isExhausted === false &&
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].getColor());
        }
      }

      if (this.gameBoard.nodes[possibleNode].getTopLeftTile() != -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].nodeCount++;

        if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].nodeCount >
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].maxNodes) &&
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].isExhausted === false) {

          // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
          if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].capturedBy === Owner.NONE) {
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].isExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getTopLeftTile(), true);
          }
        }
        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].isExhausted === false &&
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].getColor());
        }
      }

      if (currentPlayer == this.playerOne) {
        this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERONE);
        this.playerOne.numNodesPlaced++;
        this.playerOne.currentScore++;

      } else {
        this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERTWO);
        this.playerTwo.numNodesPlaced++;
        this.playerTwo.currentScore++;

      }

      return true;
    } else {
      return false;
    }
  }

  initialBranchPlacements(selectedNode: number, possibleBranch: number, currentPlayer: Player): boolean {
    if (this.gameBoard.branches[possibleBranch].getOwner() === Owner.NONE) {
      if (this.gameBoard.nodes[selectedNode].getTopBranch() === possibleBranch ||
        this.gameBoard.nodes[selectedNode].getLeftBranch() === possibleBranch ||
        this.gameBoard.nodes[selectedNode].getBottomBranch() === possibleBranch ||
        this.gameBoard.nodes[selectedNode].getRightBranch() === possibleBranch
      ) {
        if (currentPlayer == this.playerOne) {
          this.gameBoard.branches[possibleBranch].setOwner(Owner.PLAYERONE);
          this.playerOne.ownedBranches.push(possibleBranch);
        } else {
          this.gameBoard.branches[possibleBranch].setOwner(Owner.PLAYERTWO);
          this.playerTwo.ownedBranches.push(possibleBranch);
        }

        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  generalNodePlacement(possibleNode: number, currentPlayer: Player): boolean {
    if (currentPlayer.greenResources < 2 || currentPlayer.yellowResources < 2) {
      return false;
    }

    if (this.gameBoard.nodes[possibleNode].getOwner() === Owner.NONE) {
      const nodeOwner = currentPlayer === this.playerOne ? Owner.PLAYERONE : Owner.PLAYERTWO;
      const otherOwner = currentPlayer === this.playerOne ? Owner.PLAYERTWO : Owner.PLAYERONE;


      if (this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getTopBranch()].getOwner() === nodeOwner ||
        this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getLeftBranch()].getOwner() === nodeOwner ||
        this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getBottomBranch()].getOwner() === nodeOwner ||
        this.gameBoard.branches[this.gameBoard.nodes[possibleNode].getRightBranch()].getOwner() === nodeOwner) {

        // add to nodeCount of tiles and check for if it has been exhaused
        if (this.gameBoard.nodes[possibleNode].getTopRightTile() != -1) {
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].nodeCount++;

          if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].nodeCount >
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].maxNodes) &&
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()]?.isExhausted === false) {
            // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
            if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].capturedBy === Owner.NONE) {
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].isExhausted = true;
              this.tileExhaustion(this.gameBoard.nodes[possibleNode].getTopRightTile(), true);
            }
          }

          // checks for if resource productions ought to be incremented
          if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()]?.isExhausted === false &&
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].capturedBy !== otherOwner) {
            this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopRightTile()].getColor());
          }
        }

        if (this.gameBoard.nodes[possibleNode].getBottomRightTile() != -1) {
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].nodeCount++;

          if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].nodeCount >
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].maxNodes) &&
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()]?.isExhausted === false) {

            // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
            if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].capturedBy === Owner.NONE) {
              this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].isExhausted = true;
              this.tileExhaustion(this.gameBoard.nodes[possibleNode].getBottomRightTile(), true);
            }
          }
        }

        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()]?.isExhausted === false &&
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomRightTile()].getColor());
        }
      }

      if (this.gameBoard.nodes[possibleNode].getBottomLeftTile() != -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].nodeCount++;

        if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].nodeCount >
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].maxNodes) &&
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()]?.isExhausted === false) {

          // checking if tile is captured to set activelyExhausted and decrement tiles in tileExhaustion
          if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].capturedBy === Owner.NONE) {
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].isExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getBottomLeftTile(), true);
          }
        }
        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()]?.isExhausted === false &&
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].capturedBy != otherOwner) {
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getBottomLeftTile()].getColor());
        }
      }

      if (this.gameBoard.nodes[possibleNode].getTopLeftTile() != -1) {
        this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].nodeCount++;

        if ((this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].nodeCount >
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].maxNodes) &&
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()]?.isExhausted === false) {

          // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
          if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].capturedBy === Owner.NONE) {
            this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].isExhausted = true;
            this.tileExhaustion(this.gameBoard.nodes[possibleNode].getTopLeftTile(), true);
          }
        }
        // checks for if resource productions ought to be incremented
        if (this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()]?.isExhausted === false &&
          this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, this.gameBoard.tiles[this.gameBoard.nodes[possibleNode].getTopLeftTile()].getColor());
        }
      }

      if (currentPlayer === this.playerOne) {
        this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERONE);
        this.playerOne.greenResources -= 2;
        this.playerOne.yellowResources -= 2;
        this.playerOne.numNodesPlaced++;
        this.playerOne.currentScore++;
      } else {
        this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERTWO);
        this.playerTwo.greenResources -= 2;
        this.playerTwo.yellowResources -= 2;
        this.playerTwo.numNodesPlaced++;
        this.playerTwo.currentScore++;
      }

      return true;
    } else {
      return false;
    }
  }


  generalBranchPlacement(possibleBranch: number, currentPlayer: Player): boolean {

    // fail condition: player doesn't have required resources
    if (currentPlayer.redResources < 1 || currentPlayer.blueResources < 1) {
      return false;
    }

    const otherPlayer = currentPlayer === this.playerOne ? this.playerTwo : this.playerOne;

    // fail condition: branch is adjacent to tile captured by other player
    for (let i = 0; i < otherPlayer.capturedTiles.length; i++) {
      const currentCapturedTile = this.gameBoard.tiles[otherPlayer.capturedTiles[i]];
      if (currentCapturedTile.getTopBranch() === possibleBranch ||
        currentCapturedTile.getRightBranch() === possibleBranch ||
        currentCapturedTile.getBottomBranch() === possibleBranch ||
        currentCapturedTile.getLeftBranch() === possibleBranch) {
        return false;
      }
    }

    if (this.gameBoard.branches[possibleBranch].getOwner() === Owner.NONE) {

      const branchOwner = currentPlayer === this.playerOne ? Owner.PLAYERONE : Owner.PLAYERTWO;

      if (this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch("branch1")]?.getOwner() === branchOwner ||
        this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch("branch2")]?.getOwner() === branchOwner ||
        this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch("branch3")]?.getOwner() === branchOwner ||
        this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch("branch4")]?.getOwner() === branchOwner ||
        this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch("branch5")]?.getOwner() === branchOwner ||
        this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch("branch6")]?.getOwner() === branchOwner) {

        if (currentPlayer == this.playerOne) {
          this.gameBoard.branches[possibleBranch].setOwner(Owner.PLAYERONE);
          this.playerOne.ownedBranches.push(possibleBranch);
          this.playerOne.redResources--;
          this.playerOne.blueResources--;
        } else {
          this.gameBoard.branches[possibleBranch].setOwner(Owner.PLAYERTWO);
          this.playerTwo.ownedBranches.push(possibleBranch);
          this.playerTwo.redResources--;
          this.playerTwo.blueResources--;
        }

        return true;
      } else {
        return false;
      }
    } else {
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
    } else {
      this.playerTwo.numNodesPlaced--;
      this.playerTwo.currentScore--;
      this.playerTwo.yellowResources += 2;
      this.playerTwo.greenResources += 2;
    }

    if (this.gameBoard.nodes[reverseNode].getTopRightTile() !== -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].nodeCount--;

      // checking if need to un-exhaust tile
      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].isExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].nodeCount <=
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].maxNodes) {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getTopRightTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getTopLeftTile() !== -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].nodeCount--;

      // checking if need to un-exhaust tile
      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].isExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].nodeCount <=
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].maxNodes) {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getTopLeftTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getBottomRightTile() !== -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].nodeCount--;

      // checking if need to un-exhaust tile
      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].isExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].nodeCount <=
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].maxNodes) {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getBottomRightTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getBottomLeftTile() !== -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].nodeCount--;

      // checking if need to un-exhaust tile
      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].isExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].nodeCount <=
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].maxNodes) {
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
    } else {
      this.playerTwo.numNodesPlaced--;
      this.playerTwo.currentScore--;
    }

    if (this.gameBoard.nodes[reverseNode].getTopRightTile() !== -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].nodeCount--;

      // checking if need to un-exhaust tile
      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].isExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].nodeCount <=
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].maxNodes) {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopRightTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getTopRightTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getTopLeftTile() !== -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].nodeCount--;
      // checking if need to un-exhaust tile
      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].isExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].nodeCount <=
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].maxNodes) {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getTopLeftTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getTopLeftTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getBottomRightTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].nodeCount--;

      // checking if need to un-exhaust tile
      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].isExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].nodeCount <=
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].maxNodes) {
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomRightTile()].isExhausted = false;
          this.tileExhaustion(this.gameBoard.nodes[reverseNode].getBottomRightTile(), false);
        }
      }
    }

    if (this.gameBoard.nodes[reverseNode].getBottomLeftTile() != -1) {
      this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].nodeCount--;

      if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].isExhausted) {
        if (this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].nodeCount <=
          this.gameBoard.tiles[this.gameBoard.nodes[reverseNode].getBottomLeftTile()].maxNodes) {
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
    } else {
      this.playerTwo.ownedBranches.pop();
      this.playerTwo.redResources++;
      this.playerTwo.blueResources++;
    }
  }

  reverseInitialBranchPlacement(reverseBranch: number): void {
    this.gameBoard.branches[reverseBranch].setOwner(Owner.NONE);
    this.getCurrentPlayer().ownedBranches.pop();
  }

  tileExhaustion(tileNum: number, setAsExhausted: boolean): void {
    // check for whichever nodes are already on the tile and decrement/increment their *color*PerTurn
    const currentTileColor = this.gameBoard.tiles[tileNum].color;

    if (setAsExhausted) {
      if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getTopRightNode()].getOwner() === Owner.PLAYERONE) {
        this.decrementResource(this.playerOne, currentTileColor);
      } else if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getTopRightNode()].getOwner() === Owner.PLAYERTWO) {
        this.decrementResource(this.playerTwo, currentTileColor);
      }

      if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getBottomRightNode()].getOwner() === Owner.PLAYERONE) {
        this.decrementResource(this.playerOne, currentTileColor);
      } else if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getBottomRightNode()].getOwner() === Owner.PLAYERTWO) {
        this.decrementResource(this.playerTwo, currentTileColor);
      }

      if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getBottomLeftNode()].getOwner() === Owner.PLAYERONE) {
        this.decrementResource(this.playerOne, currentTileColor);
      } else if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getBottomLeftNode()].getOwner() === Owner.PLAYERTWO) {
        this.decrementResource(this.playerTwo, currentTileColor);
      }

      if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getTopLeftNode()].getOwner() === Owner.PLAYERONE) {
        this.decrementResource(this.playerOne, currentTileColor);
      } else if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getTopLeftNode()].getOwner() === Owner.PLAYERTWO) {
        this.decrementResource(this.playerTwo, currentTileColor);
      }
    }

    else {
      if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getTopRightNode()].getOwner() === Owner.PLAYERONE) {
        this.incrementResource(this.playerOne, currentTileColor);
      } else if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getTopRightNode()].getOwner() === Owner.PLAYERTWO) {
        this.incrementResource(this.playerTwo, currentTileColor);
      }

      if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getBottomRightNode()].getOwner() === Owner.PLAYERONE) {
        this.incrementResource(this.playerOne, currentTileColor);
      } else if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getBottomRightNode()].getOwner() === Owner.PLAYERTWO) {
        this.incrementResource(this.playerTwo, currentTileColor);
      }

      if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getBottomLeftNode()].getOwner() === Owner.PLAYERONE) {
        this.incrementResource(this.playerOne, currentTileColor);
      } else if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getBottomLeftNode()].getOwner() === Owner.PLAYERTWO) {
        this.incrementResource(this.playerTwo, currentTileColor);
      }

      if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getTopLeftNode()].getOwner() === Owner.PLAYERONE) {
        this.incrementResource(this.playerOne, currentTileColor);
      } else if (this.gameBoard.nodes[this.gameBoard.tiles[tileNum].getTopLeftNode()].getOwner() === Owner.PLAYERTWO) {
        this.incrementResource(this.playerTwo, currentTileColor);
      }
    }

  }

  decrementResource(nodeOwner: Player, currentTileColor: TileColor): void {
    switch (currentTileColor) {
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
    switch (currentTileColor) {
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

    if (branchOwner.branchScanner.includes(currentBranch) === true) {
      return;
    }

    branchOwner.branchScanner.push(currentBranch);
    branchOwner.currentLength++;

    let branch1Owner = Owner.NONE;
    let branch2Owner = Owner.NONE;
    let branch3Owner = Owner.NONE;
    let branch4Owner = Owner.NONE;
    let branch5Owner = Owner.NONE;
    let branch6Owner = Owner.NONE;

    if (branchOwner.currentLength > branchOwner.currentLongest) {
      branchOwner.currentLongest = branchOwner.currentLength;
    }

    if (this.gameBoard.branches[currentBranch].getBranch('branch1') !== -1) {
      branch1Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch1')].getOwner();
    }

    if (this.gameBoard.branches[currentBranch].getBranch('branch2') !== -1) {
      branch2Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch2')].getOwner();
    }

    if (this.gameBoard.branches[currentBranch].getBranch('branch3') !== -1) {
      branch3Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch3')].getOwner();
    }

    if (this.gameBoard.branches[currentBranch].getBranch('branch4') !== -1) {
      branch4Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch4')].getOwner();
    }

    if (this.gameBoard.branches[currentBranch].getBranch('branch5') !== -1) {
      branch5Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch5')].getOwner();
    }

    if (this.gameBoard.branches[currentBranch].getBranch('branch6') !== -1) {
      branch6Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch6')].getOwner();
    }

    if (branchOwner === this.playerOne) {
      if (branch1Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch("branch1"));
      }
      if (branch2Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch("branch2"));
      }
      if (branch3Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch("branch3"));
      }
      if (branch4Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch("branch4"));
      }
      if (branch5Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch("branch5"));
      }
      if (branch6Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch("branch6"));
      }
    } else {
      if (branch1Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch("branch1"));
      }
      if (branch2Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch("branch2"));
      }
      if (branch3Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch("branch3"));
      }
      if (branch4Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch("branch4"));
      }
      if (branch5Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch("branch5"));
      }
      if (branch6Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, this.gameBoard.branches[currentBranch].getBranch("branch6"));
      }
    }

    //branchOwner.branchScanner.pop();
  }

  checkForCaptures(capturer: Player, checkTile: number): boolean {
    let captured = true;

    // prevents infinite recursion
    if (this.tilesBeingChecked.includes(checkTile)) {
      return captured;
    }

    const otherPlayer = capturer === this.playerOne ? Owner.PLAYERTWO : Owner.PLAYERONE;
    const currentTile = this.gameBoard.tiles[checkTile];
    const tileTopBranch = this.gameBoard.branches[currentTile.getTopBranch()];
    const tileRightBranch = this.gameBoard.branches[currentTile.getRightBranch()];
    const tileBottomBranch = this.gameBoard.branches[currentTile.getBottomBranch()];
    const tileLeftBranch = this.gameBoard.branches[currentTile.getLeftBranch()];

    // checks first instant fail condition: opponent has claimed any branches surrounding tile being checked
    if (tileTopBranch.getOwner() === otherPlayer ||
      tileRightBranch.getOwner() === otherPlayer ||
      tileBottomBranch.getOwner() === otherPlayer ||
      tileLeftBranch.getOwner() === otherPlayer) {
      captured = false;
      // checks second instant fail condition: no other tile present next to one of current tile's empty-branch sides
    } else if ((tileTopBranch.getOwner() === Owner.NONE && currentTile.getTopTile() === -1) ||
      (tileRightBranch.getOwner() === Owner.NONE && currentTile.getRightTile() === -1) ||
      (tileBottomBranch.getOwner() === Owner.NONE && currentTile.getBottomTile() === -1) ||
      (tileLeftBranch.getOwner() === Owner.NONE && currentTile.getLeftTile() === -1)) {
      captured = false;
    } else {
      // begins recursive calls checking for multi-tile capture
      this.tilesBeingChecked.push(checkTile);

      if (tileTopBranch.getOwner() === Owner.NONE) {
        if (this.checkForCaptures(capturer, currentTile.getTopTile()) === false) {
          captured = false;
        }
      }

      if (tileRightBranch.getOwner() === Owner.NONE) {
        if (this.checkForCaptures(capturer, currentTile.getRightTile()) === false) {
          captured = false;
        }
      }

      if (tileBottomBranch.getOwner() === Owner.NONE) {
        if (this.checkForCaptures(capturer, currentTile.getBottomTile()) === false) {
          captured = false;
        }
      }

      if (tileLeftBranch.getOwner() === Owner.NONE) {
        if (this.checkForCaptures(capturer, currentTile.getLeftTile()) === false) {
          captured = false;
        }
      }
    }

    return captured;
  }
}
