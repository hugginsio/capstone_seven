import { Injectable } from '@angular/core';
import { GameType, Owner, PlayerType, TileColor } from '../../enums/game.enums';
import { CoreLogic } from '../../util/core-logic.util';
import { AiService } from '../../services/ai/ai.service';

import { GameBoard } from '../../classes/gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';
import { Subject } from 'rxjs';
import { CommPackage, ResourceMap } from '../../interfaces/game.interface';
import { CommCode } from '../../interfaces/game.enum';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage.service';
import { GameNetworkingService } from '../../../networking/game-networking.service';
import { NetworkGameSettings } from '../../../networking/NetworkGameSettings';


@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  // NETWORK/AI/LOCAL
  private currentGameMode: GameType;

  // tracks current turn's active player
  private currentPlayer: Owner;

  private gameBoard: GameBoard;

  private playerOne: Player;
  private playerTwo: Player;

  // used for UI integration
  private firstPlayer: number;

  // guided tutorial
  //private isTutorial: string;

  // Networking stuff
  private isHost: string;
  private isHostFirst: string;
  private netSettings: NetworkGameSettings;

  // initializes AI service
  private readonly ai: AiService;

  // used in checkForCaptures() function
  private tilesBeingChecked: number[];

  // used to store the seriealizedBoard
  public boardString: string;

  // holds the single resource that the player trades for if trade has been made 
  public selectedTrade: string;

  // holds the 3 resources that the player trades in if a trade is made
  public tradedResources: string[];

  // keeps track of human player's moves (used for AI & Networking)
  public stack: Array<Array<string | number>> = [];

  // <---------------------------------------------------------------------------------------------------------------------------------------what is this?
  public readonly commLink = new Subject<CommPackage>();

  constructor(
    // UI integration
    private readonly storageService: LocalStorageService,
    private readonly networkingService: GameNetworkingService
  ) {

    // begin initializing ManagerService fields
    this.currentPlayer = Owner.PLAYERONE;
    this.gameBoard = new GameBoard();
    this.playerOne = new Player();
    this.playerTwo = new Player();
    this.tilesBeingChecked = [];
    this.tradedResources = [];

    this.netSettings = {board: "", background: "", isHostFirst: true};

    // getting/setting data via UI
    this.storageService.setContext('game');
    const gameMode = this.storageService.fetch('mode');
    const boardSeed = this.storageService.fetch('board-seed');
    //this.isTutorial = this.storageService.fetch('guided-tutorial');
    //this.firstPlayer = this.storageService.fetch('firstplayer');
    this.isHost = this.storageService.fetch('isHost');
    this.isHostFirst = this.storageService.fetch('isHostFirst');
    this.firstPlayer = +this.storageService.fetch('firstplayer');


    // determines currentGameMode field
    // determines player type fields for playerOne + playerTwo
    if (gameMode === 'pvp') {
      this.playerOne.type = PlayerType.HUMAN;
      this.playerTwo.type = PlayerType.HUMAN;
    }
    else if (gameMode === 'pva') {
      this.currentGameMode = GameType.AI;
      if (this.firstPlayer === 1) {
        this.playerOne.type = PlayerType.HUMAN;
        this.playerTwo.type = PlayerType.AI;
      }
      if (this.firstPlayer === 2) {
        this.playerOne.type = PlayerType.AI;
        this.playerTwo.type = PlayerType.HUMAN;
      }
    } 
    else {
      this.currentGameMode = GameType.NETWORK;
      console.log("Network Game");
      
      if(this.isHost === 'true')
      {
        console.log("We are the host");
        this.networkingService.createTCPServer();
        this.netSettings.background = "BG1";

        if (this.isHostFirst === 'true') {
          this.playerOne.type = PlayerType.HUMAN;
          this.playerTwo.type = PlayerType.NETWORK;
          this.netSettings.isHostFirst = true;
        }
        else {
          this.playerOne.type = PlayerType.NETWORK;
          this.playerTwo.type = PlayerType.HUMAN;
          this.netSettings.isHostFirst = false;
        }
      }
      else
      {
        const IP = this.storageService.fetch('oppAddress');
        this.networkingService.connectTCPserver(IP);

        if (this.isHostFirst === 'true') {
          this.playerOne.type = PlayerType.NETWORK;
          this.playerTwo.type = PlayerType.HUMAN;
        }
        else {
          this.playerOne.type = PlayerType.HUMAN;
          this.playerTwo.type = PlayerType.NETWORK;
        }
      }
      this.networkingService.listen('recieve-move').subscribe((move: string) => {
        console.log(move);
        this.applyMove(move);
      });
    }

    // instantiating AiService, calling its contructor w/ gameBoard and both players
    if (this.firstPlayer === 1) {
      if (this.currentGameMode === GameType.AI) {
        this.ai = new AiService(this.gameBoard, this.playerOne, this.playerTwo);
      }
    } else if (this.firstPlayer === 2) {
      if (this.currentGameMode === GameType.AI) {
        this.ai = new AiService(this.gameBoard, this.playerOne, this.playerTwo);
      }
    }

    // setting board as random or manually setting tiles
    if (boardSeed === '!random' || boardSeed === 'undefined') {
      // create random tile location gameBoard
      this.createBoard(true);
      console.log(this.getBoard());
    } else {
      // create gameboard with user defined seed
      this.createBoard(false, boardSeed);
    }

    if (this.currentGameMode === GameType.AI && this.getCurrentPlayer().type === PlayerType.AI) {
      console.log('???');
      this.nextTurn(this.getCurrentPlayer());
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

  // setting up board with tile locations
  createBoard(random: boolean, boardString = "empty"): void {
    if (random) {
      // random tile locations
      this.gameBoard.randomizeColorsAndMaxNodes();
    } else {
      // let user enter tile placement
      let boardStringArray = [];
      // changing string to array of char pairs, representing each tile
      boardStringArray = boardString.split(',');

      // assigning tiles[] in gameBoard to match the input for the board
      for (let i = 0; i < boardStringArray.length; i++) {

        let tileColor;
        let maxNodes;

        // parses first char from pair
        switch (boardStringArray[i].substring(0, 1)) {
          // assigns tile colors
          case 'R':
            tileColor = TileColor.RED;
            break;
          case 'B':
            tileColor = TileColor.BLUE;
            break;
          case 'Y':
            tileColor = TileColor.YELLOW;
            break;
          case 'G':
            tileColor = TileColor.GREEN;
            break;
          // blank tile, '0'
          default:
            tileColor = TileColor.BLANK;
            break;
        }
        this.gameBoard.tiles[i].color = tileColor;

        // parses second char from pair
        switch (boardStringArray[i].substring(1)) {
          // assigns tile node limits
          case "1":
            maxNodes = 1;
            break;
          case "2":
            maxNodes = 2;
            break;
          case "3":
            maxNodes = 3;
            break;
          // blank tile, '0'
          default:
            maxNodes = 0;
            break;
        }
        this.gameBoard.tiles[i].maxNodes = maxNodes;
      }
    }
    this.serializeBoard();

    if(this.currentGameMode === GameType.NETWORK)
    {
      this.netSettings.board = this.boardString;
      if(this.isHost === 'true')
      {
        console.log("We are sending the board!");
        this.networkingService.setGame(this.netSettings);
      }
    }
  }

  //setIsTutorialFalse():void {
  // this.isTutorial = "false";
  //}

  // creates string representing gameBoard for AI/Networking
  serializeBoard(): void {

    // string to represent gameBoard
    let currentBoardString = '';

    // concatenates gameBoard data onto currentBoardString
    for (let i = 0; i < this.gameBoard.tiles.length; i++) {
      // concatenates tile's color
      switch (this.gameBoard.tiles[i].color) {
        case TileColor.RED:
          currentBoardString += 'R';
          break;
        case TileColor.BLUE:
          currentBoardString += 'B';
          break;
        case TileColor.GREEN:
          currentBoardString += 'G';
          break;
        case TileColor.YELLOW:
          currentBoardString += 'Y';
          break;
        case TileColor.BLANK:
          currentBoardString += '0';
          break;
      }
      // concatenates tile's maxNodes
      currentBoardString += this.gameBoard.tiles[i].maxNodes.toString();
      // separates data on individual tiles by commas
      currentBoardString += ',';
    }
    // removes trailing comma
    currentBoardString = currentBoardString.substring(0, currentBoardString.length - 1);

    // initializes ManagerService's boardString field
    this.boardString = currentBoardString;
    console.log(this.boardString);
  }

  // takes string from Networking/AI and places move in local gameBoard
  applyMove(moveString: string): void {
    let currentPlayer;
    if (this.playerOne.type === PlayerType.HUMAN) {
      currentPlayer = this.playerTwo;
    } else {
      currentPlayer = this.playerOne;
    }

    // using CoreLogic stringToMove function
    // creates a "Move" to be used for placing opponent's move
    const moveToPlace = CoreLogic.stringToMove(moveString);

    // process trade
    if (moveToPlace.tradedIn.length > 0) {
      // decrement the 3 resources the player traded in 
      for (let i = 0; i < moveToPlace.tradedIn.length; i++) {
        this.decrementResourceByOne(currentPlayer, moveToPlace.tradedIn[i]);
      }
      // increment resource traded for 
      this.incrementResourceByOne(currentPlayer, moveToPlace.received);
    }

    // initial placements
    if (currentPlayer.ownedBranches.length < 2) {
      this.initialNodePlacements(moveToPlace.nodesPlaced[0], currentPlayer);
      this.initialBranchPlacements(moveToPlace.nodesPlaced[0], moveToPlace.branchesPlaced[0], currentPlayer);
    } else {
      // process general branch placements
      for (let i = 0; i < moveToPlace.branchesPlaced.length; i++) {
        this.generalBranchPlacement(moveToPlace.branchesPlaced[i], currentPlayer);
      }

      // process general node placements
      for (let i = 0; i < moveToPlace.nodesPlaced.length; i++) {
        this.generalNodePlacement(moveToPlace.nodesPlaced[i], currentPlayer);
      }
    }

    this.endTurn(currentPlayer);
  }


  startGame(gameType: GameType): void {
    // if (this.currentGameMode === GameType.AI) {

    // }
    // assigns human/ai roles in AI game
    // if (this.gameType === GameType.AI) {
    //   if (playerNum == 1) {
    //     this.playerTwo.type = PlayerType.AI;
    //     this.playerOne.type = PlayerType.HUMAN;
    //   } else if (playerNum == 2) {
    //     this.playerOne.type = PlayerType.AI;
    //     this.playerTwo.type = PlayerType.HUMAN;

    //   }
    // }

    // <-------------------------------------------------------------------------------------------------------FIXME: need to assign p1, p2, & GameType for networking game 

    // this.makeInitialPlacements(this.playerOne, false);
    // this.makeInitialPlacements(this.playerTwo, false);
    // this.makeInitialPlacements(this.playerTwo, false);
    // this.makeInitialPlacements(this.playerOne, false);

    // this.endTurn(this.playerOne);
  }

  nextTurn(currentPlayer: Player): void {

    // sets otherPlayer as instance of opponent player
    const otherPlayer = currentPlayer === this.playerOne ? this.playerTwo : this.playerOne;

    // hasTraded always defaults to false to allow singular trade per turn
    currentPlayer.hasTraded = false;

    // updates resources for newPlayer
    currentPlayer.redResources += currentPlayer.redPerTurn;
    currentPlayer.blueResources += currentPlayer.bluePerTurn;
    currentPlayer.yellowResources += currentPlayer.yellowPerTurn;
    currentPlayer.greenResources += currentPlayer.greenPerTurn;

    // sets resources if initial placements are yet to be completed
    if (currentPlayer.numNodesPlaced < 2 && currentPlayer.ownedBranches.length < 2) {
      currentPlayer.redResources = 1;
      currentPlayer.blueResources = 1;
      currentPlayer.yellowResources = 2;
      currentPlayer.greenResources = 2;

    }

    // serializing otherPlayer's previous move
    const pastMoveString = this.serializeStack();
    console.log(pastMoveString);

    // clear tradedResources[]
    this.tradedResources.splice(0, this.tradedResources.length);
    // clear stack of node and branch placements
    this.stack.splice(0, this.stack.length);
    // calls AI to make move on its turn
    if (currentPlayer.type === PlayerType.AI && this.storageService.fetch('guided-tutorial') === "false") {
      const prevPlayerInt = this.getCurrentPlayer() === this.playerOne ? 1 : 2;
      // string to store AI move
      const AIStringMove = this.ai.getAIMove(this.gameBoard, this.playerOne, this.playerTwo, prevPlayerInt, pastMoveString);

      console.warn(AIStringMove);
      this.applyMove(AIStringMove);
    }
    else if (currentPlayer.type === PlayerType.NETWORK && currentPlayer.numNodesPlaced !== 1) {
      //console.log(pastMoveString);
      //this.networkingService.sendMove(pastMoveString);


    }

    // Empty the move stack prior to the next placed turns

    // call applyMove 
    // R,R,R,Y;8;3,18 (Trades; Nodes; Branches)
    // string AIMoveString = ai.service.getMove(board, p1, p2)
    // Move AIMove = stringToMove(AIMove: string)
    // gameboard.applyMove(AIMove);

    // make moves -- check resources 
  }

  // generates string of all local player's moves in a turn
  // used for AI/Networking purposes
  serializeStack(): string {
    let moves = '';

    // Trades

    // which three resources were traded
    if (this.getCurrentPlayer().hasTraded) {
      this.tradedResources.forEach(el => {
        moves += `${el},`;
      });
      // which resource was traded for
      moves += `${this.selectedTrade},`;
    }

    // handle trailing comma
    if (moves.slice(-1) === ',') {
      moves = moves.substring(0, moves.length - 1);
    }

    moves += ';';

    // Nodes
    this.stack.forEach(el => {
      if (el[0] === 'N') {
        moves += `${el[1].toString()},`;
      }
    });

    // handle trailing comma
    if (moves.slice(-1) === ',') {
      moves = moves.substring(0, moves.length - 1);
    }

    moves += ';';

    // Branches
    this.stack.forEach(el => {
      if (el[0] === 'B') {
        moves += `${el[1].toString()},`;
      }
    });

    // handle trailing comma
    if (moves.slice(-1) === ',') {
      moves = moves.substring(0, moves.length - 1);
    }

    return moves;
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

  // updates information based on completed turn by endPlayer
  // sets up nextTurn for other player
  endTurn(endPlayer: Player): void {

    // initializes local consts w/ appropriate player data
    const otherPlayer = endPlayer === this.playerOne ? this.playerTwo : this.playerOne;
    const otherOwner = endPlayer === this.playerOne ? Owner.PLAYERTWO : Owner.PLAYERONE;
    const currentOwner = endPlayer === this.playerOne ? Owner.PLAYERONE : Owner.PLAYERTWO;

    //Sends move in network game
    if (this.currentGameMode === GameType.NETWORK && endPlayer.type === PlayerType.HUMAN)
    {
      console.log(this.serializeStack());
      this.networkingService.sendMove(this.serializeStack());
    }

    // passes every tile to checkForCaptures for purposes of multi-tile captures
    for (let i = 0; i < this.gameBoard.tiles.length; i++) {
      if (this.checkForCaptures(endPlayer, i) === true) {

        // updates owner info of tile
        this.gameBoard.tiles[i].setCapturedBy(currentOwner);

        // type aliasing for tile's adjacent nodes
        const trNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getTopRightNode()];
        const brNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getBottomRightNode()];
        const blNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getBottomLeftNode()];
        const tlNode = this.gameBoard.nodes[this.gameBoard.tiles[i].getTopLeftNode()];

        // type aliasing for tile's color
        const currentTileColor = this.gameBoard.tiles[i].getColor();

        // determine whether tile is actually being captured this turn
        let newCapture = true;

        for (let z = 0; z < endPlayer.capturedTiles.length; z++) {

          // check if tile has already been captured in previous turns
          if (endPlayer.capturedTiles[z] === i) {
            newCapture = false;
          }
        }

        if (newCapture === true) {
          // unexhaust tiles for owner of newly captured tiles
          if (this.gameBoard.tiles[i].isExhausted) {
            this.gameBoard.tiles[i].isExhausted = false;

            // if new owner has nodes, give them resources per turn

            if (trNode?.getOwner() === currentOwner) {
              this.incrementResource(endPlayer, currentTileColor);
            }

            if (brNode?.getOwner() === currentOwner) {
              this.incrementResource(endPlayer, currentTileColor);
            }

            if (blNode?.getOwner() === currentOwner) {
              this.incrementResource(endPlayer, currentTileColor);
            }

            if (tlNode?.getOwner() === currentOwner) {
              this.incrementResource(endPlayer, currentTileColor);
            }
          } else {

            // for tiles that weren't exhausted, decrement otherPlayer's resources for each node

            if (trNode?.getOwner() === otherOwner) {
              this.decrementResource(otherPlayer, currentTileColor);
            }

            if (brNode?.getOwner() === otherOwner) {
              this.decrementResource(otherPlayer, currentTileColor);
            }

            if (blNode?.getOwner() === otherOwner) {
              this.decrementResource(otherPlayer, currentTileColor);
            }

            if (tlNode?.getOwner() === otherOwner) {
              this.decrementResource(otherPlayer, currentTileColor);
            }
          }


          this.gameBoard.tiles[i].setCapturedBy(currentOwner);

          // updates scoring metrics for endPlayer (1 pt per captured tile)
          endPlayer.numTilesCaptured++;
          endPlayer.currentScore++;

          endPlayer.capturedTiles.push(i);
        }

      }

      // empty tilesBeingChecked before looping
      this.tilesBeingChecked.splice(0, this.tilesBeingChecked.length);
    }

    // empties tilesBeingChecked for next function call
    this.tilesBeingChecked.splice(0, this.tilesBeingChecked.length);

    // scans all possible branch paths for endPlayer
    for (let i = 0; i < endPlayer.ownedBranches.length; i++) {

      // iterator calculating each path's length
      endPlayer.currentLength = 0;

      // stack tracking branch paths evaluated via each starting branch position
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
    }
    // checks if players' longest branch paths weren't previously equal but now are 
    else if (this.playerOne.currentLongest === this.playerTwo.currentLongest) {
      if (this.playerOne.hasLongestNetwork === true) {
        this.playerOne.hasLongestNetwork = false;
        this.playerOne.currentScore -= 2;
      } else if (this.playerTwo.hasLongestNetwork === true) {
        this.playerTwo.hasLongestNetwork = false;
        this.playerTwo.currentScore -= 2;
      }
    }

    // evaluates whether a winner ought to be determined
    if (this.playerOne.currentScore >= 10 || this.playerTwo.currentScore >= 10) {
      if (this.playerOne.currentScore > this.playerTwo.currentScore) {
        this.commLink.next({ code: CommCode.END_GAME, player: this.playerOne, magic: 'Player One' });
      } else {
        this.commLink.next({ code: CommCode.END_GAME, player: this.playerTwo, magic: 'Player Two' });
      }
    } else {
      const newPlayer = endPlayer === this.playerOne ? this.playerTwo : this.playerOne;

      // update resources for newPlayer
      // newPlayer.redResources += newPlayer.redPerTurn;
      // newPlayer.blueResources += newPlayer.bluePerTurn;
      // newPlayer.yellowResources += newPlayer.yellowPerTurn;
      // newPlayer.greenResources += newPlayer.greenPerTurn;

      // Set resources if still opening moves
      // if (endPlayer.numNodesPlaced < 2 && endPlayer.ownedBranches.length < 2) {
      //   endPlayer.redResources = 1;
      //   endPlayer.blueResources = 1;
      //   endPlayer.yellowResources = 2;
      //   endPlayer.greenResources = 2;
      // }

      // if AI is PlayerOne, send the first move of playerTwo to AI, keeping track of all moves placed
      if (endPlayer.numNodesPlaced === 1 && newPlayer.numNodesPlaced === 1) {
        if (this.currentGameMode === GameType.AI && this.playerOne.type === PlayerType.AI) {
          //this.ai.player2InitialMoveSpecialCase(this.serializeStack(),1);
        }
        // allow playerTwo's second initial turn 
        
        this.nextTurn(endPlayer);
        return;
      }

      this.currentPlayer = endPlayer === this.playerOne ? Owner.PLAYERTWO : Owner.PLAYERONE;

      // change active player
      this.nextTurn(newPlayer);
    }
  }

  // Trade resources

  makeTrade(currentPlayer: Player, selectedResource: number, tradeMap: ResourceMap): void {
    currentPlayer.hasTraded = true;
    // tradeMap had number tied to each resource color that 
    // increments to the number of that color being traded 

    // loop through number of blues being traded
    for (let i = 0; i < tradeMap.blue; i++) {
      // decrement resource
      currentPlayer.blueResources--;
      // adjust tradedResources array for this turn 
      this.tradedResources.push('B');
    }
    // repeats decrementing and adjusting of array for each other color
    for (let i = 0; i < tradeMap.red; i++) {
      currentPlayer.redResources--;
      this.tradedResources.push('R');
    }
    for (let i = 0; i < tradeMap.yellow; i++) {
      currentPlayer.yellowResources--;
      this.tradedResources.push('Y');
    }
    for (let i = 0; i < tradeMap.green; i++) {
      currentPlayer.greenResources--;
      this.tradedResources.push('G');
    }

    // assign selectedTrade with resource the player traded for
    switch (selectedResource) {
      case 1:
        currentPlayer.redResources++;
        this.selectedTrade = 'R';
        break;
      case 2:
        currentPlayer.greenResources++;
        this.selectedTrade = 'G';
        break;
      case 3:
        currentPlayer.blueResources++;
        this.selectedTrade = 'B';
        break;
      case 4:
        currentPlayer.yellowResources++;
        this.selectedTrade = 'Y';
        break;
    }
    // if(currentPlayer.hasTraded === false)
    // {
    // //   clickRed(event: MouseEvent) {
    //      if (currentPlayer.redResources > 0 && tradedResources.length <= 3) {
    //        tradedResources.push('R');
    //        currentPlayer.redResources--;
    //      }
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

  // determines whether move to be undone is branch or node placement
  undoPlacement(piece: string, index: number, currentPlayer: Player): void {
    if (piece === 'N') {
      this.reverseNodePlacement(index, currentPlayer);
    } else {
      this.reverseBranchPlacement(index, currentPlayer);
    }
  }

  // evaluates possibleNode
  // places possibleNode in node position if legal
  // returns whether move is valid
  initialNodePlacements(possibleNode: number, currentPlayer: Player): boolean {
    const otherOwner = currentPlayer === this.playerOne ? Owner.PLAYERTWO : Owner.PLAYERONE;

    // type aliasing for node's adjacent tiles index
    const trTileIndex = this.gameBoard.nodes[possibleNode]?.getTopRightTile();
    const brTileIndex = this.gameBoard.nodes[possibleNode]?.getBottomRightTile();
    const blTileIndex = this.gameBoard.nodes[possibleNode]?.getBottomLeftTile();
    const tlTileIndex = this.gameBoard.nodes[possibleNode]?.getTopLeftTile();

    // type aliasing for node's adjacent tiles
    const trTile = this.gameBoard.tiles[trTileIndex];
    const brTile = this.gameBoard.tiles[brTileIndex];
    const blTile = this.gameBoard.tiles[blTileIndex];
    const tlTile = this.gameBoard.tiles[tlTileIndex];

    // instant fail if player does not have enough of required resources
    if (currentPlayer.greenResources < 2 || currentPlayer.yellowResources < 2) {
      return false;
    }

    // instant fail if node is already owned 
    if (this.gameBoard.nodes[possibleNode]?.getOwner() === Owner.NONE) {

      // checks trTileIndex
      if (trTileIndex !== -1) {

        // nodeCount of tile incremented
        trTile.nodeCount++;

        // checks if tile should be exhausted
        if ((trTile.nodeCount > trTile.maxNodes) && trTile.isExhausted === false) {

          // checking if tile is not captured to set isExhausted and decrement tiles through tileExhaustion()
          if (trTile.capturedBy === Owner.NONE) {
            trTile.isExhausted = true;

            // updates tile's stored exhaustion state
            this.tileExhaustion(trTileIndex, true);
          }
        }

        // checks if player's resource production ought to be incremented
        if (trTile.isExhausted === false &&
          trTile.capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, trTile.getColor());
        }
      }

      // checks if possibleNode's bottomRightTile exists
      if (brTileIndex !== -1) {

        // nodeCount of tile incremented
        brTile.nodeCount++;

        // checks if tile should be exhausted
        if ((brTile.nodeCount > brTile.maxNodes) && brTile.isExhausted === false) {

          // checking if tile is not captured to set isExhausted and decrement tiles through tileExhaustion()
          if (brTile.capturedBy === Owner.NONE) {

            brTile.isExhausted = true;

            // updates tile's stored exhaustion state
            this.tileExhaustion(brTileIndex, true);
          }
        }

        // checks if player's resource production ought to be incremented
        if (brTile.isExhausted === false &&
          brTile.capturedBy !== otherOwner)
          this.incrementResource(currentPlayer, brTile.getColor());
      }

      // checks if possibleNode's bottomLeftTile exists
      if (blTileIndex !== -1) {

        // nodeCount of tile incremented
        blTile.nodeCount++;

        // checks if tile should be exhausted
        if ((blTile.nodeCount > blTile.maxNodes) && blTile.isExhausted === false) {

          // checking if tile is not captured to set isExhausted and decrement tiles through tileExhaustion()
          if (blTile.capturedBy === Owner.NONE) {
            blTile.isExhausted = true;

            // updates tile's stored exhaustion state
            this.tileExhaustion(blTileIndex, true);
          }
        }

        // checks if player's resource production ought to be incremented
        if (blTile.isExhausted === false &&
          blTile.capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, blTile.getColor());
        }
      }

      // checks if possibleNode's topLeftTile exists
      if (tlTileIndex != -1) {

        // nodeCount of tile incremented
        tlTile.nodeCount++;

        // checks if tile should be exhausted
        if ((tlTile.nodeCount > tlTile.maxNodes) && tlTile.isExhausted === false) {

          // checking if tile is not captured to set isExhausted and decrement tiles through tileExhaustion()
          if (tlTile.capturedBy === Owner.NONE) {

            tlTile.isExhausted = true;

            // updates tile's stored exhaustion state
            this.tileExhaustion(tlTileIndex, true);
          }
        }
        // checks if player's resource production ought to be incremented
        if (tlTile.isExhausted === false && tlTile.capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, tlTile.getColor());
        }
      }

      // updates tile owner
      // updates currentPlayer's score metrics
      // updates currentPlayer's resource counts
      if (currentPlayer == this.playerOne) {
        this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERONE);
        this.playerOne.numNodesPlaced++;
        this.playerOne.currentScore++;
        this.playerOne.greenResources -= 2;
        this.playerOne.yellowResources -= 2;
      } else {
        this.gameBoard.nodes[possibleNode].setOwner(Owner.PLAYERTWO);
        this.playerTwo.numNodesPlaced++;
        this.playerTwo.currentScore++;
        this.playerTwo.greenResources -= 2;
        this.playerTwo.yellowResources -= 2;
      }

      // create nodePlacement object to push on current turn's stack of moves
      const nodePlacement = ['N', possibleNode.toString()];
      this.stack.push(nodePlacement);

      return true;
    }

    else {
      return false;
    }
  }

  // evaluates possibleBranch
  // places in branch position if legal and attached to selectedNode
  // returns whether move is valid
  initialBranchPlacements(selectedNode: number, possibleBranch: number, currentPlayer: Player): boolean {

    // type aliasing for node's adjacent branches
    const topBranch = this.gameBoard.nodes[selectedNode]?.getTopBranch();
    const leftBranch = this.gameBoard.nodes[selectedNode]?.getLeftBranch();
    const bottomBranch = this.gameBoard.nodes[selectedNode]?.getBottomBranch();
    const rightBranch = this.gameBoard.nodes[selectedNode]?.getRightBranch();

    // type alias for branch player is attempting to place
    const placedBranch = this.gameBoard.branches[possibleBranch];

    // instant fail condition: player doesn't have required resources
    if (currentPlayer.redResources < 1 || currentPlayer.blueResources < 1) {
      return false;
    }

    // instant fail if branch is already owned
    if (placedBranch?.getOwner() === Owner.NONE) {

      // instant fail if branch is not connected to currentPlayer's node placed beforehand
      if (topBranch === possibleBranch ||
        leftBranch === possibleBranch ||
        bottomBranch === possibleBranch ||
        rightBranch === possibleBranch
      ) {

        // place branch and adjust resources for player 
        if (currentPlayer == this.playerOne) {
          placedBranch.setOwner(Owner.PLAYERONE);
          this.playerOne.ownedBranches.push(possibleBranch);
          this.playerOne.redResources--;
          this.playerOne.blueResources--;
        } else {
          placedBranch.setOwner(Owner.PLAYERTWO);
          this.playerTwo.ownedBranches.push(possibleBranch);
          this.playerTwo.redResources--;
          this.playerTwo.blueResources--;
        }

        // create branchPlacement object to push on current turn's stack of moves
        const branchPlacement = ['B', possibleBranch.toString()];
        this.stack.push(branchPlacement);
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


  // evaluates possibleNode, places in node position if legal, returns whether move is valid
  generalNodePlacement(possibleNode: number, currentPlayer: Player): boolean {

    // type aliasing for node's adjacent tiles index
    const trTileIndex = this.gameBoard.nodes[possibleNode]?.getTopRightTile();
    const brTileIndex = this.gameBoard.nodes[possibleNode]?.getBottomRightTile();
    const blTileIndex = this.gameBoard.nodes[possibleNode]?.getBottomLeftTile();
    const tlTileIndex = this.gameBoard.nodes[possibleNode]?.getTopLeftTile();

    // type aliasing for node's adjacent tiles
    const trTile = this.gameBoard.tiles[trTileIndex];
    const brTile = this.gameBoard.tiles[brTileIndex];
    const blTile = this.gameBoard.tiles[blTileIndex];
    const tlTile = this.gameBoard.tiles[tlTileIndex];

    // type aliasing for owners of node's adjacent branches
    const tbOwner = this.gameBoard.branches[this.gameBoard.nodes[possibleNode]?.getTopBranch()]?.getOwner();
    const lbOwner = this.gameBoard.branches[this.gameBoard.nodes[possibleNode]?.getLeftBranch()]?.getOwner();
    const bbOwner = this.gameBoard.branches[this.gameBoard.nodes[possibleNode]?.getBottomBranch()]?.getOwner();
    const rbOwner = this.gameBoard.branches[this.gameBoard.nodes[possibleNode]?.getRightBranch()]?.getOwner();

    // instant fail if player does not have enough of required resources
    if (currentPlayer.greenResources < 2 || currentPlayer.yellowResources < 2) {
      return false;
    }

    // instant fail if possibleNode is already owned
    if (this.gameBoard.nodes[possibleNode]?.getOwner() === Owner.NONE) {
      const nodeOwner = currentPlayer === this.playerOne ? Owner.PLAYERONE : Owner.PLAYERTWO;
      const otherOwner = currentPlayer === this.playerOne ? Owner.PLAYERTWO : Owner.PLAYERONE;

      // instant fail if possibleNode is not attached to one of currentPlayer's branches
      if (tbOwner === nodeOwner || lbOwner === nodeOwner || bbOwner === nodeOwner || rbOwner === nodeOwner) {

        // check if topRightTile of the possibleNode exists
        if (this.gameBoard.nodes[possibleNode]?.getTopRightTile() != -1) {
          // increment node count on the tile
          trTile.nodeCount++;

          // check if tile should be exhausted
          if ((trTile.nodeCount > trTile.maxNodes) && trTile?.isExhausted === false) {

            // checking if tile is not captured to set isExhausted and decrement tiles in tileExhaustion()
            if (trTile.capturedBy === Owner.NONE) {

              // update tile's stored exhaustion state 
              trTile.isExhausted = true;
              this.tileExhaustion(trTileIndex, true);
            }
          }

          // checks if player's resource production ought to be incremented
          if (trTile?.isExhausted === false && trTile.capturedBy !== otherOwner) {
            this.incrementResource(currentPlayer, trTile.getColor());
          }
        }

        // check if bottomRightTile of the possibleNode exists
        if (brTileIndex != -1) {

          // increment nodeCount on the tile
          brTile.nodeCount++;

          // check if tile should be exhausted
          if ((brTile.nodeCount > brTile.maxNodes) && brTile?.isExhausted === false) {

            // checking if tile is not captured to set isExhausted and decrement tiles in tileExhaustion()
            if (brTile.capturedBy === Owner.NONE) {

              // update tile's stored exhaustion state 
              brTile.isExhausted = true;
              this.tileExhaustion(brTileIndex, true);
            }
          }
        }

        // checks if player's resource production ought to be incremented
        if (brTile?.isExhausted === false &&
          brTile.capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, brTile.getColor());
        }
      }

      // check if bottomLeftTile of the possibleNode exists
      if (blTileIndex != -1) {

        // increment nodeCount on the tile
        blTile.nodeCount++;

        // check if tile shoudl be exhausted
        if ((blTile.nodeCount > blTile.maxNodes) && blTile?.isExhausted === false) {

          // checking if tile is not captured to set isExhausted and decrement tiles in tileExhaustion()
          if (blTile.capturedBy === Owner.NONE) {

            // update tile's stored exhaustion state
            blTile.isExhausted = true;
            this.tileExhaustion(blTileIndex, true);
          }
        }
        // checks if player's resource production ought to be incremented
        if (blTile?.isExhausted === false &&
          blTile.capturedBy != otherOwner) {
          this.incrementResource(currentPlayer, blTile.getColor());
        }
      }

      // check if topLeftTile of the possibleNode exists
      if (tlTileIndex != -1) {

        // increment nodeCount on the tile
        tlTile.nodeCount++;

        // check if tile should be exhausted 
        if ((tlTile.nodeCount > tlTile.maxNodes) && tlTile?.isExhausted === false) {

          // checking if tile is not captured to set isExhausted and decrement tiles in tileExhaustion()
          if (tlTile.capturedBy === Owner.NONE) {

            // update tile's stored exhaustion state 
            tlTile.isExhausted = true;
            this.tileExhaustion(tlTileIndex, true);
          }
        }

        // checks if player's resource production ought to be incremented
        if (tlTile?.isExhausted === false &&
          tlTile.capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, tlTile.getColor());
        }
      }

      // updates tile owner
      // updates currentPlayer's score metrics
      // updates currentPlayer's resource counts
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

      // create nodePlacement object to push on current turn's stack of moves
      const nodePlacement = ['N', possibleNode];
      this.stack.push(nodePlacement);
      return true;
    }
    else {
      return false;
    }
  }

  // branches placed after each player's two initial moves
  generalBranchPlacement(possibleBranch: number, currentPlayer: Player): boolean {

    // type aliasing for owners of adjacent branches
    const branch1Owner = this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch("branch1")]?.getOwner();
    const branch2Owner = this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch("branch2")]?.getOwner();
    const branch3Owner = this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch("branch3")]?.getOwner();
    const branch4Owner = this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch("branch4")]?.getOwner();
    const branch5Owner = this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch("branch5")]?.getOwner();
    const branch6Owner = this.gameBoard.branches[this.gameBoard.branches[possibleBranch].getBranch("branch6")]?.getOwner();

    // type alias for branch player is attempting to place
    const placedBranch = this.gameBoard.branches[possibleBranch];

    // instant fail condition: player doesn't have required resources
    if (currentPlayer.redResources < 1 || currentPlayer.blueResources < 1) {
      return false;
    }

    const otherPlayer = currentPlayer === this.playerOne ? this.playerTwo : this.playerOne;

    // fail condition: branch is adjacent to tile captured by other player
    for (let i = 0; i < otherPlayer.capturedTiles.length; i++) {

      // type aliasing for captured tile currently being evaluated from otherPlayer's set
      const currentCapturedTile = this.gameBoard.tiles[otherPlayer.capturedTiles[i]];

      if (currentCapturedTile.getTopBranch() === possibleBranch ||
        currentCapturedTile.getRightBranch() === possibleBranch ||
        currentCapturedTile.getBottomBranch() === possibleBranch ||
        currentCapturedTile.getLeftBranch() === possibleBranch) {
        return false;
      }
    }

    // fail condition: branch is already owned
    if (this.gameBoard.branches[possibleBranch].getOwner() === Owner.NONE) {

      const currentBranchOwner = currentPlayer === this.playerOne ? Owner.PLAYERONE : Owner.PLAYERTWO;

      // fail condition: branch is unconnected to currentPlayer's owned branches
      if (branch1Owner === currentBranchOwner ||
        branch2Owner === currentBranchOwner ||
        branch3Owner === currentBranchOwner ||
        branch4Owner === currentBranchOwner ||
        branch5Owner === currentBranchOwner ||
        branch6Owner === currentBranchOwner) {

        // updates placed branch's stored owner data
        // updates currentPlayer's owned branches
        // decrements currentPlayer's appropriate colored resources
        if (currentPlayer == this.playerOne) {
          placedBranch.setOwner(Owner.PLAYERONE);
          this.playerOne.ownedBranches.push(possibleBranch);
          this.playerOne.redResources--;
          this.playerOne.blueResources--;
        } else {
          placedBranch.setOwner(Owner.PLAYERTWO);
          this.playerTwo.ownedBranches.push(possibleBranch);
          this.playerTwo.redResources--;
          this.playerTwo.blueResources--;
        }
        // create branchPlacement object to push on current turn's stack of moves
        const branchPlacement = ['B', possibleBranch];
        this.stack.push(branchPlacement);
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

  // integrates w/ "Undo" UI button for taking back a general node placement before turn ends
  reverseNodePlacement(reverseNode: number, currentPlayer: Player): void {
    // set owner to none
    this.gameBoard.nodes[reverseNode].setOwner(Owner.NONE);

    // type aliasing for node's adjacent tiles index
    const trTileIndex = this.gameBoard.nodes[reverseNode]?.getTopRightTile();
    const brTileIndex = this.gameBoard.nodes[reverseNode]?.getBottomRightTile();
    const blTileIndex = this.gameBoard.nodes[reverseNode]?.getBottomLeftTile();
    const tlTileIndex = this.gameBoard.nodes[reverseNode]?.getTopLeftTile();

    // type aliasing for node's adjacent tiles
    const trTile = this.gameBoard.tiles[trTileIndex];
    const brTile = this.gameBoard.tiles[brTileIndex];
    const blTile = this.gameBoard.tiles[blTileIndex];
    const tlTile = this.gameBoard.tiles[tlTileIndex];

    // reverses currentPlayer's score metrics
    // reverses currentPlayer's spending of resources
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

    // check if topRightTile of the node exists
    if (trTileIndex !== -1) {

      // decrement the tile's nodeCount
      trTile.nodeCount--;

      // checking if need to un-exhaust tile
      if (trTile.isExhausted) {
        if (trTile.nodeCount <=
          trTile.maxNodes) {

          // update tile's stored exhaustion state 
          trTile.isExhausted = false;
          this.tileExhaustion(trTileIndex, false);
        }
      }
    }

    // check if topLeftTile of the node exists
    if (tlTileIndex !== -1) {

      // decrement the nodeCount
      tlTile.nodeCount--;

      // checking if need to un-exhaust tile
      if (tlTile.isExhausted) {
        if (tlTile.nodeCount <=
          tlTile.maxNodes) {

          // update tile's stored exhastion state 
          tlTile.isExhausted = false;
          this.tileExhaustion(tlTileIndex, false);
        }
      }
    }

    // check if bottomRightTile exists
    if (brTileIndex !== -1) {

      // decrement the tile's nodeCount 
      brTile.nodeCount--;

      // checking if need to un-exhaust tile
      if (brTile.isExhausted) {
        if (brTile.nodeCount <=
          brTile.maxNodes) {

          // update tile's stored exhaustion state
          brTile.isExhausted = false;
          this.tileExhaustion(brTileIndex, false);
        }
      }
    }

    // check if bottomLeftTile exists
    if (blTileIndex !== -1) {

      // decrement the tile's nodeCount
      blTile.nodeCount--;

      // checking if need to un-exhaust tile
      if (blTile.isExhausted) {
        if (blTile.nodeCount <=
          blTile.maxNodes) {

          // update tile's stored exhaustion state
          blTile.isExhausted = false;
          this.tileExhaustion(blTileIndex, false);
        }
      }
    }
  }

  // integrates w/ "Undo" UI button for taking back an initial node placement before turn ends
  reverseInitialNodePlacement(reverseNode: number, currentPlayer: Player): void {
    this.gameBoard.nodes[reverseNode].setOwner(Owner.NONE);
    if (currentPlayer === this.playerOne) {
      this.playerOne.numNodesPlaced--;
      this.playerOne.currentScore--;
    } else {
      this.playerTwo.numNodesPlaced--;
      this.playerTwo.currentScore--;
    }

    // type aliasing for node's adjacent tiles index
    const trTileIndex = this.gameBoard.nodes[reverseNode]?.getTopRightTile();
    const brTileIndex = this.gameBoard.nodes[reverseNode]?.getBottomRightTile();
    const blTileIndex = this.gameBoard.nodes[reverseNode]?.getBottomLeftTile();
    const tlTileIndex = this.gameBoard.nodes[reverseNode]?.getTopLeftTile();

    // type aliasing for node's adjacent tiles
    const trTile = this.gameBoard.tiles[trTileIndex];
    const brTile = this.gameBoard.tiles[brTileIndex];
    const blTile = this.gameBoard.tiles[blTileIndex];
    const tlTile = this.gameBoard.tiles[tlTileIndex];

    // check if topRightTile of node exists
    if (trTileIndex !== -1) {

      // decrement tile's nodeCount
      trTile.nodeCount--;

      // checking if need to un-exhaust tile
      if (trTile.isExhausted) {
        if (trTile.nodeCount <=
          trTile.maxNodes) {

          // update tile exhaustion state
          trTile.isExhausted = false;
          this.tileExhaustion(trTileIndex, false);
        }
      }
    }

    // check if topLeftTile of node exists
    if (tlTileIndex !== -1) {

      // decrement tile's nodeCount
      tlTile.nodeCount--;

      // checking if need to un-exhaust tile
      if (tlTile.isExhausted) {
        if (tlTile.nodeCount <=
          tlTile.maxNodes) {

          // update tile exhaustion state 
          tlTile.isExhausted = false;
          this.tileExhaustion(tlTileIndex, false);
        }
      }
    }

    // check if bottomRightTile exists
    if (brTileIndex != -1) {

      // decrement tile's nodeCount
      brTile.nodeCount--;

      // checking if need to un-exhaust tile
      if (brTile.isExhausted) {
        if (brTile.nodeCount <=
          brTile.maxNodes) {

          // update tile exhaustion state
          brTile.isExhausted = false;
          this.tileExhaustion(brTileIndex, false);
        }
      }
    }

    // check if bottomLeftTile exists
    if (blTileIndex != -1) {

      // decrement tile's nodeCount
      blTile.nodeCount--;

      // checking if need to un-exhaust tile
      if (blTile.isExhausted) {
        if (blTile.nodeCount <=
          blTile.maxNodes) {

          // update tile exhaustion state
          blTile.isExhausted = false;
          this.tileExhaustion(blTileIndex, false);
        }
      }
    }
  }

  // integrates w/ "Undo" UI button for taking back a general branch placement before turn ends
  reverseBranchPlacement(reverseBranch: number, currentPlayer: Player): void {

    // set branch owner to node
    this.gameBoard.branches[reverseBranch].setOwner(Owner.NONE);

    if (currentPlayer === this.playerOne) {

      // remeove branch from player's ownedBranches[]
      this.playerOne.ownedBranches.pop();

      // reverses resources spent
      this.playerOne.redResources++;
      this.playerOne.blueResources++;
    } else {

      // remeove branch from player's ownedBranches[]
      this.playerTwo.ownedBranches.pop();

      // reverses resources spent
      this.playerTwo.redResources++;
      this.playerTwo.blueResources++;
    }
  }

  // integrates w/ "Undo" UI button for taking back an initial branch placement before turn ends
  reverseInitialBranchPlacement(reverseBranch: number): void {

    // set branch owner to none
    this.gameBoard.branches[reverseBranch].setOwner(Owner.NONE);

    // remove branch from player's ownedBranches[]
    this.getCurrentPlayer().ownedBranches.pop();
  }

  // performs adjusting of resourcesPerTurn per player based on tile exhaustion states
  tileExhaustion(tileNum: number, setAsExhausted: boolean): void {

    // type aliasing for owners of tile's adjacent nodes
    const trNodeOwner = this.gameBoard.nodes[this.gameBoard.tiles[tileNum]?.getTopRightNode()]?.getOwner();
    const brNodeOwner = this.gameBoard.nodes[this.gameBoard.tiles[tileNum]?.getBottomRightNode()]?.getOwner();
    const blNodeOwner = this.gameBoard.nodes[this.gameBoard.tiles[tileNum]?.getBottomLeftNode()]?.getOwner();
    const tlNodeOwner = this.gameBoard.nodes[this.gameBoard.tiles[tileNum]?.getTopLeftNode()]?.getOwner();

    // type aliasing for tileNum's color
    const currentTileColor = this.gameBoard.tiles[tileNum].color;

    // checks if tile is newly exhausted
    if (setAsExhausted) {

      // checks if playerOne owns tile's topRightNode
      if (trNodeOwner === Owner.PLAYERONE) {
        // decrement resourcePerTurn of tile's color from playerOne
        this.decrementResource(this.playerOne, currentTileColor);
      }
      // checks if playerTwo owns tile's topRightNode 
      else if (trNodeOwner === Owner.PLAYERTWO) {
        // decrement resourcePerTurn of tile's color from playerTwo
        this.decrementResource(this.playerTwo, currentTileColor);
      }

      // checks if playerOne owns tile's bottomRightNode
      if (brNodeOwner === Owner.PLAYERONE) {
        // decrement resourcePerTurn of tile's color from playerOne
        this.decrementResource(this.playerOne, currentTileColor);
      }
      // checks if playerTwo owns tile's bottomRightNode  
      else if (brNodeOwner === Owner.PLAYERTWO) {
        // decrement resourcePerTurn of tile's color from playerTwo
        this.decrementResource(this.playerTwo, currentTileColor);
      }

      // checks if playerOne owns tile's bottomLeftNode
      if (blNodeOwner === Owner.PLAYERONE) {
        // decrement resourcePerTurn of tile's color from playerOne
        this.decrementResource(this.playerOne, currentTileColor);
      }
      // checks if playerTwo owns tile's bottomLeftNode 
      else if (blNodeOwner === Owner.PLAYERTWO) {
        // decrement resourcePerTurn of tile's color from playerTwo
        this.decrementResource(this.playerTwo, currentTileColor);
      }

      // checks if playerOne owns tile's topLeftNode
      if (tlNodeOwner === Owner.PLAYERONE) {
        // decrement resourcePerTurn of tile's color from playerOne
        this.decrementResource(this.playerOne, currentTileColor);
      }
      // checks if playerTwo owns tile's topLeftNode 
      else if (tlNodeOwner === Owner.PLAYERTWO) {
        // decrement resourcePerTurn of tile's color from playerTwo
        this.decrementResource(this.playerTwo, currentTileColor);
      }
    }

    // tile was exhausted but no longer is
    else {

      // checks if playerOne owns tile's topRightNode
      if (trNodeOwner === Owner.PLAYERONE) {
        // increment resourcePerTurn of tile's color from playerOne
        this.incrementResource(this.playerOne, currentTileColor);
      }
      // checks if playerTwo owns tile's topRightNode 
      else if (trNodeOwner === Owner.PLAYERTWO) {
        // increment resourcePerTurn of tile's color from playerTwo
        this.incrementResource(this.playerTwo, currentTileColor);
      }

      // checks if playerOne owns tile's bottomRightNode
      if (brNodeOwner === Owner.PLAYERONE) {
        // increment resourcePerTurn of tile's color from playerOne
        this.incrementResource(this.playerOne, currentTileColor);
      }
      // checks if playerTwo owns tile's bottomRightNode 
      else if (brNodeOwner === Owner.PLAYERTWO) {
        // increment resourcePerTurn of tile's color from playerTwo
        this.incrementResource(this.playerTwo, currentTileColor);
      }

      // checks if playerOne owns tile's bottomLeftNode
      if (blNodeOwner === Owner.PLAYERONE) {
        // increment resourcePerTurn of tile's color from playerOne
        this.incrementResource(this.playerOne, currentTileColor);
      }
      // checks if playerTwo owns tile's bottomLeftNode 
      else if (blNodeOwner === Owner.PLAYERTWO) {
        // increment resourcePerTurn of tile's color from playerTwo
        this.incrementResource(this.playerTwo, currentTileColor);
      }

      // checks if playerOne owns tile's topLeftNode
      if (tlNodeOwner === Owner.PLAYERONE) {
        // increment resourcePerTurn of tile's color from playerOne
        this.incrementResource(this.playerOne, currentTileColor);
      }
      // checks if playerTwo owns tile's topLeftNode 
      else if (tlNodeOwner === Owner.PLAYERTWO) {
        // increment resourcePerTurn of tile's color from playerTwo
        this.incrementResource(this.playerTwo, currentTileColor);
      }
    }

  }

  // decrements resourcePerTurn of currentTileColor from nodeOwner
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
        if (nodeOwner.yellowPerTurn > 0)
          nodeOwner.yellowPerTurn--;
        break;
      case TileColor.GREEN:
        if (nodeOwner.greenPerTurn > 0)
          nodeOwner.greenPerTurn--;
        break;
    }
  }

  // increments resourcePerTurn of currentTileColor from nodeOwner
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

  // increments one resource of currentTileColor from currentPlayer
  incrementResourceByOne(currentPlayer: Player, currentTileColor: string): void {
    switch (currentTileColor) {
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

  // decrements one resource of currentTileColor from currentPlayer
  decrementResourceByOne(currentPlayer: Player, currentTileColor: string): void {
    switch (currentTileColor) {
      case 'R':
        currentPlayer.redResources--;
        break;
      case 'B':
        currentPlayer.blueResources--;
        break;
      case 'Y':
        currentPlayer.yellowResources--;
        break;
      case 'G':
        currentPlayer.greenResources--;
        break;
    }
  }

  // checks all possible branch paths within a player's branch network
  // updates player's currentLongest path upon completion of recursive calls
  checkForLongest(branchOwner: Player, currentBranch: number): void {

    // type aliasing for adjacent branches
    const branch1 = this.gameBoard.branches[currentBranch].getBranch("branch1");
    const branch2 = this.gameBoard.branches[currentBranch].getBranch("branch2");
    const branch3 = this.gameBoard.branches[currentBranch].getBranch("branch3");
    const branch4 = this.gameBoard.branches[currentBranch].getBranch("branch4");
    const branch5 = this.gameBoard.branches[currentBranch].getBranch("branch5");
    const branch6 = this.gameBoard.branches[currentBranch].getBranch("branch6");

    // type aliasing for stored owners of adjacent branches
    const storedBranch1Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch1')]?.getOwner();
    const storedBranch2Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch2')]?.getOwner();
    const storedBranch3Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch3')]?.getOwner();
    const storedBranch4Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch4')]?.getOwner();
    const storedBranch5Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch5')]?.getOwner();
    const storedBranch6Owner = this.gameBoard.branches[this.gameBoard.branches[currentBranch].getBranch('branch6')]?.getOwner();

    // base case: branch has already been evaluated in constructing paths for this recursive cycle
    if (branchOwner.branchScanner.includes(currentBranch) === true) {
      return;
    }

    branchOwner.branchScanner.push(currentBranch);
    branchOwner.currentLength++;

    // setting default adjacent branch ownership (local)
    let branch1Owner = Owner.NONE;
    let branch2Owner = Owner.NONE;
    let branch3Owner = Owner.NONE;
    let branch4Owner = Owner.NONE;
    let branch5Owner = Owner.NONE;
    let branch6Owner = Owner.NONE;

    // updates branchOwner's currentLongest path dynamically amongst recursive calls
    if (branchOwner.currentLength > branchOwner.currentLongest) {
      branchOwner.currentLongest = branchOwner.currentLength;
    }

    // updates adjacent branches' owners (if branch exists)
    if (branch1 !== -1) {
      branch1Owner = storedBranch1Owner;
    }
    if (branch2 !== -1) {
      branch2Owner = storedBranch2Owner;
    }
    if (branch3 !== -1) {
      branch3Owner = storedBranch3Owner;
    }
    if (branch4 !== -1) {
      branch4Owner = storedBranch4Owner;
    }
    if (branch5 !== -1) {
      branch5Owner = storedBranch5Owner;
    }
    if (branch6 !== -1) {
      branch6Owner = storedBranch6Owner;
    }

    // calls checkForLongest on branches adjacent to currentBranch owned by branchOwner
    if (branchOwner === this.playerOne) {
      if (branch1Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, branch1);
      }
      if (branch2Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, branch2);
      }
      if (branch3Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, branch3);
      }
      if (branch4Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, branch4);
      }
      if (branch5Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, branch5);
      }
      if (branch6Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, branch6);
      }
    } else {
      if (branch1Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, branch1);
      }
      if (branch2Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, branch2);
      }
      if (branch3Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, branch3);
      }
      if (branch4Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, branch4);
      }
      if (branch5Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, branch5);
      }
      if (branch6Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, branch6);
      }
    }

    //branchOwner.branchScanner.pop();
  }

  // recursively evaluates board for single-tile and multi-tile captures
  checkForCaptures(capturer: Player, checkTile: number): boolean {

    // default assigns true for captured
    // algorithm operates by assuming tile is captured until proven otherwise
    let captured = true;

    // checks if tile passed has already been evaluated during current recursive cycle
    // prevents infinite recursion
    if (this.tilesBeingChecked.includes(checkTile)) {
      return captured;
    }

    const otherPlayer = capturer === this.playerOne ? Owner.PLAYERTWO : Owner.PLAYERONE;

    // type aliasing for tile being evaluated and its adjacent branches
    const currentTile = this.gameBoard.tiles[checkTile];
    const tileTopBranch = this.gameBoard.branches[currentTile.getTopBranch()];
    const tileRightBranch = this.gameBoard.branches[currentTile.getRightBranch()];
    const tileBottomBranch = this.gameBoard.branches[currentTile.getBottomBranch()];
    const tileLeftBranch = this.gameBoard.branches[currentTile.getLeftBranch()];

    // checks first instant fail condition: opponent has claimed any branches surrounding tile being checked
    if (tileTopBranch?.getOwner() === otherPlayer ||
      tileRightBranch?.getOwner() === otherPlayer ||
      tileBottomBranch?.getOwner() === otherPlayer ||
      tileLeftBranch?.getOwner() === otherPlayer) {
      captured = false;
    }
    // checks second instant fail condition: no other tile adjacent to one of current tile's empty-branch sides
    else if ((tileTopBranch?.getOwner() === Owner.NONE && currentTile.getTopTile() === -1) ||
      (tileRightBranch?.getOwner() === Owner.NONE && currentTile.getRightTile() === -1) ||
      (tileBottomBranch?.getOwner() === Owner.NONE && currentTile.getBottomTile() === -1) ||
      (tileLeftBranch?.getOwner() === Owner.NONE && currentTile.getLeftTile() === -1)) {
      captured = false;
    }

    // begins evaluating other tiles for fail conditions
    else {

      // pushes tile currently being evaluated onto stack to prevent infinite recursion
      this.tilesBeingChecked.push(checkTile);

      // performs recursive calls on adjacent tiles yet to reach fail conditions
      // allows checking for multi-tile captures
      if (tileTopBranch?.getOwner() === Owner.NONE) {
        if (this.checkForCaptures(capturer, currentTile.getTopTile()) === false) {
          captured = false;
        }
      }
      if (tileRightBranch?.getOwner() === Owner.NONE) {
        if (this.checkForCaptures(capturer, currentTile.getRightTile()) === false) {
          captured = false;
        }
      }
      if (tileBottomBranch?.getOwner() === Owner.NONE) {
        if (this.checkForCaptures(capturer, currentTile.getBottomTile()) === false) {
          captured = false;
        }
      }
      if (tileLeftBranch?.getOwner() === Owner.NONE) {
        if (this.checkForCaptures(capturer, currentTile.getLeftTile()) === false) {
          captured = false;
        }
      }
    }
    return captured;
  }
}
