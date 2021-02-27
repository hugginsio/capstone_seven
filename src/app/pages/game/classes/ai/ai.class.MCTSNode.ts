import { Owner } from '../../enums/game.enums';
import { CoreLogic } from '../../util/core-logic.util';
import { State } from './ai.class.State';


interface MCTSNodeInterface {
  node:MCTSNode | null
}

export class Tree{
  root:MCTSNode;

}

export class MCTSNode {
  state:State;
  parent:MCTSNode | null;
  childArray:Array<MCTSNode>;
}