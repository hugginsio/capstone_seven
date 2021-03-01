import { Owner } from '../../enums/game.enums';
import { CoreLogic } from '../../util/core-logic.util';
import { GameBoard } from '../gamecore/game.class.GameBoard';
import { State } from './ai.class.State';


interface MCTSNodeInterface {
  node:MCTSNode | null
}

export class Tree{
  root:MCTSNode;

  getRoot():MCTSNode{
    return this.root;
  }

  setRoot(newRoot:MCTSNode):void{
    this.root = newRoot;
  }
}

export class MCTSNode {
  state:State;
  parent:MCTSNode | null;
  childArray:Array<MCTSNode>;

  getState():State{
    return this.state;
  }

  getChildArray():Array<MCTSNode>{
    return this.childArray;
  }
}