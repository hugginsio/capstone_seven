import { GameBoard } from '../gamecore/game.class.GameBoard';
import { Tree, MCTSNode } from './ai.class.MCTSNode';
import { State } from './ai.class.State';
import { CoreLogic } from '../../util/core-logic.util';
import { state } from '@angular/animations';

interface GameStatistics {
  runtime: number,
  simulations: number
}


export class MonteCarlo {
  static WINSCORE = 10;
  opponent:number;

  findNextMove(board:GameBoard, playerNo:number) {
    // define an end time in milliseconds which will act as a terminating condition
    const end = Date.now() + 5800;


    this.opponent = 3 - playerNo;
    const tree = new Tree();
    const rootNode = tree.getRoot();
    rootNode.getState().setBoard(board);
    rootNode.getState().setPlayerNo(this.opponent);

    while (Date.now() < end) {
      const promisingNode = this.selectPromisingNode(rootNode);
      if (promisingNode.getState().getBoard().checkStatus() == Board.IN_PROGRESS) {
        this.expandNode(promisingNode);
      }
      let nodeToExplore = promisingNode;
      if (promisingNode.getChildArray().size() > 0) {
        nodeToExplore = promisingNode.getRandomChildNode();
      }
      const playoutResult = this.simulateRandomPlayout(nodeToExplore);
      this.backPropogation(nodeToExplore, playoutResult);
    }

    const winnerNode = rootNode.getChildWithMaxScore();
    tree.setRoot(winnerNode);
    return winnerNode.getState().getMove();
  }

  selectPromisingNode(rootNode:MCTSNode):MCTSNode {
    let node = rootNode;
    while (node.getChildArray().length != 0) {
      node = UCT.findBestNodeWithUCT(node);
    }
    return node;
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