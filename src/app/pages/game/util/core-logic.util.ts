// Defines helper methods for core game logic


import { State } from '../classes/ai/ai.class.State';
import { GameBoard } from '../classes/gamecore/game.class.GameBoard';
import { Player } from '../classes/gamecore/game.class.Player';
import { Tile } from '../classes/gamecore/game.class.Tile';
import { Branch } from '../classes/gamecore/game.class.Branch';
import { Node } from '../classes/gamecore/game.class.Node';
import { Owner, TileColor } from '../enums/game.enums';


interface Move {
  tradedIn:string[],
  received:string,
  nodesPlaced:number[],
  branchesPlaced:number[]
}


export class CoreLogic {

  static getStartingState(player1:Player, player2:Player, gameBoard:GameBoard, currentPlayer:number):State{
    const newBoard = CoreLogic.cloneGameBoard(gameBoard);
    const clonedPlayer1 = CoreLogic.clonePlayer(player1);
    const clonedPlayer2 = CoreLogic.clonePlayer(player2);
    
    return new State([], newBoard, currentPlayer, clonedPlayer1, clonedPlayer2,true);
  }

  static getLegalMoves(state:State): string[] {
    
    const result:string[] = [];
    //console.log(state.inInitialMoves);
    
    if(state.inInitialMoves){
      //initial moves

      const nodePlacements = [];
      
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

      for(let nodeMoveIndex = 0; nodeMoveIndex < nodePlacements.length; nodeMoveIndex++){
        for(let branchMoveIndex = 0; branchMoveIndex < branchPlacements[nodeMoveIndex].length; branchMoveIndex++){
          result.push(CoreLogic.moveToString({tradedIn:[],received:'',nodesPlaced:[nodePlacements[nodeMoveIndex]],branchesPlaced:[branchPlacements[nodeMoveIndex][branchMoveIndex]]}));
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
      for(const green of greenStringArray){
        tradeForRed.push(green);
      }
      for(const yellow of yellowStringArray){
        tradeForRed.push(yellow);
      }
      
      const tradeForRedCombinations = CoreLogic.removeDuplicates(CoreLogic.kStringCombinations(tradeForRed,3));
      

      //determine possible trades for blue
      const tradeForBlue = redStringArray.slice();
      for(const green of greenStringArray){
        tradeForBlue.push(green);
      }
      for(const yellow of yellowStringArray){
        tradeForBlue.push(yellow);
      }
      
      const tradeForBlueCombinations = CoreLogic.removeDuplicates(CoreLogic.kStringCombinations(tradeForBlue,3));

      //determine possible trades for green
      const tradeForGreen = blueStringArray.slice();
      for(const red of redStringArray){
        tradeForGreen.push(red);
      }
      for(const yellow of yellowStringArray){
        tradeForGreen.push(yellow);
      }
      
      const tradeForGreenCombinations = CoreLogic.removeDuplicates(CoreLogic.kStringCombinations(tradeForGreen,3));

      //determine possible trades for yellow
      const tradeForYellow = blueStringArray.slice();
      for(const green of greenStringArray){
        tradeForYellow.push(green);
      }
      for(const red of redStringArray){
        tradeForYellow.push(red);
      }
      
      const tradeForYellowCombinations = CoreLogic.removeDuplicates(CoreLogic.kStringCombinations(tradeForYellow,3));

      //apply trades and pick piece locations
      let redTemp = redAvailable;
      let blueTemp = blueAvailable;
      let greenTemp = greenAvailable;
      let yellowTemp = yellowAvailable;


      for(const trade of tradeForRedCombinations){

        for(const resource of trade){
          switch(resource){
            case 'B':
              blueTemp--;
              break;
            case 'G':
              greenTemp--;
              break;
            case 'Y':
              yellowTemp--;
              break;
          }
        }
        

        redTemp++;
        let possibleBranchIndices:number[] = [];
        let possibleNodeIndices:number[] = [];

        let numPossibleBranches:number;
        const redBlueDiff = redTemp - blueTemp;
  
        if(redBlueDiff === 0){
          numPossibleBranches = redTemp;
        }
        else if(Math.sign(redBlueDiff) === 1){
          numPossibleBranches = redTemp - Math.abs(redBlueDiff);
        }
        else{
          numPossibleBranches = blueTemp - Math.abs(redBlueDiff);
        }
  
        
  
        let numPossibleNodes:number;
        const greenNum = (greenTemp - (greenTemp % 2))/2;
        const yellowNum = (yellowTemp - (yellowTemp % 2))/2;
        const greenYellowDiff = greenNum - yellowNum;
        if(greenYellowDiff === 0){
          numPossibleNodes = greenNum;
        }
        else if(Math.sign(greenYellowDiff) === 1){
          numPossibleNodes = greenNum - Math.abs(greenYellowDiff);
        }
        else{
          numPossibleNodes = yellowNum - Math.abs(greenYellowDiff);
        }

        

        const branchBoard = CoreLogic.cloneGameBoard(state.gameBoard);

        for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
          possibleBranchIndices=CoreLogic.getValidBranchIndices(playerOwner,branchBoard);
        }

        const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

        const nodeBoard = CoreLogic.cloneGameBoard(state.gameBoard);

        for(const branchCombo of possibleBranchCombinations){
          for(const branchIndex of branchCombo){
            nodeBoard.branches[branchIndex].setOwner(playerOwner);
          }
          for(let numNodes = 0; numNodes < numPossibleNodes; numNodes++){
            possibleNodeIndices=CoreLogic.getValidNodeIndices(playerOwner,nodeBoard);
          }

          const possibleNodeCombinations = CoreLogic.kNumberCombinations(possibleNodeIndices, numPossibleNodes);
          if(possibleNodeCombinations.length > 0){
            for(const nodeCombo of possibleNodeCombinations){
              result.push(CoreLogic.moveToString({tradedIn:trade,received:'R',nodesPlaced:nodeCombo,branchesPlaced:branchCombo}));
            }
          }
          else{
            result.push(CoreLogic.moveToString({tradedIn:trade,received:'R',nodesPlaced:[],branchesPlaced:branchCombo}));
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

        for(const resource of trade){
          switch(resource){
            case 'R':
              redTemp--;
              break;
            case 'G':
              greenTemp--;
              break;
            case 'Y':
              yellowTemp--;
              break;
          }
        }

        blueTemp++;
        let possibleBranchIndices:number[] = [];
        let possibleNodeIndices:number[] = [];

        let numPossibleBranches:number;
        const redBlueDiff = redTemp - blueTemp;
  
        if(redBlueDiff === 0){
          numPossibleBranches = redTemp;
        }
        else if(Math.sign(redBlueDiff) === 1){
          numPossibleBranches = redTemp - Math.abs(redBlueDiff);
        }
        else{
          numPossibleBranches = blueTemp - Math.abs(redBlueDiff);
        }
  
        
  
        let numPossibleNodes:number;
        const greenNum = (greenTemp - (greenTemp % 2))/2;
        const yellowNum = (yellowTemp - (yellowTemp % 2))/2;
        const greenYellowDiff = greenNum - yellowNum;
        if(greenYellowDiff === 0){
          numPossibleNodes = greenNum;
        }
        else if(Math.sign(greenYellowDiff) === 1){
          numPossibleNodes = greenNum - Math.abs(greenYellowDiff);
        }
        else{
          numPossibleNodes = yellowNum - Math.abs(greenYellowDiff);
        }

        

        const branchBoard = CoreLogic.cloneGameBoard(state.gameBoard);

        for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
          possibleBranchIndices=CoreLogic.getValidBranchIndices(playerOwner,branchBoard);
        }

        const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

        const nodeBoard = CoreLogic.cloneGameBoard(state.gameBoard);

        for(const branchCombo of possibleBranchCombinations){
          for(const branchIndex of branchCombo){
            nodeBoard.branches[branchIndex].setOwner(playerOwner);
          }
          for(let numNodes = 0; numNodes < numPossibleNodes; numNodes++){
            possibleNodeIndices=CoreLogic.getValidNodeIndices(playerOwner,nodeBoard);
          }

          const possibleNodeCombinations = CoreLogic.kNumberCombinations(possibleNodeIndices, numPossibleNodes);
          if(possibleNodeCombinations.length > 0){
            for(const nodeCombo of possibleNodeCombinations){
              result.push(CoreLogic.moveToString({tradedIn:trade,received:'B',nodesPlaced:nodeCombo,branchesPlaced:branchCombo}));
            }
          }
          else{
            result.push(CoreLogic.moveToString({tradedIn:trade,received:'B',nodesPlaced:[],branchesPlaced:branchCombo}));
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

        for(const resource of trade){
          switch(resource){
            case 'B':
              blueTemp--;
              break;
            case 'R':
              redTemp--;
              break;
            case 'Y':
              yellowTemp--;
              break;
          }
        }

        greenTemp++;
        let possibleBranchIndices:number[] = [];
        let possibleNodeIndices:number[] = [];

        let numPossibleBranches:number;
        const redBlueDiff = redTemp - blueTemp;
  
        if(redBlueDiff === 0){
          numPossibleBranches = redTemp;
        }
        else if(Math.sign(redBlueDiff) === 1){
          numPossibleBranches = redTemp - Math.abs(redBlueDiff);
        }
        else{
          numPossibleBranches = blueTemp - Math.abs(redBlueDiff);
        }
  
        
  
        let numPossibleNodes:number;
        const greenNum = (greenTemp - (greenTemp % 2))/2;
        const yellowNum = (yellowTemp - (yellowTemp % 2))/2;
        const greenYellowDiff = greenNum - yellowNum;
        if(greenYellowDiff === 0){
          numPossibleNodes = greenNum;
        }
        else if(Math.sign(greenYellowDiff) === 1){
          numPossibleNodes = greenNum - Math.abs(greenYellowDiff);
        }
        else{
          numPossibleNodes = yellowNum - Math.abs(greenYellowDiff);
        }

        

        const branchBoard = CoreLogic.cloneGameBoard(state.gameBoard);

        for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
          possibleBranchIndices=CoreLogic.getValidBranchIndices(playerOwner,branchBoard);
        }

        const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

        const nodeBoard = CoreLogic.cloneGameBoard(state.gameBoard);

        for(const branchCombo of possibleBranchCombinations){
          for(const branchIndex of branchCombo){
            nodeBoard.branches[branchIndex].setOwner(playerOwner);
          }
          for(let numNodes = 0; numNodes < numPossibleNodes; numNodes++){
            possibleNodeIndices=CoreLogic.getValidNodeIndices(playerOwner,nodeBoard);
          }

          const possibleNodeCombinations = CoreLogic.kNumberCombinations(possibleNodeIndices, numPossibleNodes);
          if(possibleNodeCombinations.length > 0){
            for(const nodeCombo of possibleNodeCombinations){
              result.push(CoreLogic.moveToString({tradedIn:trade,received:'G',nodesPlaced:nodeCombo,branchesPlaced:branchCombo}));
            }
          }
          else{
            result.push(CoreLogic.moveToString({tradedIn:trade,received:'G',nodesPlaced:[],branchesPlaced:branchCombo}));
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

        for(const resource of trade){
          switch(resource){
            case 'B':
              blueTemp--;
              break;
            case 'G':
              greenTemp--;
              break;
            case 'R':
              redTemp--;
              break;
          }
        }

        yellowTemp++;
        let possibleBranchIndices:number[] = [];
        let possibleNodeIndices:number[] = [];

        let numPossibleBranches:number;
        const redBlueDiff = redTemp - blueTemp;
  
        if(redBlueDiff === 0){
          numPossibleBranches = redTemp;
        }
        else if(Math.sign(redBlueDiff) === 1){
          numPossibleBranches = redTemp - Math.abs(redBlueDiff);
        }
        else{
          numPossibleBranches = blueTemp - Math.abs(redBlueDiff);
        }
  
        
  
        let numPossibleNodes:number;
        const greenNum = (greenTemp - (greenTemp % 2))/2;
        const yellowNum = (yellowTemp - (yellowTemp % 2))/2;
        const greenYellowDiff = greenNum - yellowNum;
        if(greenYellowDiff === 0){
          numPossibleNodes = greenNum;
        }
        else if(Math.sign(greenYellowDiff) === 1){
          numPossibleNodes = greenNum - Math.abs(greenYellowDiff);
        }
        else{
          numPossibleNodes = yellowNum - Math.abs(greenYellowDiff);
        }

        

        const branchBoard = CoreLogic.cloneGameBoard(state.gameBoard);

        for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
          possibleBranchIndices=CoreLogic.getValidBranchIndices(playerOwner,branchBoard);
        }

        const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

        const nodeBoard = CoreLogic.cloneGameBoard(state.gameBoard);

        for(const branchCombo of possibleBranchCombinations){
          for(const branchIndex of branchCombo){
            nodeBoard.branches[branchIndex].setOwner(playerOwner);
          }
          for(let numNodes = 0; numNodes < numPossibleNodes; numNodes++){
            possibleNodeIndices=CoreLogic.getValidNodeIndices(playerOwner,nodeBoard);
          }

          const possibleNodeCombinations = CoreLogic.kNumberCombinations(possibleNodeIndices, numPossibleNodes);
          if(possibleNodeCombinations.length > 0){
            for(const nodeCombo of possibleNodeCombinations){
              result.push(CoreLogic.moveToString({tradedIn:trade,received:'Y',nodesPlaced:nodeCombo,branchesPlaced:branchCombo}));
            }
          }
          else{
            result.push(CoreLogic.moveToString({tradedIn:trade,received:'Y',nodesPlaced:[],branchesPlaced:branchCombo}));
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

      let numPossibleBranches:number;
      const redBlueDiff = redTemp - blueTemp;

      if(redBlueDiff === 0){
        numPossibleBranches = redTemp;
      }
      else if(Math.sign(redBlueDiff) === 1){
        numPossibleBranches = redTemp - Math.abs(redBlueDiff);
      }
      else{
        numPossibleBranches = blueTemp - Math.abs(redBlueDiff);
      }

      

      let numPossibleNodes:number;
      const greenNum = (greenTemp - (greenTemp % 2))/2;
      const yellowNum = (yellowTemp - (yellowTemp % 2))/2;
      const greenYellowDiff = greenNum - yellowNum;
      if(greenYellowDiff === 0){
        numPossibleNodes = greenNum;
      }
      else if(Math.sign(greenYellowDiff) === 1){
        numPossibleNodes = greenNum - Math.abs(greenYellowDiff);
      }
      else{
        numPossibleNodes = yellowNum - Math.abs(greenYellowDiff);
      }

      

      const branchBoard = CoreLogic.cloneGameBoard(state.gameBoard);

      for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
        possibleBranchIndices=CoreLogic.getValidBranchIndices(playerOwner,branchBoard);
      }

      const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

      const nodeBoard = CoreLogic.cloneGameBoard(state.gameBoard);

      for(const branchCombo of possibleBranchCombinations){
        for(const branchIndex of branchCombo){
          nodeBoard.branches[branchIndex].setOwner(playerOwner);
        }
        for(let numNodes = 0; numNodes < numPossibleNodes; numNodes++){
          possibleNodeIndices=CoreLogic.getValidNodeIndices(playerOwner,nodeBoard);
        }

        const possibleNodeCombinations = CoreLogic.kNumberCombinations(possibleNodeIndices, numPossibleNodes);
        if(possibleNodeCombinations.length > 0){
          for(const nodeCombo of possibleNodeCombinations){
            result.push(CoreLogic.moveToString({tradedIn:noTrade,received:'',nodesPlaced:nodeCombo,branchesPlaced:branchCombo}));
          }
        }
        else{
          result.push(CoreLogic.moveToString({tradedIn:noTrade,received:'',nodesPlaced:[],branchesPlaced:branchCombo}));
        }
        
        for(const branchIndex of branchCombo){
          nodeBoard.branches[branchIndex].setOwner(Owner.NONE);
        }
      }
    }

    if(result.length === 0){
      result.push(';;');
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
    

    for(let branchIndex = 0; branchIndex < gameBoard.branches.length; branchIndex++){

      if (gameBoard.branches[branchIndex].getOwner() === Owner.NONE){
        if(gameBoard.branches[branchIndex].getBranch('branch1') !== -1 &&
          gameBoard.branches[gameBoard.branches[branchIndex].getBranch('branch1')].getOwner() === player){
          result.push(branchIndex);
          
        } 
        else if(gameBoard.branches[branchIndex].getBranch('branch2') !== -1 &&
        gameBoard.branches[gameBoard.branches[branchIndex].getBranch('branch2')].getOwner() === player){
          result.push(branchIndex);
        } 
        else if(gameBoard.branches[branchIndex].getBranch('branch3') !== -1 &&
        gameBoard.branches[gameBoard.branches[branchIndex].getBranch('branch3')].getOwner() === player){
          result.push(branchIndex);
        } 
        else if(gameBoard.branches[branchIndex].getBranch('branch4') !== -1 &&
        gameBoard.branches[gameBoard.branches[branchIndex].getBranch('branch4')].getOwner() === player){
          result.push(branchIndex);
        } 
        else if(gameBoard.branches[branchIndex].getBranch('branch5') !== -1 &&
        gameBoard.branches[gameBoard.branches[branchIndex].getBranch('branch5')].getOwner() === player){
          result.push(branchIndex);
        } 
        else if(gameBoard.branches[branchIndex].getBranch('branch6') !== -1 &&
        gameBoard.branches[gameBoard.branches[branchIndex].getBranch('branch6')].getOwner() === player){
          result.push(branchIndex);
        } 
      }

    }

  
    return result;
  }

  //return 1 if player 1 is the winner, -1 if Player 2 is the winner, 0  if there is no winner yet
  static determineIfWinner(state:State):number {
    let result = 0;

    //console.log(state.currentPlayer,state.player1,state.player2);

    if(state.player1.currentScore >= 10){
      result = 1;
    }
    else if(state.player2.currentScore >= 10){
      result = -1;
    }
    else if(!state.inInitialMoves){
      if(state.currentPlayer === 1 && (state.player1.redResources === 0 && state.player1.redPerTurn === 0 &&
        state.player1.blueResources === 0 && state.player1.bluePerTurn === 0 && 
        state.player1.greenResources === 0 && state.player1.greenPerTurn === 0 &&
        state.player1.yellowResources === 0 && state.player1.yellowPerTurn === 0)){
        result = -1;
      }
      else if(state.currentPlayer === -1 && (state.player2.redResources === 0 && state.player2.redPerTurn === 0 &&
      state.player2.blueResources === 0 && state.player2.bluePerTurn === 0 && 
      state.player2.greenResources === 0 && state.player2.greenPerTurn === 0 &&
      state.player2.yellowResources === 0 && state.player2.yellowPerTurn === 0)){
        result = 1;
      }
    }
    

    return result;
  }

  static nextState(state:State, move:string):State{
    const newHistory = state.moveHistory.slice();
    newHistory.push(move);
    const newBoard = CoreLogic.cloneGameBoard(state.gameBoard);
   

    const newState = new State(newHistory, newBoard, state.currentPlayer, state.player1, state.player2, state.inInitialMoves);

    if(state.currentPlayer === 1){
      CoreLogic.applyMove(move,newState,newState.player1, Owner.PLAYERONE);
    }
    else{
      CoreLogic.applyMove(move,newState,newState.player2, Owner.PLAYERTWO);
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
    //console.log(moveObj);

    //console.log(affectedPlayer);
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

    //console.log(affectedPlayer);

    for(const branch of moveObj.branchesPlaced){
      state.gameBoard.branches[branch].setOwner(owner);
      affectedPlayer.ownedBranches.push(branch);
      if(!state.inInitialMoves){
        affectedPlayer.redResources--;
        affectedPlayer.blueResources--;
      }
      
    }

    for(const node of moveObj.nodesPlaced){
      state.gameBoard.nodes[node].setOwner(owner);
      if(!state.inInitialMoves){
        affectedPlayer.greenResources -= 2;
        affectedPlayer.yellowResources -=2;
      }
      
      affectedPlayer.currentScore++;
      affectedPlayer.numNodesPlaced++;


      

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
    //console.log(affectedPlayer.ownedBranches.length);
    for (let i = 0; i < affectedPlayer.ownedBranches.length; i++) {
      affectedPlayer.currentLength = 0;
      affectedPlayer.branchScanner = [];
    
      CoreLogic.checkForLongest(state,affectedPlayer, affectedPlayer.ownedBranches[i]);
      //console.log('currentlength',affectedPlayer.currentLength);
      //console.log('currentlongest',affectedPlayer.currentLongest);
      
    }
    

    if ((state.player1.currentLongest > state.player2.currentLongest) && state.player1.hasLongestNetwork === false) {
      state.player1.hasLongestNetwork = true;
      state.player1.currentScore += 2;
      if (state.player2.hasLongestNetwork === true) {
        state.player2.hasLongestNetwork = false;
        state.player2.currentScore -= 2;
      }
    }

    else if ((state.player2.currentLongest > state.player1.currentLongest) && state.player2.hasLongestNetwork === false) {
      state.player2.hasLongestNetwork = true;
      state.player2.currentScore += 2;
      if (state.player1.hasLongestNetwork === true) {
        state.player1.hasLongestNetwork = false;
        state.player1.currentScore -= 2;
      }
    }
    else if(state.player1.currentLongest === state.player2.currentLongest){
      if(state.player1.hasLongestNetwork){
        state.player1.hasLongestNetwork = false;
        state.player1.currentScore -= 2;
      }
      if(state.player2.hasLongestNetwork){
        state.player2.hasLongestNetwork = false;
        state.player2.currentScore -= 2;
      }
    }
  
    //captured tile 
    let numberTilesCapturedAtEndOfTurn = 0;

    for (let  i = 0; i < state.gameBoard.tiles.length; i++) {
      state.tilesBeingChecked =[];
      if(CoreLogic.checkForCaptures(state,state.currentPlayer, i)){
        numberTilesCapturedAtEndOfTurn++;
        //CoreLogic.tileExhaustion(state,i, false);
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
            if(nodeOwner.redPerTurn > 0){
              nodeOwner.redPerTurn--;
            }
            break;
          case TileColor.BLUE:
            if(nodeOwner.bluePerTurn > 0){
              nodeOwner.bluePerTurn--;
            }
            break;
          case TileColor.YELLOW:
            if(nodeOwner.yellowPerTurn > 0){
              nodeOwner.yellowPerTurn--;
            }
            break;
          case TileColor.GREEN:
            if(nodeOwner.greenPerTurn > 0){
              nodeOwner.greenPerTurn--;
            }
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
        if(nodeOwner.redPerTurn > 0){
          nodeOwner.redPerTurn--;
        }
        break;
      case TileColor.BLUE:
        if(nodeOwner.bluePerTurn > 0){
          nodeOwner.bluePerTurn--;
        }
        break;
      case TileColor.YELLOW:
        if(nodeOwner.yellowPerTurn > 0){
          nodeOwner.yellowPerTurn--;
        }
        break;
      case TileColor.GREEN:
        if(nodeOwner.greenPerTurn > 0){
          nodeOwner.greenPerTurn--;
        }
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
   

    if (state.currentPlayer === 1) {

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
        CoreLogic.checkForLongest(state, branchOwner, state.gameBoard.branches[currentBranch].getBranch('branch1'));
      }
      if (branch2Owner === Owner.PLAYERTWO) {
        CoreLogic.checkForLongest(state, branchOwner, state.gameBoard.branches[currentBranch].getBranch('branch2'));
      }
      if (branch3Owner === Owner.PLAYERTWO) {
        CoreLogic.checkForLongest(state, branchOwner, state.gameBoard.branches[currentBranch].getBranch('branch3'));
      }
      if (branch4Owner === Owner.PLAYERTWO) {
        CoreLogic.checkForLongest(state, branchOwner, state.gameBoard.branches[currentBranch].getBranch('branch4'));
      }
      if (branch5Owner === Owner.PLAYERTWO) {
        CoreLogic.checkForLongest(state, branchOwner, state.gameBoard.branches[currentBranch].getBranch('branch5'));
      }
      if (branch6Owner === Owner.PLAYERTWO) {
        CoreLogic.checkForLongest(state, branchOwner, state.gameBoard.branches[currentBranch].getBranch('branch6'));
      }
    }

    //branchOwner.branchScanner.pop();
  }

  static checkForCaptures(state:State, current:number, checkTile: number): boolean {
    let capturer:Player;
    if(current === 1){
      capturer = state.player1;
    }
    else{
      capturer = state.player2;
    }
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
        if (CoreLogic.checkForCaptures(state,state.currentPlayer, currentTile.getTopTile()) === false) {
          captured = false;
        }
      }
      if (tileRightBranch.getOwner() === Owner.NONE) {
        if (CoreLogic.checkForCaptures(state,state.currentPlayer, currentTile.getRightTile()) === false) {
          captured = false;
        }
      }
      if (tileBottomBranch.getOwner() === Owner.NONE) {
        if (CoreLogic.checkForCaptures(state,state.currentPlayer, currentTile.getBottomTile()) === false) {
          captured = false;
        }
      }
      if (tileLeftBranch.getOwner() === Owner.NONE) {
        if (CoreLogic.checkForCaptures(state,state.currentPlayer, currentTile.getLeftTile()) === false) {
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

    if(result === ''){
      result = ';;';
    }

    return result; //result should be a string formatted like 'R,R,R,Y;8;3,18'
  }

  static stringToMove(moveString:string):Move{
    const result:Move = {tradedIn:[],received:'',nodesPlaced:[],branchesPlaced:[]};

    const moveSections = moveString.split(';');
    if(moveSections.length === 0){
      result.tradedIn = [];
      result.received = '';
      result.nodesPlaced = [];
      result.branchesPlaced = [];
    }
    else{
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
          if(parseInt(node) !== undefined){
            result.nodesPlaced.push(parseInt(node));
          }
        }

      }
      
    
      if(moveSections[2] !== ''){
        const branches = moveSections[2].split(',');

        for(const branch of branches){
          if(parseInt(branch) !== undefined){
            result.branchesPlaced.push(parseInt(branch));
          }
        }

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

  static clonePlayer(player:Player):Player{
    const result = new Player();

    result.redResources = player.redResources;
    result.blueResources = player.blueResources;
    result.greenResources = player.greenResources;
    result.yellowResources = player.yellowResources;

    result.redPerTurn = player.redPerTurn;
    result.bluePerTurn = player.bluePerTurn;
    result.greenPerTurn = player.greenPerTurn;
    result.yellowPerTurn = player.yellowPerTurn;

    result.hasTraded = player.hasTraded;

    result.currentLength = player.currentLength;
    result.currentLongest = player.currentLongest;
    result.hasLongestNetwork = player.hasLongestNetwork;
    result.ownedBranches = player.ownedBranches.slice();
    result.branchScanner = player.branchScanner.slice();

    result.numTilesCaptured = player.numTilesCaptured;
    result.numNodesPlaced = player.numNodesPlaced;

    result.currentScore = player.currentScore;

    return result;
  }

  static cloneGameBoard(gameBoard:GameBoard):GameBoard{
    const clonedGameBoard = new GameBoard();

    const clonedTiles:Tile[] = [];
    for(let i = 0; i < gameBoard.tiles.length; i++){
      clonedTiles.push(CoreLogic.cloneTile(gameBoard.tiles[i]));
    }

    const clonedNodes:Node[] = [];
    for(let i = 0; i < gameBoard.nodes.length; i++){
      clonedNodes.push(CoreLogic.cloneNode(gameBoard.nodes[i]));
    }

    const clonedBranches:Branch[] = [];
    for(let i = 0; i < gameBoard.branches.length; i++){
      clonedBranches.push(CoreLogic.cloneBranch(gameBoard.branches[i]));
    }

    clonedGameBoard.tiles = clonedTiles;
    clonedGameBoard.nodes = clonedNodes;
    clonedGameBoard.branches = clonedBranches;

    return clonedGameBoard;

  }

  static cloneTile(tile:Tile):Tile{

    const clonedTile = new Tile();

    clonedTile.color = tile.color;
    clonedTile.isExhausted = tile.isExhausted;
    clonedTile.maxNodes = tile.maxNodes;
    clonedTile.nodeCount = tile.nodeCount;

    clonedTile.setTopLeftNode(tile.getTopLeftNode());
    clonedTile.setTopRightNode(tile.getTopRightNode());
    clonedTile.setBottomLeftNode(tile.getBottomLeftNode());
    clonedTile.setBottomRightNode(tile.getBottomRightNode());

    clonedTile.setTopBranch(tile.getTopBranch());
    clonedTile.setLeftBranch(tile.getLeftBranch());
    clonedTile.setBottomBranch(tile.getBottomBranch());
    clonedTile.setRightBranch(tile.getRightBranch());

    clonedTile.setTopTile(tile.getTopTile());
    clonedTile.setLeftTile(tile.getLeftTile());
    clonedTile.setBottomTile(tile.getBottomTile());
    clonedTile.setRightTile(tile.getRightTile());

    return clonedTile;

  }

  static cloneBranch(branch:Branch):Branch{
    const clonedBranch = new Branch();

    clonedBranch.setOwner(branch.getOwner());

    clonedBranch.setBranch("branch1",branch.getBranch("branch1"));
    clonedBranch.setBranch("branch2",branch.getBranch("branch2"));
    clonedBranch.setBranch("branch3",branch.getBranch("branch3"));
    clonedBranch.setBranch("branch4",branch.getBranch("branch4"));
    clonedBranch.setBranch("branch5",branch.getBranch("branch5"));
    clonedBranch.setBranch("branch6",branch.getBranch("branch6"));

    return clonedBranch;
  }

  static cloneNode(node:Node):Node{
    const clonedNode = new Node();

    clonedNode.setOwner(node.getOwner());
    
    clonedNode.setRedProvided(node.getRedProvided());
    clonedNode.setBlueProvided(node.getBlueProvided());
    clonedNode.setGreenProvided(node.getGreenProvided());
    clonedNode.setYellowProvided(node.getYellowProvided());

    clonedNode.setTopBranch(node.getTopBranch());
    clonedNode.setLeftBranch(node.getLeftBranch());
    clonedNode.setBottomBranch(node.getBottomBranch());
    clonedNode.setRightBranch(node.getRightBranch());

    clonedNode.setTopLeftTile(node.getTopLeftTile());
    clonedNode.setTopRightTile(node.getTopRightTile());
    clonedNode.setBottomRightTile(node.getBottomRightTile());
    clonedNode.setBottomLeftTile(node.getBottomLeftTile());

    return clonedNode;
  }
}