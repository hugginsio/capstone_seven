import { Owner } from '../../enums/game.enums';
import { State } from './ai.class.State';


interface MCTSNodeInterface {
  node:MCTSNode | null
}

export class MCTSNode {
  move:string | null;
  parent:MCTSNode | null ;
  visits:number;
  wins:number;
  childrenKeys:string[];
  childrenValues:MCTSNodeInterface[];

  state:State;

  constructor(parent:MCTSNode | null, move:string | null, state:State, unexpandedMoves:string[]) {
    this.move = move;
    this.state = state;

    this.wins = 0;
    this.visits = 0;


    this.parent = parent;
    this.childrenKeys = [];
    this.childrenValues = [];

    //console.log(unexpandedMoves);
    for(let i = 0; i < unexpandedMoves.length; i++){
      this.childrenKeys.push(unexpandedMoves[i]);
      this.childrenValues.push({node:null});
    }
    //console.log(this.childrenKeys, this.childrenValues);
  }

  getChildNode(move:string):MCTSNode{
    const child = this.childrenValues[this.childrenKeys.indexOf(move)];

    if(child === undefined){
      throw new Error("There is no such move!");
    }
    else if (child.node === null){
      throw new Error("Child is not expanded");
    }
    
    return child.node;
  }

  expand(move:string, childState:State, unexpandedMoves:string[]):MCTSNode {
    if(!this.childrenKeys.includes(move)){
      throw new Error("No such move!");
    }

    const childNode = new MCTSNode(this,move,childState,unexpandedMoves);
    const index = this.childrenKeys.indexOf(move);
    this.childrenValues[index] = {node:childNode};

    return childNode;
  }

  getAllMoves():string[] {
    const result = [];

    for(const child of this.childrenKeys){
      result.push(child);
    }

    return result;
  }

  getUnexpandedMoves():string[] {
    const result = [];
    for(let i = 0; i < this.childrenValues.length; i++){
      if(this.childrenValues[i].node === null){
        result.push(this.childrenKeys[i]);
      }
    }

    return result;
  }

  isFullyExpanded():boolean {
    let result = true;
    for(let i = 0; i < this.childrenValues.length; i++){
      if(this.childrenValues[i].node === null){
        result = false;
      }
    }
    return result;
  }

  isLeaf():boolean {
    let result = false;
    
    if(this.childrenKeys. length < 1){
      result = true;
    }


    return result;
  }

  getUCBValue(biasParam:number):number {
    let visitNumber = 0;
    if(this.parent !== null){
      visitNumber = this.parent.visits;
    }
    return (this.wins / this.visits) + Math.sqrt(biasParam * Math.log(visitNumber) / this.visits);
  }
}