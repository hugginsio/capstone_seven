import { GameBoard } from '../gamecore/game.class.GameBoard';
import { Tree, MCTSNode } from './ai.class.MCTSNode';
import { State } from './ai.class.State';
import { CoreLogic } from '../../util/core-logic.util';
import { Player } from '../gamecore/game.class.Player';

export class MonteCarlo {
  WINSCORE = 10;
  opponent:number;
  tree:Tree;

  constructor(gameBoard:GameBoard,player1:Player,player2:Player){
    this.tree = new Tree();
    const startingState = new State(gameBoard,player1,player2);
    const startingRoot = new MCTSNode(startingState);
    this.tree.setRoot(startingRoot);
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


    while (Date.now() < end) {
    //for(let iteration = 0; iteration < 10; iteration++){
      const promisingNode = this.selectPromisingNode(rootNode);
      if (CoreLogic.getWinner(promisingNode.getState()) === 0) {
        this.expandNode(promisingNode);
      }
      let nodeToExplore = promisingNode;
      if (promisingNode.getChildArray().length > 0) {
        nodeToExplore = promisingNode.getRandomChildNode();
      }
      const playoutResult = this.simulateRandomPlayout(nodeToExplore);
      this.backPropogation(nodeToExplore, playoutResult);
    }

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
    const start = Date.now();
    let node = rootNode;
    while (node.getChildArray().length != 0) {
      node = UCT.findBestNodeWithUCT(node);
    }
    console.log(`SelectPromisingNode TIME: ${Date.now() - start}ms`);
    return node;
  }

  expandNode(node:MCTSNode):void {
    const start = Date.now();
    const possibleStates = node.getState().getAllPossibleStates();
    for(const state of possibleStates){
      const newNode = new MCTSNode(state);
      newNode.setParent(node);

      newNode.getState().setPlayerNo(node.getState().getOpponent());
      node.getChildArray().push(newNode);
    }
    
    console.log(`expandNode TIME: ${Date.now() - start}ms`);
  }

  backPropogation(nodeToExplore:MCTSNode, playerNo:number):void {
    const start = Date.now();
    let tempNode:MCTSNode|null = nodeToExplore;
    while (tempNode != null) {
      tempNode.getState().incrementVisit();
      if (tempNode.getState().getPlayerNo() == playerNo) {
        tempNode.getState().addScore(this.WINSCORE);
      }
      tempNode = tempNode.getParent();
    }
    console.log(`backPropagation TIME: ${Date.now() - start}ms`);
  }

  simulateRandomPlayout(node:MCTSNode):number {
    const start = Date.now();
    const tempNode = MCTSNode.copyConstructor(node);
    const tempState = tempNode.getState();
    let boardStatus = CoreLogic.getWinner(tempState);
    if (boardStatus == this.opponent) {
      const tempParent = tempNode.getParent();
      if(tempParent !== null){
        tempParent.getState().setWinScore(Number.MIN_VALUE);
      }

      return boardStatus;
    }
    let counter = 0; //decrease counter and assign winner based on score if game not finished
    while (boardStatus === 0 && counter < 30) {
      if(tempState.player1.numNodesPlaced === 1 && tempState.playerNumber === 1){
        tempState.player1.redResources = 1;
        tempState.player1.blueResources = 1;
        tempState.player1.greenResources = 2;
        tempState.player1.yellowResources = 2;
      }
      tempState.randomPlay();
      boardStatus = CoreLogic.getWinner(tempState);
      tempState.togglePlayer();
      console.log(`Inside simulation: count = ${counter}`);
      counter++;
    }

    console.log(`simulateRandomPlayout TIME: ${Date.now() - start}ms`);
    return boardStatus;
  }

}

class UCT {
  static uctValue(totalVisit:number, nodeWinScore:number, nodeVisit:number):number {
    if (nodeVisit == 0) {
      return Number.MAX_VALUE;
    }
    return (nodeWinScore / nodeVisit) + 1.41 * Math.sqrt(Math.log(totalVisit) / nodeVisit);
  }

  static findBestNodeWithUCT(node:MCTSNode):MCTSNode {
    const parentVisit = node.getState().getVisitCount();
    let maxUctValue = this.uctValue(parentVisit,node.getChildArray()[0].getState().getWinScore(),node.getChildArray()[0].getState().getVisitCount());
    let maxNode = node.getChildArray()[0];
    for(let i = 1; i < node.getChildArray().length; i++){
      const uctValue = this.uctValue(parentVisit,node.getChildArray()[i].getState().getWinScore(),node.getChildArray()[i].getState().getVisitCount());
      if(uctValue > maxUctValue){
        maxUctValue = uctValue;
        maxNode = node.getChildArray()[i];
      }
    }
    return maxNode;
  }
}