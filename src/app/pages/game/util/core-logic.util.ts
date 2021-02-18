// Defines helper methods for core game logic

import { State } from '../classes/ai/ai.class.State';
import { GameBoard } from '../classes/gamecore/game.class.GameBoard';
import { Player } from '../classes/gamecore/game.class.Player';
import { Owner, TileColor } from '../enums/game.enums';


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

      let redAvailable:number;
      let blueAvailable:number;
      let greenAvailable:number;
      let yellowAvailable:number;
      let playerOwner:Owner;

      if(state.currentPlayer === 1){
        redAvailable = state.player1.redResources;
        blueAvailable = state.player1.blueResources;
        greenAvailable = state.player1.greenResources;
        yellowAvailable = state.player1.yellowResources;
        playerOwner = Owner.PLAYERONE;
      }
      else{
        redAvailable = state.player2.redResources;
        blueAvailable = state.player2.blueResources;
        greenAvailable = state.player2.greenResources;
        yellowAvailable = state.player2.yellowResources;
        playerOwner = Owner.PLAYERTWO;
      }

      //general moves
      //Step 1: trade
      const redStringArray = [];
      const blueStringArray = [];
      const greenStringArray = [];
      const yellowStringArray = [];

      for(let red = 0; red < redAvailable; red++){
        redStringArray.push('R');
      }

      for(let blue = 0; blue < blueAvailable; blue++){
        blueStringArray.push('B');
      }

      for(let green = 0; green < greenAvailable; green++){
        greenStringArray.push('G');
      }

      for(let yellow = 0; yellow < yellowAvailable; yellow++){
        yellowStringArray.push('Y');
      }


      //determine possible trades for red
      const tradeForRed = blueStringArray.slice();
      tradeForRed.concat(greenStringArray,yellowStringArray);
      const tradeForRedCombinations = CoreLogic.removeDuplicates(CoreLogic.kStringCombinations(tradeForRed,3));

      //determine possible trades for blue
      const tradeForBlue = redStringArray.slice();
      tradeForBlue.concat(greenStringArray,yellowStringArray);
      const tradeForBlueCombinations = CoreLogic.removeDuplicates(CoreLogic.kStringCombinations(tradeForBlue,3));

      //determine possible trades for green
      const tradeForGreen = blueStringArray.slice();
      tradeForGreen.concat(redStringArray,yellowStringArray);
      const tradeForGreenCombinations = CoreLogic.removeDuplicates(CoreLogic.kStringCombinations(tradeForGreen,3));

      //determine possible trades for yellow
      const tradeForYellow = blueStringArray.slice();
      tradeForYellow.concat(greenStringArray,redStringArray);
      const tradeForYellowCombinations = CoreLogic.removeDuplicates(CoreLogic.kStringCombinations(tradeForYellow,3));

      //apply trades and pick piece locations
      let redTemp = redAvailable;
      let blueTemp = blueAvailable;
      let greenTemp = greenAvailable;
      let yellowTemp = yellowAvailable;

      for(const trade of tradeForRedCombinations){

        trade.forEach((color)=>{
          if(color === 'B'){
            blueTemp--;
          }
          else if(color === 'G'){
            greenTemp--;
          }
          else if(color === 'Y'){
            yellowTemp--;
          }
        });

        redTemp++;
        let possibleBranchIndices:number[] = [];
        let possibleNodeIndices:number[] = [];

        const numPossibleBranches = Math.floor((redTemp+blueTemp) / 2);
        const numPossibleNodes = Math.floor((greenTemp+yellowTemp)/4);

        const branchBoard = JSON.parse(JSON.stringify(state.gameBoard));
        for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
          possibleBranchIndices=CoreLogic.getValidBranchIndices(playerOwner,branchBoard);
        }

        const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

        const nodeBoard = JSON.parse(JSON.stringify(state.gameBoard));
        for(const branchCombo of possibleBranchCombinations){
          for(const branchIndex of branchCombo){
            nodeBoard.branches[branchIndex].setOwner(playerOwner);
          }
          for(let numNodes = 0; numNodes < numPossibleNodes; numNodes++){
            possibleNodeIndices=CoreLogic.getValidNodeIndices(playerOwner,nodeBoard);
          }

          const possibleNodeCombinations = CoreLogic.kNumberCombinations(possibleNodeIndices, numPossibleNodes);
          for(const nodeCombo of possibleNodeCombinations){
            result.push(CoreLogic.moveToString({tradedIn:trade,received:'R',nodesPlaced:nodeCombo,branchesPlaced:branchCombo}));
          }
          
          for(const branchIndex of branchCombo){
            nodeBoard.branches[branchIndex].setOwner(Owner.NONE);
          }
        }
        redTemp = redAvailable;
        blueTemp = blueAvailable;
        greenTemp = greenAvailable;
        yellowTemp = yellowAvailable;
      }

      for(const trade of tradeForBlueCombinations){

        trade.forEach((color)=>{
          if(color === 'R'){
            redTemp--;
          }
          else if(color === 'G'){
            greenTemp--;
          }
          else if(color === 'Y'){
            yellowTemp--;
          }
        });

        blueTemp++;
        let possibleBranchIndices:number[] = [];
        let possibleNodeIndices:number[] = [];

        const numPossibleBranches = Math.floor((redTemp+blueTemp) / 2);
        const numPossibleNodes = Math.floor((greenTemp+yellowTemp)/4);

        const branchBoard = JSON.parse(JSON.stringify(state.gameBoard));
        for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
          possibleBranchIndices=CoreLogic.getValidBranchIndices(playerOwner,branchBoard);
        }

        const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

        const nodeBoard = JSON.parse(JSON.stringify(state.gameBoard));
        for(const branchCombo of possibleBranchCombinations){
          for(const branchIndex of branchCombo){
            nodeBoard.branches[branchIndex].setOwner(playerOwner);
          }
          for(let numNodes = 0; numNodes < numPossibleNodes; numNodes++){
            possibleNodeIndices=CoreLogic.getValidNodeIndices(playerOwner,nodeBoard);
          }

          const possibleNodeCombinations = CoreLogic.kNumberCombinations(possibleNodeIndices, numPossibleNodes);
          for(const nodeCombo of possibleNodeCombinations){
            result.push(CoreLogic.moveToString({tradedIn:trade,received:'R',nodesPlaced:nodeCombo,branchesPlaced:branchCombo}));
          }
          
          for(const branchIndex of branchCombo){
            nodeBoard.branches[branchIndex].setOwner(Owner.NONE);
          }
        }

        redTemp = redAvailable;
        blueTemp = blueAvailable;
        greenTemp = greenAvailable;
        yellowTemp = yellowAvailable;
      }

      for(const trade of tradeForGreenCombinations){

        trade.forEach((color)=>{
          if(color === 'B'){
            blueTemp--;
          }
          else if(color === 'R'){
            redTemp--;
          }
          else if(color === 'Y'){
            yellowTemp--;
          }
        });

        greenTemp++;
        let possibleBranchIndices:number[] = [];
        let possibleNodeIndices:number[] = [];

        const numPossibleBranches = Math.floor((redTemp+blueTemp) / 2);
        const numPossibleNodes = Math.floor((greenTemp+yellowTemp)/4);

        const branchBoard = JSON.parse(JSON.stringify(state.gameBoard));
        for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
          possibleBranchIndices=CoreLogic.getValidBranchIndices(playerOwner,branchBoard);
        }

        const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

        const nodeBoard = JSON.parse(JSON.stringify(state.gameBoard));
        for(const branchCombo of possibleBranchCombinations){
          for(const branchIndex of branchCombo){
            nodeBoard.branches[branchIndex].setOwner(playerOwner);
          }
          for(let numNodes = 0; numNodes < numPossibleNodes; numNodes++){
            possibleNodeIndices=CoreLogic.getValidNodeIndices(playerOwner,nodeBoard);
          }

          const possibleNodeCombinations = CoreLogic.kNumberCombinations(possibleNodeIndices, numPossibleNodes);
          for(const nodeCombo of possibleNodeCombinations){
            result.push(CoreLogic.moveToString({tradedIn:trade,received:'R',nodesPlaced:nodeCombo,branchesPlaced:branchCombo}));
          }
          
          for(const branchIndex of branchCombo){
            nodeBoard.branches[branchIndex].setOwner(Owner.NONE);
          }
        }

        redTemp = redAvailable;
        blueTemp = blueAvailable;
        greenTemp = greenAvailable;
        yellowTemp = yellowAvailable;
      }

      for(const trade of tradeForYellowCombinations){

        trade.forEach((color)=>{
          if(color === 'B'){
            blueTemp--;
          }
          else if(color === 'G'){
            greenTemp--;
          }
          else if(color === 'R'){
            redTemp--;
          }
        });

        yellowTemp++;
        let possibleBranchIndices:number[] = [];
        let possibleNodeIndices:number[] = [];

        const numPossibleBranches = Math.floor((redTemp+blueTemp) / 2);
        const numPossibleNodes = Math.floor((greenTemp+yellowTemp)/4);

        const branchBoard = JSON.parse(JSON.stringify(state.gameBoard));
        for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
          possibleBranchIndices=CoreLogic.getValidBranchIndices(playerOwner,branchBoard);
        }

        const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

        const nodeBoard = JSON.parse(JSON.stringify(state.gameBoard));
        for(const branchCombo of possibleBranchCombinations){
          for(const branchIndex of branchCombo){
            nodeBoard.branches[branchIndex].setOwner(playerOwner);
          }
          for(let numNodes = 0; numNodes < numPossibleNodes; numNodes++){
            possibleNodeIndices=CoreLogic.getValidNodeIndices(playerOwner,nodeBoard);
          }

          const possibleNodeCombinations = CoreLogic.kNumberCombinations(possibleNodeIndices, numPossibleNodes);
          for(const nodeCombo of possibleNodeCombinations){
            result.push(CoreLogic.moveToString({tradedIn:trade,received:'R',nodesPlaced:nodeCombo,branchesPlaced:branchCombo}));
          }
          
          for(const branchIndex of branchCombo){
            nodeBoard.branches[branchIndex].setOwner(Owner.NONE);
          }
        }

        redTemp = redAvailable;
        blueTemp = blueAvailable;
        greenTemp = greenAvailable;
        yellowTemp = yellowAvailable;
      }

      
      const noTrade:string[] = [];
      let possibleBranchIndices:number[] = [];
      let possibleNodeIndices:number[] = [];

      const numPossibleBranches = Math.floor((redTemp+blueTemp) / 2);
      const numPossibleNodes = Math.floor((greenTemp+yellowTemp)/4);

      const branchBoard = JSON.parse(JSON.stringify(state.gameBoard));
      for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
        possibleBranchIndices=CoreLogic.getValidBranchIndices(playerOwner,branchBoard);
      }

      const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

      const nodeBoard = JSON.parse(JSON.stringify(state.gameBoard));
      for(const branchCombo of possibleBranchCombinations){
        for(const branchIndex of branchCombo){
          nodeBoard.branches[branchIndex].setOwner(playerOwner);
        }
        for(let numNodes = 0; numNodes < numPossibleNodes; numNodes++){
          possibleNodeIndices=CoreLogic.getValidNodeIndices(playerOwner,nodeBoard);
        }

        const possibleNodeCombinations = CoreLogic.kNumberCombinations(possibleNodeIndices, numPossibleNodes);
        for(const nodeCombo of possibleNodeCombinations){
          result.push(CoreLogic.moveToString({tradedIn:noTrade,received:'',nodesPlaced:nodeCombo,branchesPlaced:branchCombo}));
        }
        
        for(const branchIndex of branchCombo){
          nodeBoard.branches[branchIndex].setOwner(Owner.NONE);
        }
      }
    }
    
    return result;
  }

  static getValidNodeIndices(player:Owner, gameBoard:GameBoard):number[]{
    const result:number[] = [];

    for(const node of gameBoard.nodes){

      if (node.getOwner() === Owner.NONE){
        if (gameBoard.nodes[gameBoard.nodes.indexOf(node)].getTopBranch() !== -1 &&
          gameBoard.branches[gameBoard.nodes[gameBoard.nodes.indexOf(node)].getTopBranch()].getOwner() === player) {
          result.push(gameBoard.nodes.indexOf(node));
        }
        else if (gameBoard.nodes[gameBoard.nodes.indexOf(node)].getRightBranch() !== -1 &&
        gameBoard.branches[gameBoard.nodes[gameBoard.nodes.indexOf(node)].getRightBranch()].getOwner() === player) {
          result.push(gameBoard.nodes.indexOf(node));
        } 
        else if (gameBoard.nodes[gameBoard.nodes.indexOf(node)].getBottomBranch() !== -1 &&
        gameBoard.branches[gameBoard.nodes[gameBoard.nodes.indexOf(node)].getBottomBranch()].getOwner() === player) {
          result.push(gameBoard.nodes.indexOf(node));
        } 
        else if (gameBoard.nodes[gameBoard.nodes.indexOf(node)].getLeftBranch() !== -1 &&
        gameBoard.branches[gameBoard.nodes[gameBoard.nodes.indexOf(node)].getLeftBranch()].getOwner() === player) {
          result.push(gameBoard.nodes.indexOf(node));
        } 
      }
    }

    return result;
  }

  static getValidBranchIndices(player:Owner, gameBoard:GameBoard):number[]{
    const result:number[] = [];

    for(const branch of gameBoard.branches){

      if (branch.getOwner() === Owner.NONE){
        if(gameBoard.branches[gameBoard.branches.indexOf(branch)].getBranch('branch1') !== -1 &&
          gameBoard.branches[gameBoard.branches[gameBoard.branches.indexOf(branch)].getBranch('branch1')].getOwner() === player){
          result.push(gameBoard.branches.indexOf(branch));
          branch.setOwner(player);
        } 
        else if(gameBoard.branches[gameBoard.branches.indexOf(branch)].getBranch('branch2') !== -1 &&
        gameBoard.branches[gameBoard.branches[gameBoard.branches.indexOf(branch)].getBranch('branch2')].getOwner() === player){
          result.push(gameBoard.branches.indexOf(branch));
          branch.setOwner(player);
        } 
        else if(gameBoard.branches[gameBoard.branches.indexOf(branch)].getBranch('branch3') !== -1 &&
        gameBoard.branches[gameBoard.branches[gameBoard.branches.indexOf(branch)].getBranch('branch3')].getOwner() === player){
          result.push(gameBoard.branches.indexOf(branch));
          branch.setOwner(player);
        } 
        else if(gameBoard.branches[gameBoard.branches.indexOf(branch)].getBranch('branch4') !== -1 &&
        gameBoard.branches[gameBoard.branches[gameBoard.branches.indexOf(branch)].getBranch('branch4')].getOwner() === player){
          result.push(gameBoard.branches.indexOf(branch));
          branch.setOwner(player);
        } 
        else if(gameBoard.branches[gameBoard.branches.indexOf(branch)].getBranch('branch5') !== -1 &&
        gameBoard.branches[gameBoard.branches[gameBoard.branches.indexOf(branch)].getBranch('branch5')].getOwner() === player){
          result.push(gameBoard.branches.indexOf(branch));
          branch.setOwner(player);
        } 
        else if(gameBoard.branches[gameBoard.branches.indexOf(branch)].getBranch('branch6') !== -1 &&
        gameBoard.branches[gameBoard.branches[gameBoard.branches.indexOf(branch)].getBranch('branch6')].getOwner() === player){
          result.push(gameBoard.branches.indexOf(branch));
          branch.setOwner(player);
        } 
      }

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
      CoreLogic.applyMove(move,newState,newState.player1, Owner.PLAYERONE);
    }
    else{
      CoreLogic.applyMove(move, newState,newState.player2, Owner.PLAYERTWO);
    }

    
    //currentPlayer is 1 for player 1 and -1 for player 2
    if(newState.moveHistory.length !== 2){
      newState.currentPlayer = -newState.currentPlayer;
    }
    if(newState.moveHistory.length === 4){
      newState.inInitialMoves = false;
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
    


   
    return newState;
  }

  static applyMove(move:string, state:State, affectedPlayer:Player, owner:Owner):void{

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

    for(const branch of moveObj.branchesPlaced){
      state.gameBoard.branches[branch].setOwner(owner);
      affectedPlayer.ownedBranches.push(branch);
      affectedPlayer.redResources --;
      affectedPlayer.blueResources --;
    }
    console.log(affectedPlayer.ownedBranches);
    for(const node of moveObj.nodesPlaced){
      state.gameBoard.nodes[node].setOwner(owner);
      affectedPlayer.greenResources -= 2;
      affectedPlayer.yellowResources -=2;
      affectedPlayer.currentScore++;

      if (state.gameBoard.nodes[node].getTopRightTile() !== -1) {
        state.gameBoard.tiles[state.gameBoard.nodes[node].getTopRightTile()].nodeCount++;
        
        if(!state.gameBoard.tiles[state.gameBoard.nodes[node].getTopRightTile()].isExhausted){
          CoreLogic.incrementResource(affectedPlayer,state.gameBoard.tiles[state.gameBoard.nodes[node].getTopRightTile()].color);
        }

        if (state.gameBoard.tiles[state.gameBoard.nodes[node].getTopRightTile()].nodeCount >
            state.gameBoard.tiles[state.gameBoard.nodes[node].getTopRightTile()].maxNodes) {
          state.gameBoard.tiles[state.gameBoard.nodes[node].getTopRightTile()].isExhausted = true;
          CoreLogic.tileExhaustion(state,state.gameBoard.nodes[node].getTopRightTile(), true);
        }
        
      }

      if (state.gameBoard.nodes[node].getBottomRightTile() !== -1) {
        state.gameBoard.tiles[state.gameBoard.nodes[node].getBottomRightTile()].nodeCount++;
        
        if(!state.gameBoard.tiles[state.gameBoard.nodes[node].getBottomRightTile()].isExhausted){
          CoreLogic.incrementResource(affectedPlayer,state.gameBoard.tiles[state.gameBoard.nodes[node].getBottomRightTile()].color);
        }


        if (state.gameBoard.tiles[state.gameBoard.nodes[node].getBottomRightTile()].nodeCount >
            state.gameBoard.tiles[state.gameBoard.nodes[node].getBottomRightTile()].maxNodes) {
          state.gameBoard.tiles[state.gameBoard.nodes[node].getBottomRightTile()].isExhausted = true;
          CoreLogic.tileExhaustion(state,state.gameBoard.nodes[node].getBottomRightTile(), true);
        }
      }

      if (state.gameBoard.nodes[node].getBottomLeftTile() !== -1) {
        state.gameBoard.tiles[state.gameBoard.nodes[node].getBottomLeftTile()].nodeCount++;

        if(!state.gameBoard.tiles[state.gameBoard.nodes[node].getBottomLeftTile()].isExhausted){
          CoreLogic.incrementResource(affectedPlayer,state.gameBoard.tiles[state.gameBoard.nodes[node].getBottomLeftTile()].color);
        }


        if (state.gameBoard.tiles[state.gameBoard.nodes[node].getBottomLeftTile()].nodeCount >
            state.gameBoard.tiles[state.gameBoard.nodes[node].getBottomLeftTile()].maxNodes) {
          state.gameBoard.tiles[state.gameBoard.nodes[node].getBottomLeftTile()].isExhausted = true;
          CoreLogic.tileExhaustion(state,state.gameBoard.nodes[node].getBottomLeftTile(), true);
        }
      }
      
      if (state.gameBoard.nodes[node].getTopLeftTile() !== -1) {
        state.gameBoard.tiles[state.gameBoard.nodes[node].getTopLeftTile()].nodeCount++;

        if(!state.gameBoard.tiles[state.gameBoard.nodes[node].getTopLeftTile()].isExhausted){
          CoreLogic.incrementResource(affectedPlayer,state.gameBoard.tiles[state.gameBoard.nodes[node].getTopLeftTile()].color);
        }


        if (state.gameBoard.tiles[state.gameBoard.nodes[node].getTopLeftTile()].nodeCount >
            state.gameBoard.tiles[state.gameBoard.nodes[node].getTopLeftTile()].maxNodes) {
          state.gameBoard.tiles[state.gameBoard.nodes[node].getTopLeftTile()].isExhausted = true;
          CoreLogic.tileExhaustion(state,state.gameBoard.nodes[node].getTopLeftTile(), true);
        }
      }
    }

    //longest Network
    for (let i = 0; i < affectedPlayer.ownedBranches.length; i++) {
      affectedPlayer.currentLength = 0;
      CoreLogic.checkForLongest(state,affectedPlayer, state.player1.ownedBranches[i]);
    }

    if(state.currentPlayer === 1){
      if ((state.player1.currentLongest > state.player2.currentLongest) && state.player1.hasLongestNetwork === false) {
        state.player1.hasLongestNetwork = true;
        state.player1.currentScore += 2;
        if (state.player2.hasLongestNetwork === true) {
          state.player2.hasLongestNetwork = false;
          state.player2.currentScore -= 2;
        }
      }
    }else{
      if ((state.player2.currentLongest > state.player1.currentLongest) && state.player2.hasLongestNetwork === false) {
        state.player2.hasLongestNetwork = true;
        state.player2.currentScore += 2;
        if (state.player1.hasLongestNetwork === true) {
          state.player1.hasLongestNetwork = false;
          state.player1.currentScore -= 2;
        }
      }
    }

    
   
    
    //captured tile need to work on this
    let numberTilesCapturedAtEndOfTurn = 0;

    for (let  i = 0; i < state.gameBoard.tiles.length; i++) {
      state.tilesBeingChecked =[];
      if(CoreLogic.checkForCaptures(state,affectedPlayer, i)){
        numberTilesCapturedAtEndOfTurn++;
      } 
    }
    affectedPlayer.currentScore += numberTilesCapturedAtEndOfTurn - affectedPlayer.numTilesCaptured;
    affectedPlayer.numTilesCaptured = numberTilesCapturedAtEndOfTurn;
  }

  static tileExhaustion(state:State,tileNum: number, setAsExhausted: boolean): void {
    // check for whichever nodes are already on the tile and decrement their *color*PerTurn
    const currentTileColor = state.gameBoard.tiles[tileNum].color;
    let functionName;
    if (setAsExhausted){
      functionName = (nodeOwner: Player, currentTileColor: TileColor) => {
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
      };
    }
    else{
      functionName = (nodeOwner: Player, currentTileColor: TileColor) =>{
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
      };
    }
    
    if (state.gameBoard.nodes[state.gameBoard.tiles[tileNum].getTopRightNode()].getOwner() === Owner.PLAYERONE) {
      functionName(state.player1, currentTileColor);
    }
    else if (state.gameBoard.nodes[state.gameBoard.tiles[tileNum].getTopRightNode()].getOwner() === Owner.PLAYERTWO) {
      functionName(state.player2, currentTileColor);
    }

    if (state.gameBoard.nodes[state.gameBoard.tiles[tileNum].getBottomRightNode()].getOwner() === Owner.PLAYERONE) {
      functionName(state.player1, currentTileColor);
    }
    else if (state.gameBoard.nodes[state.gameBoard.tiles[tileNum].getBottomRightNode()].getOwner() === Owner.PLAYERTWO) {
      functionName( state.player2, currentTileColor);
    }

    if (state.gameBoard.nodes[state.gameBoard.tiles[tileNum].getBottomLeftNode()].getOwner() === Owner.PLAYERONE) {
      functionName(state.player1, currentTileColor);
    }
    else if (state.gameBoard.nodes[state.gameBoard.tiles[tileNum].getBottomLeftNode()].getOwner() === Owner.PLAYERTWO) {
      functionName(state.player2, currentTileColor);
    }

    if (state.gameBoard.nodes[state.gameBoard.tiles[tileNum].getTopLeftNode()].getOwner() === Owner.PLAYERONE) {
      functionName(state.player1, currentTileColor);
    }
    else if (state.gameBoard.nodes[state.gameBoard.tiles[tileNum].getTopLeftNode()].getOwner() === Owner.PLAYERTWO) {
      functionName(state.player2, currentTileColor);
    }
  }

  static decrementResource(nodeOwner: Player, currentTileColor: TileColor):void{
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

  static incrementResource(nodeOwner: Player, currentTileColor: TileColor): void {
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

  static checkForLongest(state:State, branchOwner: Player, currentBranch: number): void {

    if (branchOwner.branchScanner.includes(currentBranch) === true) {
      return;
    }

    branchOwner.branchScanner.push(currentBranch);
    branchOwner.currentLength++;
    
    if (branchOwner.currentLength > branchOwner.currentLongest) {
      branchOwner.currentLongest = branchOwner.currentLength;
    }

    let branch1Owner:Owner;
    let branch2Owner:Owner;
    let branch3Owner:Owner;
    let branch4Owner:Owner;
    let branch5Owner:Owner;
    let branch6Owner:Owner;

    if(state.gameBoard.branches[currentBranch].getBranch('branch1') !== -1){
      branch1Owner = state.gameBoard.branches[state.gameBoard.branches[currentBranch].getBranch('branch1')].getOwner();
    }
    else{
      branch1Owner = Owner.NONE;
    }
    if(state.gameBoard.branches[currentBranch].getBranch('branch2') !== -1){
      branch2Owner = state.gameBoard.branches[state.gameBoard.branches[currentBranch].getBranch('branch2')].getOwner();
    }
    else{
      branch2Owner = Owner.NONE;
    }
    if(state.gameBoard.branches[currentBranch].getBranch('branch3') !== -1){
      branch3Owner = state.gameBoard.branches[state.gameBoard.branches[currentBranch].getBranch('branch3')].getOwner();
    }
    else{
      branch3Owner = Owner.NONE;
    }
    if(state.gameBoard.branches[currentBranch].getBranch('branch4') !== -1){
      branch4Owner = state.gameBoard.branches[state.gameBoard.branches[currentBranch].getBranch('branch4')].getOwner();
    }
    else{
      branch4Owner = Owner.NONE;
    }
    if(state.gameBoard.branches[currentBranch].getBranch('branch5') !== -1){
      branch5Owner = state.gameBoard.branches[state.gameBoard.branches[currentBranch].getBranch('branch5')].getOwner();
    }
    else{
      branch5Owner = Owner.NONE;
    }
    if(state.gameBoard.branches[currentBranch].getBranch('branch6') !== -1){
      branch6Owner = state.gameBoard.branches[state.gameBoard.branches[currentBranch].getBranch('branch6')].getOwner();
    }
    else{
      branch6Owner = Owner.NONE;
    }
   

    if (branchOwner === state.player1) {

      if (branch1Owner === Owner.PLAYERONE) {
        CoreLogic.checkForLongest(state, branchOwner, state.gameBoard.branches[currentBranch].getBranch('branch1'));
      }
      if (branch2Owner === Owner.PLAYERONE) {
        CoreLogic.checkForLongest(state, branchOwner, state.gameBoard.branches[currentBranch].getBranch('branch2'));
      }
      if (branch3Owner === Owner.PLAYERONE) {
        CoreLogic.checkForLongest(state, branchOwner, state.gameBoard.branches[currentBranch].getBranch('branch3'));
      }
      if (branch4Owner === Owner.PLAYERONE) {
        CoreLogic.checkForLongest(state, branchOwner, state.gameBoard.branches[currentBranch].getBranch('branch4'));
      }
      if (branch5Owner === Owner.PLAYERONE) {
        CoreLogic.checkForLongest(state, branchOwner, state.gameBoard.branches[currentBranch].getBranch('branch5'));
      }
      if (branch6Owner === Owner.PLAYERONE) {
        CoreLogic.checkForLongest(state, branchOwner, state.gameBoard.branches[currentBranch].getBranch('branch6'));
      }
    }

    else {
      if (branch1Owner === Owner.PLAYERTWO) {
        CoreLogic.checkForLongest(state, branchOwner, Number(state.gameBoard.branches[state.gameBoard.branches[currentBranch].getBranch('branch1')]));
      }
      if (branch2Owner === Owner.PLAYERTWO) {
        CoreLogic.checkForLongest(state, branchOwner, Number(state.gameBoard.branches[state.gameBoard.branches[currentBranch].getBranch('branch2')]));
      }
      if (branch3Owner === Owner.PLAYERTWO) {
        CoreLogic.checkForLongest(state, branchOwner, Number(state.gameBoard.branches[state.gameBoard.branches[currentBranch].getBranch('branch3')]));
      }
      if (branch4Owner === Owner.PLAYERTWO) {
        CoreLogic.checkForLongest(state, branchOwner, Number(state.gameBoard.branches[state.gameBoard.branches[currentBranch].getBranch('branch4')]));
      }
      if (branch5Owner === Owner.PLAYERTWO) {
        CoreLogic.checkForLongest(state, branchOwner, Number(state.gameBoard.branches[state.gameBoard.branches[currentBranch].getBranch('branch5')]));
      }
      if (branch6Owner === Owner.PLAYERTWO) {
        CoreLogic.checkForLongest(state, branchOwner, Number(state.gameBoard.branches[state.gameBoard.branches[currentBranch].getBranch('branch6')]));
      }
    }

    //branchOwner.branchScanner.pop();
  }

  static checkForCaptures(state:State, capturer: Player, checkTile: number): boolean {

    let captured = true;

    // prevents infinite recursion
    if (state.tilesBeingChecked.includes(checkTile)) {
      return captured;
    }

    let currentPlayer;
    let otherPlayer;

    const currentTile = state.gameBoard.tiles[checkTile];
    const tileTopBranch = state.gameBoard.branches[currentTile.getTopBranch()];
    const tileRightBranch = state.gameBoard.branches[currentTile.getRightBranch()];
    const tileBottomBranch = state.gameBoard.branches[currentTile.getBottomBranch()];
    const tileLeftBranch = state.gameBoard.branches[currentTile.getLeftBranch()];

    if (capturer === state.player1) {
      currentPlayer = Owner.PLAYERONE;
      otherPlayer = Owner.PLAYERTWO;
    }
    else {
      currentPlayer = Owner.PLAYERTWO;
      otherPlayer = Owner.PLAYERONE;
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
      state.tilesBeingChecked.push(checkTile);

      if (tileTopBranch.getOwner() === Owner.NONE) {
        if (CoreLogic.checkForCaptures(state,capturer, currentTile.getTopTile()) === false) {
          captured = false;
        }
      }
      if (tileRightBranch.getOwner() === Owner.NONE) {
        if (CoreLogic.checkForCaptures(state,capturer, currentTile.getRightTile()) === false) {
          captured = false;
        }
      }
      if (tileBottomBranch.getOwner() === Owner.NONE) {
        if (CoreLogic.checkForCaptures(state,capturer, currentTile.getBottomTile()) === false) {
          captured = false;
        }
      }
      if (tileLeftBranch.getOwner() === Owner.NONE) {
        if (CoreLogic.checkForCaptures(state,capturer, currentTile.getLeftTile()) === false) {
          captured = false;
        }
      }
   
    }

    return captured;
  }

  static moveToString(move:Move):string{
    let result = '';
    

    for(const resource of move.tradedIn){
      result += resource + ',';
    }

    if(move.received === ''){
      result += ';';
    }
    else{
      result += move.received + ';';
    }

    for(const node of move.nodesPlaced){
      result += node.toString();

      if(node !== move.nodesPlaced[move.nodesPlaced.length-1]){
        result += ',';
      }
      else{
        result += ';';
      }
    }
    if(move.nodesPlaced.length === 0){
      result += ';';
    }

    for(const branch of move.branchesPlaced){
      if(move.branchesPlaced.indexOf(branch) !== 0){
        result += ',';
      }
      result += branch.toString();
    }

    return result; //result should be a string formatted like 'R,R,R,Y;8;3,18'
  }

  static stringToMove(moveString:string):Move{
    const result:Move = {tradedIn:[],received:'',nodesPlaced:[],branchesPlaced:[]};

    const moveSections = moveString.split(';');

    const trade = moveSections[0].split(',');
    if(trade.length > 0 && trade[0] !== ''){
      result.tradedIn.push(trade[0]);
      result.tradedIn.push(trade[1]);
      result.tradedIn.push(trade[2]);
      result.received = trade[3];
    }
    else{
      result.tradedIn = [];
      result.received = '';
    }

   
    if(moveSections[1] !== ''){
      const nodes = moveSections[1].split(',');
        
      for(const node of nodes){
        result.nodesPlaced.push(parseInt(node));
      }

    }
    
  
    if(moveSections[2] !== ''){
      const branches = moveSections[2].split(',');

      for(const branch of branches){
        result.branchesPlaced.push(parseInt(branch));
      }

    }


    return result;
  }

  //https://gist.github.com/axelpale/3118596
  static kStringCombinations(set:string[], k:number):string[][] {
    let i, j, combs, head, tailcombs;
    
    // There is no way to take e.g. sets of 5 elements from
    // a set of 4.
    if (k > set.length || k <= 0) {
      return [];
    }
    
    // K-sized set has only one K-sized subset.
    if (k == set.length) {
      return [set];
    }
    
    // There is N 1-sized subsets in a N-sized set.
    if (k == 1) {
      combs = [];
      for (i = 0; i < set.length; i++) {
        combs.push([set[i]]);
      }
      return combs;
    }
    
    
    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
      // head is a list that includes only our current element.
      head = set.slice(i, i + 1);
      // We take smaller combinations from the subsequent elements
      tailcombs = CoreLogic.kStringCombinations(set.slice(i + 1), k - 1);
      // For each (k-1)-combination we join it with the current
      // and store it to the set of k-combinations.
      for (j = 0; j < tailcombs.length; j++) {
        combs.push(head.concat(tailcombs[j]));
      }
    }
    return combs;
  }

  static kNumberCombinations(set:number[], k:number):number[][] {
    let i, j, combs, head, tailcombs;
    
    // There is no way to take e.g. sets of 5 elements from
    // a set of 4.
    if (k > set.length || k <= 0) {
      return [];
    }
    
    // K-sized set has only one K-sized subset.
    if (k == set.length) {
      return [set];
    }
    
    // There is N 1-sized subsets in a N-sized set.
    if (k == 1) {
      combs = [];
      for (i = 0; i < set.length; i++) {
        combs.push([set[i]]);
      }
      return combs;
    }
    
    
    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
      // head is a list that includes only our current element.
      head = set.slice(i, i + 1);
      // We take smaller combinations from the subsequent elements
      tailcombs = CoreLogic.kNumberCombinations(set.slice(i + 1), k - 1);
      // For each (k-1)-combination we join it with the current
      // and store it to the set of k-combinations.
      for (j = 0; j < tailcombs.length; j++) {
        combs.push(head.concat(tailcombs[j]));
      }
    }
    return combs;
  }

  static removeDuplicates(bigArray:string[][]):string[][]{
    const stringArray = [];
    for(const item of bigArray){
      stringArray.push(JSON.stringify(item));
    }

    const uniqueStringArray = new Set(stringArray);
    const uniqueArray:string[][] = [];
    const someFunction = function(val1:string) { 
      uniqueArray.push(JSON.parse(val1)); 
    };

    uniqueStringArray.forEach(someFunction);
    
    return uniqueArray;
  }
}