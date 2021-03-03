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

  findNextMove(previousMove:string, playerNo:number):string {
    // define an end time in milliseconds which will act as a terminating condition
    const end = Date.now() + 5800;

    this.opponent = 3 - playerNo;
    //const tree = new Tree();
    let rootNode = this.tree.getRoot();
    if(rootNode.getChildArray().length === 0){
      this.expandNode(rootNode);
    }

    for(let i = 0; i < rootNode.getChildArray().length; i++){
      if(rootNode.getChildArray()[i].getState().getMove() === previousMove){
        rootNode = rootNode.getChildArray()[i];
      }
    }

    // if(rootNode.getChildArray().length > 0){
    //   for(let i = 0; i < rootNode.getChildArray().length; i++){
    //     if(rootNode.getChildArray()[i].getState().getMove() === previousMove){
    //       rootNode = rootNode.getChildArray()[i];
    //     }
    //   }
    // }
    // else{
    //   const newRootState = rootNode.getState().cloneState();
    //   newRootState.move = previousMove;
    //   newRootState.togglePlayer();
    //   newRootState.turnNumber++;

    //   CoreLogic.applyMove(previousMove,newRootState);

    //   const newRoot = new MCTSNode(newRootState);
    //   rootNode = newRoot;
    // }

    if(rootNode.getState().turnNumber !== 2){
      rootNode.getState().setPlayerNo(this.opponent);
    }

    //while (Date.now() < end) {
    for(let iteration = 0; iteration < 1; iteration++){
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

    const winnerNode = rootNode.getChildWithMaxScore();
    this.tree.setRoot(winnerNode);
    return winnerNode.getState().getMove();
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
    while (boardStatus === 0 && tempState.turnNumber < 100) {
      tempState.togglePlayer();
      tempState.randomPlay();
      boardStatus = CoreLogic.getWinner(tempState);
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