import { GameBoard } from '../gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';
import { CoreLogic } from '../../util/core-logic.util';
import { Owner, TileColor } from '../../enums/game.enums';

export class State {
  
  move:string;

  board:GameBoard;
  player1:Player;
  player2:Player;

  playerNumber:number;

  visitCount:number;
  winScore:number;


  tilesBeingChecked:number[];

  constructor(newBoard:GameBoard, player1:Player, player2:Player){
    this.setBoard(newBoard);
    this.setPlayer1(player1);
    this.setPlayer2(player2);

    this.playerNumber = 1;
    this.visitCount = 0;
    this.winScore = 0;
    this.move = '';

    this.tilesBeingChecked = [];

  }


  getAllPossibleStates():Array<State>{
    // constructs a list of all possible states from current state
    console.log(this.playerNumber);
   
    let nextPlayer;
    if(this.player1.numNodesPlaced === 1 && this.player2.numNodesPlaced === 1){
      nextPlayer = this.playerNumber;
    }
    else{
      nextPlayer = 3 - this.playerNumber;
    }
  


    const moves = CoreLogic.getLegalMoves(this,false);

    const states = [];

    for(const move of moves){
      const newState = this.cloneState();
      newState.move = move;
      
      newState.playerNumber = nextPlayer;
      
      newState.applyMove(move);

      states.push(newState);
    }

    return states;
  }

  randomPlay():void{
    /* get a list of all possible positions on the board and 
           play a random move */
    let start = Date.now();
    const moves = CoreLogic.getLegalMoves(this,true);
    console.log(`In simulation: Time to generate moves = ${Date.now()-start}ms`);

    // start = Date.now();
    // const index = Math.floor(Math.random() * moves.length);
    // console.log( `Inside simulation: Time to pick random move = ${Date.now()-start}ms`);
    let maxWeight = 0;
    let maxWeightIndex = Math.floor(Math.random() * moves.length);
    start = Date.now();
    for(let i = 0; i < moves.length; i++){
      const localWeight = this.moveWeighting(moves[i]);
      if(localWeight > maxWeight){
        maxWeight = localWeight;
        maxWeightIndex = i;
      }
    }
    console.log( `Inside simulation: Time to pick weighted move = ${Date.now()-start}ms`);

    start = Date.now();
    this.applyMove(moves[maxWeightIndex]);
    console.log(`Inside simulation: Time to apply chosen move = ${Date.now()-start}ms`);
  }

  moveWeighting(move:string):number{
    const currentOwner = this.playerNumber === 1 ? Owner.PLAYERONE : Owner.PLAYERTWO;
    const moveObj = CoreLogic.stringToMove(move);

    const horizontalBranches = [0,3,4,5,10,11,12,13,14,21,22,23,24,25,30,31,32,35];
    //const verticalBranches = [1,2,6,7,8,9,15,16,17,18,19,20,26,27,28,29,33,34];

    let resultWeight = 0;

    resultWeight += moveObj.nodesPlaced.length;

    resultWeight += moveObj.branchesPlaced.length;

    for(let i = 0; i < moveObj.branchesPlaced.length; i++){
      if(horizontalBranches.includes(moveObj.branchesPlaced[i])){
        const topNeighbors = [this.board.branches[moveObj.branchesPlaced[i]].getBranch('branch1'),this.board.branches[moveObj.branchesPlaced[i]].getBranch('branch2')];
        const sideNeighbors = [this.board.branches[moveObj.branchesPlaced[i]].getBranch('branch3'),this.board.branches[moveObj.branchesPlaced[i]].getBranch('branch6')];
        const bottomNeighbors = [this.board.branches[moveObj.branchesPlaced[i]].getBranch('branch4'),this.board.branches[moveObj.branchesPlaced[i]].getBranch('branch5')];
        if(!topNeighbors.includes(-1)){
          if(this.board.branches[topNeighbors[0]].getOwner() === currentOwner && this.board.branches[topNeighbors[1]].getOwner() === currentOwner){
            resultWeight++;
          }
        }
        else if(!sideNeighbors.includes(-1)){
          if(this.board.branches[sideNeighbors[0]].getOwner() === currentOwner && this.board.branches[sideNeighbors[1]].getOwner() === currentOwner){
            resultWeight++;
          }
        }
        else if(!bottomNeighbors.includes(-1)){
          if(this.board.branches[bottomNeighbors[0]].getOwner() === currentOwner && this.board.branches[bottomNeighbors[1]].getOwner() === currentOwner){
            resultWeight++;
          }
        }
      }
      else{
        const rightNeighbors = [this.board.branches[moveObj.branchesPlaced[i]].getBranch('branch2'),this.board.branches[moveObj.branchesPlaced[i]].getBranch('branch3')];
        const topAndBottomNeighbors = [this.board.branches[moveObj.branchesPlaced[i]].getBranch('branch1'),this.board.branches[moveObj.branchesPlaced[i]].getBranch('branch4')];
        const leftNeighbors = [this.board.branches[moveObj.branchesPlaced[i]].getBranch('branch5'),this.board.branches[moveObj.branchesPlaced[i]].getBranch('branch6')];
        if(!rightNeighbors.includes(-1)){
          if(this.board.branches[rightNeighbors[0]].getOwner() === currentOwner && this.board.branches[rightNeighbors[1]].getOwner() === currentOwner){
            resultWeight++;
          }
        }
        else if(!topAndBottomNeighbors.includes(-1)){
          if(this.board.branches[topAndBottomNeighbors[0]].getOwner() === currentOwner && this.board.branches[topAndBottomNeighbors[1]].getOwner() === currentOwner){
            resultWeight++;
          }
        }
        else if(!leftNeighbors.includes(-1)){
          if(this.board.branches[leftNeighbors[0]].getOwner() === currentOwner && this.board.branches[leftNeighbors[1]].getOwner() === currentOwner){
            resultWeight++;
          }
        }
      }
    }
    
    return resultWeight;
  }

  setBoard(gameBoard:GameBoard):void{
    this.board = CoreLogic.cloneGameBoard(gameBoard);
  }

  setPlayer1(player:Player):void{
    this.player1 = CoreLogic.clonePlayer(player);
  }

  setPlayer2(player:Player):void{
    this.player2 = CoreLogic.clonePlayer(player);
  }

  getBoard():GameBoard{
    return this.board;
  }

  setPlayerNo(nextPlayer:number):void{
    if(this.player1.numNodesPlaced >= 1 && this.player2.numNodesPlaced !== 1){
      this.playerNumber = nextPlayer;
    }
  }

  getMove():string{
    return this.move;
  }

  getVisitCount():number{
    return this.visitCount;
  }

  getWinScore():number{
    return this.winScore;
  }

  setWinScore(score:number):void{
    this.winScore = score;
  }

  togglePlayer():void{
    if(this.player1.numNodesPlaced === 1 && this.player2.numNodesPlaced === 1){
      this.playerNumber = 2;
    }
    else{
      this.playerNumber = 3 - this.playerNumber;
    }
  }

  incrementVisit():void{
    this.visitCount++;
  }



  getPlayerNo():number{
    return this.playerNumber;
  }

  addScore(score:number):void{
    this.winScore += score;
  }

  getOpponent():number{
    let result;
    if(this.player1.numNodesPlaced === 1 && this.player2.numNodesPlaced === 1){
      result = this.playerNumber;
    }
    else{
      result =  3 - this.playerNumber;
    }
    return result;
  }

  cloneState():State{
    const newState = new State(this.getBoard(), this.player1, this.player2);

    newState.move = this.move;
    newState.playerNumber = this.playerNumber;
    newState.visitCount = this.visitCount;
    newState.winScore = this.winScore;
    newState.tilesBeingChecked = this.tilesBeingChecked.slice();

    return newState;
  }

  applyMove(moveString: string):void{
    let currentPlayer;
    if (this.playerNumber === 1) {
      currentPlayer = this.player1;
    } else {
      currentPlayer = this.player2;
    }

    const moveToPlace = CoreLogic.stringToMove(moveString);

    // process trade
    if (moveToPlace.tradedIn.length > 0) {
      for (let i = 0; i < moveToPlace.tradedIn.length; i++) {
        this.decrementResourceByOne(currentPlayer, moveToPlace.tradedIn[i]);
      }
      // add in resource traded for 
      this.incrementResourceByOne(currentPlayer, moveToPlace.received);
    }

    // inital placements
    if (currentPlayer.ownedBranches.length < 2) {
      this.initialNodePlacements(moveToPlace.nodesPlaced[0], currentPlayer);
      this.initialBranchPlacements(moveToPlace.nodesPlaced[0], moveToPlace.branchesPlaced[0], currentPlayer);
    } else {
      // process general branches
      for (let i = 0; i < moveToPlace.branchesPlaced.length; i++) {
        this.generalBranchPlacement(moveToPlace.branchesPlaced[i], currentPlayer);
      }

      // process general nodes
      for (let i = 0; i < moveToPlace.nodesPlaced.length; i++) {
        this.generalNodePlacement(moveToPlace.nodesPlaced[i], currentPlayer);
      }
    }

    this.endTurn(currentPlayer);
  }

  endTurn(endPlayer: Player): void {
    const otherPlayer = endPlayer === this.player1 ? this.player2 : this.player1;
    const otherOwner = endPlayer === this.player1 ? Owner.PLAYERTWO : Owner.PLAYERONE;
    const currentOwner = endPlayer === this.player1 ? Owner.PLAYERONE : Owner.PLAYERTWO;

    for (let i = 0; i < this.board.tiles.length; i++) {
      if (this.checkForCaptures(endPlayer, i) === true) {
        this.board.tiles[i].setCapturedBy(currentOwner);

        // if new owner has nodes, give them resources per turn
        const trNode = this.board.nodes[this.board.tiles[i].getTopRightNode()];
        const brNode = this.board.nodes[this.board.tiles[i].getBottomRightNode()];
        const blNode = this.board.nodes[this.board.tiles[i].getBottomLeftNode()];
        const tlNode = this.board.nodes[this.board.tiles[i].getTopLeftNode()];

        const currentTileColor = this.board.tiles[i].getColor();
        let newCapture = true;
        for (let z = 0; z < endPlayer.capturedTiles.length; z++) {
          if (endPlayer.capturedTiles[z] === i) {
            newCapture = false;
          }
        }

        if (newCapture === true) {
          if (this.board.tiles[i].isExhausted) {
            this.board.tiles[i].isExhausted = false;

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


          this.board.tiles[i].setCapturedBy(currentOwner);

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

    for (let i = 0; i < endPlayer.ownedBranches.length; i++) {
      endPlayer.currentLength = 0;
      endPlayer.branchScanner = [];

      this.checkForLongest(endPlayer, endPlayer.ownedBranches[i]);
    }

    // updates scores and player data regarding hasLongestNetwork
    if ((this.player1.currentLongest > this.player2.currentLongest) && this.player1.hasLongestNetwork === false) {
      this.player1.hasLongestNetwork = true;
      this.player1.currentScore += 2;
      if (this.player2.hasLongestNetwork === true) {
        this.player2.hasLongestNetwork = false;
        this.player2.currentScore -= 2;
      }
    } else if ((this.player2.currentLongest > this.player1.currentLongest) && this.player2.hasLongestNetwork === false) {
      this.player2.hasLongestNetwork = true;
      this.player2.currentScore += 2;
      if (this.player1.hasLongestNetwork === true) {
        this.player1.hasLongestNetwork = false;
        this.player1.currentScore -= 2;
      }
    } else if (this.player1.currentLongest === this.player2.currentLongest) {
      if (this.player1.hasLongestNetwork === true) {
        this.player1.hasLongestNetwork = false;
        this.player1.currentScore -= 2;
      } else if (this.player2.hasLongestNetwork === true) {
        this.player2.hasLongestNetwork = false;
        this.player2.currentScore -= 2;
      }
    }

    if (CoreLogic.getWinner(this) === 0) {
      const newPlayer = endPlayer === this.player1 ? this.player2 : this.player1;

      

      //Set resources if still opening moves
      if (endPlayer.numNodesPlaced < 2 && endPlayer.ownedBranches.length < 2) {
        endPlayer.redResources = 1;
        endPlayer.blueResources = 1;
        endPlayer.yellowResources = 2;
        endPlayer.greenResources = 2;
      }
      else{
        //update resources for newPlayer
        newPlayer.redResources += newPlayer.redPerTurn;
        newPlayer.blueResources += newPlayer.bluePerTurn;
        newPlayer.yellowResources += newPlayer.yellowPerTurn;
        newPlayer.greenResources += newPlayer.greenPerTurn;
      }

      

      // if (endPlayer.numNodesPlaced === 1 && newPlayer.numNodesPlaced === 1) {
      //   // if (this.currentGameMode === GameType.AI && this.player1.type === PlayerType.AI) {
      //   //   this.ai.currentState = CoreLogic.nextState(this.ai.currentState, this.serializeStack());
      //   // }

      //   //this.nextTurn(endPlayer);
      //   return;
      // }

      //this.currentPlayer = endPlayer === this.player1 ? Owner.PLAYERTWO : Owner.PLAYERONE;
      //this.nextTurn(newPlayer);
    }
  }

  initialNodePlacements(possibleNode: number, currentPlayer: Player): boolean {
    const otherOwner = currentPlayer === this.player1 ? Owner.PLAYERTWO : Owner.PLAYERONE;
    const currentOwner = currentPlayer === this.player1 ? Owner.PLAYERONE : Owner.PLAYERTWO;

    if (this.board.nodes[possibleNode]?.getOwner() === Owner.NONE) {
      
      if (this.board.nodes[possibleNode]?.getTopRightTile() !== -1) {
        this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()].nodeCount++;
        
        if ((this.board.tiles[this.board.nodes[possibleNode]?.getTopRightTile()].nodeCount >
          this.board.tiles[this.board.nodes[possibleNode]?.getTopRightTile()].maxNodes) &&
          this.board.tiles[this.board.nodes[possibleNode]?.getTopRightTile()].isExhausted === false) {
          // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
          if (this.board.tiles[this.board.nodes[possibleNode]?.getTopRightTile()].capturedBy === Owner.NONE) {
            this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()].isExhausted = true;
            
            this.tileExhaustion(this.board.nodes[possibleNode].getTopRightTile(), true);
            
          }
        }

        // checks for if resource productions ought to be incremented
        if (this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()].isExhausted === false &&
          this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()].capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()].getColor());
        }
      }

      if (this.board.nodes[possibleNode]?.getBottomRightTile() !== -1) {
        this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].nodeCount++;
        
        if ((this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].nodeCount >
          this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].maxNodes) &&
          this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].isExhausted === false) {
          // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
          if (this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].capturedBy === Owner.NONE) {
            this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].isExhausted = true;
            
            this.tileExhaustion(this.board.nodes[possibleNode].getBottomRightTile(), true);
           
          }
        }
        // checks for if resource productions ought to be incremented
        if (this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].isExhausted === false &&
          this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].capturedBy !== otherOwner)
          this.incrementResource(currentPlayer, this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].getColor());
      }

      if (this.board.nodes[possibleNode]?.getBottomLeftTile() !== -1) {
        this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].nodeCount++;
        
        if ((this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].nodeCount >
          this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].maxNodes) &&
          this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].isExhausted === false) {
          // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
          if (this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].capturedBy === Owner.NONE) {
            this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].isExhausted = true;
   

            this.tileExhaustion(this.board.nodes[possibleNode].getBottomLeftTile(), true);
            
          }
        }

        // checks for if resource productions ought to be incremented
        if (this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].isExhausted === false &&
          this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].getColor());
        }
      }

      if (this.board.nodes[possibleNode]?.getTopLeftTile() != -1) {
        this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].nodeCount++;
      
        if ((this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].nodeCount >
          this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].maxNodes) &&
          this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].isExhausted === false) {

          // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
          if (this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].capturedBy === Owner.NONE) {
            this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].isExhausted = true;
            

            this.tileExhaustion(this.board.nodes[possibleNode].getTopLeftTile(), true);
            

          }
        }
        // checks for if resource productions ought to be incremented
        if (this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].isExhausted === false &&
          this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].getColor());
        }
      }

      if (currentPlayer == this.player1) {
        this.board.nodes[possibleNode].setOwner(Owner.PLAYERONE);
        this.player1.numNodesPlaced++;
        this.player1.currentScore++;
        this.player1.greenResources-=2;
        this.player1.yellowResources-=2;
      } else {
        this.board.nodes[possibleNode].setOwner(Owner.PLAYERTWO);
        this.player2.numNodesPlaced++;
        this.player2.currentScore++;
        this.player2.greenResources-=2;
        this.player2.yellowResources-=2;
      }
      
      return true;
    } else {
      return false;
    }
  }

  initialBranchPlacements(selectedNode: number, possibleBranch: number, currentPlayer: Player): boolean {
    if (this.board.branches[possibleBranch]?.getOwner() === Owner.NONE) {
      if (this.board.nodes[selectedNode]?.getTopBranch() === possibleBranch ||
        this.board.nodes[selectedNode]?.getLeftBranch() === possibleBranch ||
        this.board.nodes[selectedNode]?.getBottomBranch() === possibleBranch ||
        this.board.nodes[selectedNode]?.getRightBranch() === possibleBranch
      ) {
        if (currentPlayer == this.player1) {
          this.board.branches[possibleBranch].setOwner(Owner.PLAYERONE);
          this.player1.ownedBranches.push(possibleBranch);
          this.player1.redResources--;
          this.player1.blueResources--;
        } else {
          this.board.branches[possibleBranch].setOwner(Owner.PLAYERTWO);
          this.player2.ownedBranches.push(possibleBranch);
          this.player2.redResources--;
          this.player2.blueResources--;
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

    if (this.board.nodes[possibleNode]?.getOwner() === Owner.NONE) {
      const nodeOwner = currentPlayer === this.player1 ? Owner.PLAYERONE : Owner.PLAYERTWO;
      const otherOwner = currentPlayer === this.player1 ? Owner.PLAYERTWO : Owner.PLAYERONE;


      if (this.board.branches[this.board.nodes[possibleNode]?.getTopBranch()]?.getOwner() === nodeOwner ||
        this.board.branches[this.board.nodes[possibleNode]?.getLeftBranch()]?.getOwner() === nodeOwner ||
        this.board.branches[this.board.nodes[possibleNode]?.getBottomBranch()]?.getOwner() === nodeOwner ||
        this.board.branches[this.board.nodes[possibleNode]?.getRightBranch()]?.getOwner() === nodeOwner) {

        
        // add to nodeCount of tiles and check for if it has been exhaused
        if (this.board.nodes[possibleNode]?.getTopRightTile() != -1) {
          this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()].nodeCount++;

          if ((this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()].nodeCount >
            this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()].maxNodes) &&
            this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()]?.isExhausted === false) {
            // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
            if (this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()].capturedBy === Owner.NONE) {
              this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()].isExhausted = true;
              this.tileExhaustion(this.board.nodes[possibleNode].getTopRightTile(), true);
            }
          }

          // checks for if resource productions ought to be incremented
          if (this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()]?.isExhausted === false &&
            this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()].capturedBy !== otherOwner) {
            this.incrementResource(currentPlayer, this.board.tiles[this.board.nodes[possibleNode].getTopRightTile()].getColor());
          }
        }

        if (this.board.nodes[possibleNode]?.getBottomRightTile() != -1) {
          this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].nodeCount++;

          if ((this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].nodeCount >
            this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].maxNodes) &&
            this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()]?.isExhausted === false) {

            // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
            if (this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].capturedBy === Owner.NONE) {
              this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].isExhausted = true;
              this.tileExhaustion(this.board.nodes[possibleNode].getBottomRightTile(), true);
            }
          }
        }

        // checks for if resource productions ought to be incremented
        if (this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()]?.isExhausted === false &&
          this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, this.board.tiles[this.board.nodes[possibleNode].getBottomRightTile()].getColor());
        }
      }

      if (this.board.nodes[possibleNode]?.getBottomLeftTile() != -1) {
        this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].nodeCount++;

        if ((this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].nodeCount >
          this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].maxNodes) &&
          this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()]?.isExhausted === false) {

          // checking if tile is captured to set activelyExhausted and decrement tiles in tileExhaustion
          if (this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].capturedBy === Owner.NONE) {
            this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].isExhausted = true;
            this.tileExhaustion(this.board.nodes[possibleNode].getBottomLeftTile(), true);
          }
        }
        // checks for if resource productions ought to be incremented
        if (this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()]?.isExhausted === false &&
          this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].capturedBy != otherOwner) {
          this.incrementResource(currentPlayer, this.board.tiles[this.board.nodes[possibleNode].getBottomLeftTile()].getColor());
        }
      }

      if (this.board.nodes[possibleNode]?.getTopLeftTile() != -1) {
        this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].nodeCount++;

        if ((this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].nodeCount >
          this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].maxNodes) &&
          this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()]?.isExhausted === false) {

          // checking if tile is captured to set isExhausted and decrement tiles in tileExhaustion
          if (this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].capturedBy === Owner.NONE) {
            this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].isExhausted = true;
            this.tileExhaustion(this.board.nodes[possibleNode].getTopLeftTile(), true);
          }
        }
        // checks for if resource productions ought to be incremented
        if (this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()]?.isExhausted === false &&
          this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].capturedBy !== otherOwner) {
          this.incrementResource(currentPlayer, this.board.tiles[this.board.nodes[possibleNode].getTopLeftTile()].getColor());
        }
      }

      if (currentPlayer === this.player1) {
        this.board.nodes[possibleNode].setOwner(Owner.PLAYERONE);
        this.player1.greenResources -= 2;
        this.player1.yellowResources -= 2;
        this.player1.numNodesPlaced++;
        this.player1.currentScore++;
      } else {
        this.board.nodes[possibleNode].setOwner(Owner.PLAYERTWO);
        this.player2.greenResources -= 2;
        this.player2.yellowResources -= 2;
        this.player2.numNodesPlaced++;
        this.player2.currentScore++;
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

    const otherPlayer = currentPlayer === this.player1 ? this.player2 : this.player1;

    // fail condition: branch is adjacent to tile captured by other player
    for (let i = 0; i < otherPlayer.capturedTiles.length; i++) {
      const currentCapturedTile = this.board.tiles[otherPlayer.capturedTiles[i]];
      if (currentCapturedTile.getTopBranch() === possibleBranch ||
        currentCapturedTile.getRightBranch() === possibleBranch ||
        currentCapturedTile.getBottomBranch() === possibleBranch ||
        currentCapturedTile.getLeftBranch() === possibleBranch) {
        return false;
      }
    }

    if (this.board.branches[possibleBranch].getOwner() === Owner.NONE) {
      const branchOwner = currentPlayer === this.player1 ? Owner.PLAYERONE : Owner.PLAYERTWO;

      if (this.board.branches[this.board.branches[possibleBranch].getBranch("branch1")]?.getOwner() === branchOwner ||
        this.board.branches[this.board.branches[possibleBranch].getBranch("branch2")]?.getOwner() === branchOwner ||
        this.board.branches[this.board.branches[possibleBranch].getBranch("branch3")]?.getOwner() === branchOwner ||
        this.board.branches[this.board.branches[possibleBranch].getBranch("branch4")]?.getOwner() === branchOwner ||
        this.board.branches[this.board.branches[possibleBranch].getBranch("branch5")]?.getOwner() === branchOwner ||
        this.board.branches[this.board.branches[possibleBranch].getBranch("branch6")]?.getOwner() === branchOwner) {

        if (currentPlayer == this.player1) {
          this.board.branches[possibleBranch].setOwner(Owner.PLAYERONE);
          this.player1.ownedBranches.push(possibleBranch);
          this.player1.redResources--;
          this.player1.blueResources--;
        } else {
          this.board.branches[possibleBranch].setOwner(Owner.PLAYERTWO);
          this.player2.ownedBranches.push(possibleBranch);
          this.player2.redResources--;
          this.player2.blueResources--;
        }

        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  tileExhaustion(tileNum: number, setAsExhausted: boolean): void {
    // check for whichever nodes are already on the tile and decrement/increment their *color*PerTurn
    const currentTileColor = this.board.tiles[tileNum].color;

    if (setAsExhausted) {
      if (this.board.nodes[this.board.tiles[tileNum]?.getTopRightNode()]?.getOwner() === Owner.PLAYERONE) {
        this.decrementResource(this.player1, currentTileColor);
      } else if (this.board.nodes[this.board.tiles[tileNum]?.getTopRightNode()]?.getOwner() === Owner.PLAYERTWO) {
        this.decrementResource(this.player2, currentTileColor);
      }

      if (this.board.nodes[this.board.tiles[tileNum]?.getBottomRightNode()]?.getOwner() === Owner.PLAYERONE) {
        this.decrementResource(this.player1, currentTileColor);
      } else if (this.board.nodes[this.board.tiles[tileNum]?.getBottomRightNode()]?.getOwner() === Owner.PLAYERTWO) {
        this.decrementResource(this.player2, currentTileColor);
      }

      if (this.board.nodes[this.board.tiles[tileNum]?.getBottomLeftNode()]?.getOwner() === Owner.PLAYERONE) {
        this.decrementResource(this.player1, currentTileColor);
      } else if (this.board.nodes[this.board.tiles[tileNum]?.getBottomLeftNode()]?.getOwner() === Owner.PLAYERTWO) {
        this.decrementResource(this.player2, currentTileColor);
      }

      if (this.board.nodes[this.board.tiles[tileNum]?.getTopLeftNode()]?.getOwner() === Owner.PLAYERONE) {
        this.decrementResource(this.player1, currentTileColor);
      } else if (this.board.nodes[this.board.tiles[tileNum]?.getTopLeftNode()]?.getOwner() === Owner.PLAYERTWO) {
        this.decrementResource(this.player2, currentTileColor);
      }
    }

    else {
      if (this.board.nodes[this.board.tiles[tileNum]?.getTopRightNode()]?.getOwner() === Owner.PLAYERONE) {
        this.incrementResource(this.player1, currentTileColor);
      } else if (this.board.nodes[this.board.tiles[tileNum]?.getTopRightNode()]?.getOwner() === Owner.PLAYERTWO) {
        this.incrementResource(this.player2, currentTileColor);
      }

      if (this.board.nodes[this.board.tiles[tileNum]?.getBottomRightNode()]?.getOwner() === Owner.PLAYERONE) {
        this.incrementResource(this.player1, currentTileColor);
      } else if (this.board.nodes[this.board.tiles[tileNum]?.getBottomRightNode()]?.getOwner() === Owner.PLAYERTWO) {
        this.incrementResource(this.player2, currentTileColor);
      }

      if (this.board.nodes[this.board.tiles[tileNum]?.getBottomLeftNode()]?.getOwner() === Owner.PLAYERONE) {
        this.incrementResource(this.player1, currentTileColor);
      } else if (this.board.nodes[this.board.tiles[tileNum]?.getBottomLeftNode()]?.getOwner() === Owner.PLAYERTWO) {
        this.incrementResource(this.player2, currentTileColor);
      }

      if (this.board.nodes[this.board.tiles[tileNum]?.getTopLeftNode()]?.getOwner() === Owner.PLAYERONE) {
        this.incrementResource(this.player1, currentTileColor);
      } else if (this.board.nodes[this.board.tiles[tileNum]?.getTopLeftNode()]?.getOwner() === Owner.PLAYERTWO) {
        this.incrementResource(this.player2, currentTileColor);
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
        if (nodeOwner.yellowPerTurn > 0)
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

    if (this.board.branches[currentBranch].getBranch('branch1') !== -1) {
      branch1Owner = this.board.branches[this.board.branches[currentBranch].getBranch('branch1')]?.getOwner();
    }

    if (this.board.branches[currentBranch].getBranch('branch2') !== -1) {
      branch2Owner = this.board.branches[this.board.branches[currentBranch].getBranch('branch2')]?.getOwner();
    }

    if (this.board.branches[currentBranch].getBranch('branch3') !== -1) {
      branch3Owner = this.board.branches[this.board.branches[currentBranch].getBranch('branch3')]?.getOwner();
    }

    if (this.board.branches[currentBranch].getBranch('branch4') !== -1) {
      branch4Owner = this.board.branches[this.board.branches[currentBranch].getBranch('branch4')]?.getOwner();
    }

    if (this.board.branches[currentBranch].getBranch('branch5') !== -1) {
      branch5Owner = this.board.branches[this.board.branches[currentBranch].getBranch('branch5')]?.getOwner();
    }

    if (this.board.branches[currentBranch].getBranch('branch6') !== -1) {
      branch6Owner = this.board.branches[this.board.branches[currentBranch].getBranch('branch6')]?.getOwner();
    }

    if (branchOwner === this.player1) {
      if (branch1Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, this.board.branches[currentBranch].getBranch("branch1"));
      }
      if (branch2Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, this.board.branches[currentBranch].getBranch("branch2"));
      }
      if (branch3Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, this.board.branches[currentBranch].getBranch("branch3"));
      }
      if (branch4Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, this.board.branches[currentBranch].getBranch("branch4"));
      }
      if (branch5Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, this.board.branches[currentBranch].getBranch("branch5"));
      }
      if (branch6Owner === Owner.PLAYERONE) {
        this.checkForLongest(branchOwner, this.board.branches[currentBranch].getBranch("branch6"));
      }
    } else {
      if (branch1Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, this.board.branches[currentBranch].getBranch("branch1"));
      }
      if (branch2Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, this.board.branches[currentBranch].getBranch("branch2"));
      }
      if (branch3Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, this.board.branches[currentBranch].getBranch("branch3"));
      }
      if (branch4Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, this.board.branches[currentBranch].getBranch("branch4"));
      }
      if (branch5Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, this.board.branches[currentBranch].getBranch("branch5"));
      }
      if (branch6Owner === Owner.PLAYERTWO) {
        this.checkForLongest(branchOwner, this.board.branches[currentBranch].getBranch("branch6"));
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

    const otherPlayer = capturer === this.player1 ? Owner.PLAYERTWO : Owner.PLAYERONE;
    const currentTile = this.board.tiles[checkTile];
    const tileTopBranch = this.board.branches[currentTile.getTopBranch()];
    const tileRightBranch = this.board.branches[currentTile.getRightBranch()];
    const tileBottomBranch = this.board.branches[currentTile.getBottomBranch()];
    const tileLeftBranch = this.board.branches[currentTile.getLeftBranch()];

    // checks first instant fail condition: opponent has claimed any branches surrounding tile being checked
    if (tileTopBranch?.getOwner() === otherPlayer ||
      tileRightBranch?.getOwner() === otherPlayer ||
      tileBottomBranch?.getOwner() === otherPlayer ||
      tileLeftBranch?.getOwner() === otherPlayer) {
      captured = false;
      // checks second instant fail condition: no other tile present next to one of current tile's empty-branch sides
    } else if ((tileTopBranch?.getOwner() === Owner.NONE && currentTile.getTopTile() === -1) ||
      (tileRightBranch?.getOwner() === Owner.NONE && currentTile.getRightTile() === -1) ||
      (tileBottomBranch?.getOwner() === Owner.NONE && currentTile.getBottomTile() === -1) ||
      (tileLeftBranch?.getOwner() === Owner.NONE && currentTile.getLeftTile() === -1)) {
      captured = false;
    } else {
      // begins recursive calls checking for multi-tile capture
      this.tilesBeingChecked.push(checkTile);

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