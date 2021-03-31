import { GameBoard } from '../gamecore/game.class.GameBoard';
import { Tree, MCTSNode } from './ai.class.MCTSNode';
import { State } from './ai.class.State';
import { CoreLogic } from '../../util/core-logic.util';
import { Player } from '../gamecore/game.class.Player';

interface PlayoutResult{
  playerNumber:number;
}
export class MonteCarlo {
  WINSCORE = 10;
  explorationParameter:number;
  opponent:number;
  tree:Tree;

  NUMWORKERS = 4;
  workers:Array<Worker>;
  simNum = 0;
  

  constructor(gameBoard:GameBoard,player1:Player,player2:Player,explorationParameter:number){
    this.explorationParameter = explorationParameter;
    this.tree = new Tree();
    const startingState = new State(gameBoard,player1,player2);
    const startingRoot = new MCTSNode(startingState);
    this.tree.setRoot(startingRoot);
 

    this.workers = [];
    for(let i = 0; i < this.NUMWORKERS; i++){
      this.workers.push(new Worker('../../workers/simulation.worker.ts', { type: 'module' }));
    }
  }

  
  findNextMove(gameState:State,time:number):string {
    // define an end time in milliseconds which will act as a terminating condition
    const end = Date.now() + time;
    

    const newNode = new MCTSNode(gameState);
    const currentRoot = this.tree.getRoot();
    let childStateFound = false;

    for(let i = 0; i < currentRoot.childArray.length;i++){
      if(currentRoot.childArray[i].getState().move === newNode.getState().move){
        this.tree.setRoot(currentRoot.childArray[i]);
        childStateFound = true;
        i = currentRoot.childArray.length;
      }
    }

    if(!childStateFound){
      this.tree.setRoot(newNode);
    }

    const rootNode = this.tree.getRoot();
   
    this.simNum = 0;
    //while (Date.now() < end) {
    for(let iteration = 0; iteration < 10; iteration++){
      const promisingNode = this.selectPromisingNode(rootNode);
      if (CoreLogic.getWinner(promisingNode.getState()) === 0) {
        this.expandNode(promisingNode);
      }
      let nodeToExplore = promisingNode;
      if (promisingNode.getChildArray().length > 0) {
        nodeToExplore = promisingNode.getRandomChildNode();
      }
      //const playoutResult = this.simulateRandomPlayout(nodeToExplore);
      //this.backPropogation(nodeToExplore, playoutResult);
      this.simulateRandomPlayout(nodeToExplore);
      
    }

    console.log(`Number of Simulations = ${this.simNum}`);
    if(rootNode.getChildArray().length > 0){
      const winnerNode = rootNode.getChildWithMaxScore();
      this.tree.setRoot(winnerNode);
      return winnerNode.getState().getMove();
    }
    else{
      return ';;';
    }
  }

  selectPromisingNode(rootNode:MCTSNode):MCTSNode {
    //const start = Date.now();
    let node = rootNode;
    while (node.getChildArray().length != 0) {
      node = UCT.findBestNodeWithUCT(node,this.explorationParameter);
    }
    //console.log(`SelectPromisingNode TIME: ${Date.now() - start}ms`);
    return node;
  }

  expandNode(node:MCTSNode):void {
    //const start = Date.now();
    const possibleStates = node.getState().getAllPossibleStates();
    for(const state of possibleStates){
      const newNode = new MCTSNode(state);
      newNode.setParent(node);

      newNode.getState().setPlayerNo(node.getState().getOpponent());
      node.getChildArray().push(newNode);
    }
    
    //console.log(`expandNode TIME: ${Date.now() - start}ms`);
  }

  backPropogation(nodeToExplore:MCTSNode, playoutResult:number):void {
    //const start = Date.now();
    let tempNode:MCTSNode|null = nodeToExplore;
    while (tempNode != null) {
      tempNode.getState().incrementVisit();
      if (tempNode.getState().getPlayerNo() == playoutResult) {
        tempNode.getState().addScore(this.WINSCORE);
      }
      tempNode = tempNode.getParent();
    }
    //console.log(`backPropagation TIME: ${Date.now() - start}ms`);
  }

  async simulateRandomPlayout(node:MCTSNode):Promise<void> {
    //const start = Date.now();
    const tempNode = MCTSNode.copyConstructor(node);
    const tempState = tempNode.getState();
    let boardStatus = CoreLogic.getWinner(tempState);
    //let result = {playerNumber:boardStatus,multiplier:1};
    if (boardStatus == this.opponent) {
      const tempParent = tempNode.getParent();
      if(tempParent !== null){
        tempParent.getState().setWinScore(Number.MIN_VALUE);
      }
      this.backPropogation(node, boardStatus);
      //return boardStatus;
    }


   
    // let counter = 0; //decrease counter and assign winner based on score if game not finished
    // while (boardStatus === 0 && counter < 15) {
    //   if(tempState.player1.numNodesPlaced === 1 && tempState.playerNumber === 1){
    //     tempState.player1.redResources = 1;
    //     tempState.player1.blueResources = 1;
    //     tempState.player1.greenResources = 2;
    //     tempState.player1.yellowResources = 2;
    //   }
    //   tempState.randomPlay();
    //   //tempState.heuristicPlay();
    //   boardStatus = CoreLogic.getWinner(tempState);
    //   tempState.togglePlayer();
    //   //console.log(`Inside simulation: count = ${counter}`);
    //   counter++;
    // }

    // if(boardStatus === 0){
    //   if(tempState.getHeuristicValue() > 0){
    //     boardStatus = 1;
    //   }
    //   else{
    //     boardStatus = 2;
    //   }
    // }

    //this.backPropogation(node,boardStatus);

    
    // return boardStatus;
    // let player1Wins = 0;
    // let player2Wins = 0;

    
    var promises = [];
    for(var i = 0; i < this.NUMWORKERS; i++) {
        promises.push(new Promise((resolve)=>{
          this.workers[i].postMessage(tempState);
          this.workers[i].onmessage = ({data})=>{
              this.simNum++;
              resolve(data);
          };
      }));
    }
    
    let promise = await Promise.all(promises)
        .then((data) =>{
          console.log('inside promise');
          console.log(data.toString());
            // `data` has the results, compute the final solution
            for(let j = 0; j < data.length;j++){

              this.backPropogation(node,data[j]as number);
            }
        });

    // console.log('blah blah');
    
    // if(player1Wins > player2Wins){
    //   result = {playerNumber:1,multiplier:player1Wins};
    // }
    // else{
    //   result = {playerNumber:2,multiplier:player2Wins};
    // }
    

    //console.log(`simulateRandomPlayout TIME: ${Date.now() - start}ms`);

    //console.log(result);
    //return result;
  }





}


class UCT {
  static uctValue(totalVisit:number, nodeWinScore:number, nodeVisit:number, explorationParameter:number):number {
    if (nodeVisit == 0) {
      return Number.MAX_VALUE;
    }
    return (nodeWinScore / nodeVisit) + explorationParameter * Math.sqrt(Math.log(totalVisit) / nodeVisit);
  }

  static findBestNodeWithUCT(node:MCTSNode,explorationParameter:number):MCTSNode {
    const parentVisit = node.getState().getVisitCount();
    let maxUctValue = this.uctValue(parentVisit,node.getChildArray()[0].getState().getWinScore(),node.getChildArray()[0].getState().getVisitCount(),explorationParameter);
    let maxNode = node.getChildArray()[0];
    for(let i = 1; i < node.getChildArray().length; i++){
      const uctValue = this.uctValue(parentVisit,node.getChildArray()[i].getState().getWinScore(),node.getChildArray()[i].getState().getVisitCount(),explorationParameter);
      if(uctValue > maxUctValue){
        maxUctValue = uctValue;
        maxNode = node.getChildArray()[i];
      }
    }
    return maxNode;
  }
}