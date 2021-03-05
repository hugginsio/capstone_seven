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

  // static getStartingState(player1:Player, player2:Player, gameBoard:GameBoard, currentPlayer:number):State{
  //   const newBoard = CoreLogic.cloneGameBoard(gameBoard);
  //   //const clonedPlayer1 = CoreLogic.clonePlayer(player1);
  //   //const clonedPlayer2 = CoreLogic.clonePlayer(player2);
    
  //   return new State([], newBoard, currentPlayer, player1, player2,true);
  // }

  static getLegalMoves(state:State): string[] {
    
    const result:string[] = [];
    //console.log(state.inInitialMoves);
    
    if(state.player1.numNodesPlaced <= 1 && state.player2.numNodesPlaced <= 2){
      //initial moves
      // if(state.playerNumber === 1){
      //   state.player1.redResources = 1;
      //   state.player1.blueResources = 1;
      //   state.player1.greenResources = 2;
      //   state.player1.yellowResources = 2;
      // }
      // else{
      //   state.player2.redResources = 1;
      //   state.player2.blueResources = 1;
      //   state.player2.greenResources = 2;
      //   state.player2.yellowResources = 2;

      // }

      const nodePlacements = [];
      
      //get starting move possibilities for player 1
      for(const node of state.board.nodes){
        if(node.getOwner() === Owner.NONE){
          nodePlacements.push(state.board.nodes.indexOf(node));
        }
      }

      const branchPlacements = [];
      for(const nodeIndex of nodePlacements){
        const branchesPerNode = [];
        if(state.board.nodes[nodeIndex].getTopBranch() >= 0){
          if ( state.board.branches[state.board.nodes[nodeIndex].getTopBranch()].getOwner() === Owner.NONE){
            branchesPerNode.push(state.board.nodes[nodeIndex].getTopBranch());
          }
        }

        if(state.board.nodes[nodeIndex].getRightBranch() >= 0){
          if ( state.board.branches[state.board.nodes[nodeIndex].getRightBranch()].getOwner() === Owner.NONE){
            branchesPerNode.push(state.board.nodes[nodeIndex].getRightBranch());
          }
        }

        if(state.board.nodes[nodeIndex].getBottomBranch() >= 0){
          if ( state.board.branches[state.board.nodes[nodeIndex].getBottomBranch()].getOwner() === Owner.NONE){
            branchesPerNode.push(state.board.nodes[nodeIndex].getBottomBranch());
          }
        }

        if(state.board.nodes[nodeIndex].getLeftBranch() >= 0){
          if ( state.board.branches[state.board.nodes[nodeIndex].getLeftBranch()].getOwner() === Owner.NONE){
            branchesPerNode.push(state.board.nodes[nodeIndex].getLeftBranch());
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

      // if(state.playerNumber === 2){
      //   state.player1.redResources += state.player1.redPerTurn;
      //   state.player1.blueResources += state.player1.bluePerTurn;
      //   state.player1.greenResources += state.player1.greenPerTurn;
      //   state.player1.yellowResources += state.player1.yellowPerTurn;
      // }
      // else{
      //   state.player2.redResources += state.player2.redPerTurn;
      //   state.player2.blueResources += state.player2.bluePerTurn;
      //   state.player2.greenResources += state.player2.greenPerTurn;
      //   state.player2.yellowResources += state.player2.yellowPerTurn;

      // }

      let redAvailable:number;
      let blueAvailable:number;
      let greenAvailable:number;
      let yellowAvailable:number;
      let playerOwner:Owner;

      if(state.playerNumber === 1){
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

      /*console.log({redTrades:JSON.stringify(tradeForRedCombinations),
        blueTrades:JSON.stringify(tradeForBlueCombinations),
        greenTrades:JSON.stringify(tradeForGreenCombinations),
        yellowTrades:JSON.stringify(tradeForYellowCombinations)});*/

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

        

        const branchBoard = CoreLogic.cloneGameBoard(state.board);

        for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
          possibleBranchIndices=CoreLogic.getValidBranchIndices(state,playerOwner,branchBoard);
        }

        const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

        const nodeBoard = CoreLogic.cloneGameBoard(state.board);
        if(possibleBranchCombinations.length > 0){
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
        }
        else{
          result.push(CoreLogic.moveToString({tradedIn:trade,received:'R',nodesPlaced:[],branchesPlaced:[]}));
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

        

        const branchBoard = CoreLogic.cloneGameBoard(state.board);

        for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
          possibleBranchIndices=CoreLogic.getValidBranchIndices(state,playerOwner,branchBoard);
        }

        const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

        const nodeBoard = CoreLogic.cloneGameBoard(state.board);
        if(possibleBranchCombinations.length > 0){
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
        }
        else{
          result.push(CoreLogic.moveToString({tradedIn:trade,received:'B',nodesPlaced:[],branchesPlaced:[]}));
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

        

        const branchBoard = CoreLogic.cloneGameBoard(state.board);

        for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
          possibleBranchIndices=CoreLogic.getValidBranchIndices(state,playerOwner,branchBoard);
        }

        const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

        const nodeBoard = CoreLogic.cloneGameBoard(state.board);
        if(possibleBranchCombinations.length > 0){
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
        }
        else{
          result.push(CoreLogic.moveToString({tradedIn:trade,received:'G',nodesPlaced:[],branchesPlaced:[]}));
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

        

        const branchBoard = CoreLogic.cloneGameBoard(state.board);

        for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
          possibleBranchIndices=CoreLogic.getValidBranchIndices(state,playerOwner,branchBoard);
        }

        const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

        const nodeBoard = CoreLogic.cloneGameBoard(state.board);
        if(possibleBranchCombinations.length > 0){
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
        }
        else{
          result.push(CoreLogic.moveToString({tradedIn:trade,received:'Y',nodesPlaced:[],branchesPlaced:[]}));
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

      

      const branchBoard = CoreLogic.cloneGameBoard(state.board);

      for(let numBranches = 0; numBranches < numPossibleBranches; numBranches++){
        possibleBranchIndices=CoreLogic.getValidBranchIndices(state,playerOwner,branchBoard);
      }

      const possibleBranchCombinations = CoreLogic.kNumberCombinations(possibleBranchIndices,numPossibleBranches);

      const nodeBoard = CoreLogic.cloneGameBoard(state.board);

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

  static getValidBranchIndices(state:State,player:Owner, gameBoard:GameBoard):number[]{
    const result:number[] = [];
    

    for(let branchIndex = 0; branchIndex < gameBoard.branches.length; branchIndex++){

      const otherPlayer = player === Owner.PLAYERONE ? state.player2 : state.player1;
      let branchNotIntrudingInCapturedSpaces = false;
      // fail condition: branch is adjacent to tile captured by other player
      for (let i = 0; i < otherPlayer.capturedTiles.length; i++) {
        const currentCapturedTile = gameBoard.tiles[otherPlayer.capturedTiles[i]];
        if (currentCapturedTile.getTopBranch() === branchIndex ||
          currentCapturedTile.getRightBranch() === branchIndex ||
          currentCapturedTile.getBottomBranch() === branchIndex ||
          currentCapturedTile.getLeftBranch() === branchIndex) {
          branchNotIntrudingInCapturedSpaces = true;
        }
      }

      if (gameBoard.branches[branchIndex].getOwner() === Owner.NONE && !branchNotIntrudingInCapturedSpaces){
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
  static getWinner(state:State):number {
    let result = 0;

    //console.log(state.currentPlayer,state.player1,state.player2);

    if(state.player1.currentScore >= 10){
      result = 1;
    }
    else if(state.player2.currentScore >= 10){
      result = 2;
    }
    else if(state.player1.numNodesPlaced  >= 2 && state.player2.numNodesPlaced >= 2){
      if(state.getPlayerNo() === 1 && (state.player1.redResources < 1 && state.player1.redPerTurn === 0 &&
        state.player1.blueResources < 1 && state.player1.bluePerTurn === 0 && 
        state.player1.greenResources < 2 && state.player1.greenPerTurn === 0 &&
        state.player1.yellowResources < 2 && state.player1.yellowPerTurn === 0)){
        result = 2;
      }
      else if(state.getPlayerNo() === 2 && (state.player2.redResources < 1 && state.player2.redPerTurn === 0 &&
      state.player2.blueResources < 1 && state.player2.bluePerTurn === 0 && 
      state.player2.greenResources < 2 && state.player2.greenPerTurn === 0 &&
      state.player2.yellowResources < 2 && state.player2.yellowPerTurn === 0)){
        result = 1;
      }
    }
    

    return result;
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
    result.capturedTiles = player.capturedTiles.slice();

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