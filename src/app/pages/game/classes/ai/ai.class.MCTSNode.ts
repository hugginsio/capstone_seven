import { State } from './ai.class.State';


interface MCTSNodePlaceHolder {
  move:string,
  node:MCTSNode | null
}

export class MCTSNode {
  move:string | null;
  parent:MCTSNode | null ;
  visits:number;
  wins:number;
  children:Map<string,MCTSNodePlaceHolder>;
  unexpandedMoves:string[];
  state:State;

  constructor(parent:MCTSNode | null, move:string | null, state:State, unexpandedMoves:string[]) {
    this.move = move;
    this.state = state;

    this.wins = 0;
    this.visits = 0;

    this.parent = parent;
    this.children = new Map();
    for(const move of unexpandedMoves){
      this.children.set(move, {move:move, node:null});
    }
  }

  getChildNode(move:string):MCTSNode{
    const child = this.children.get(move);

    if(child === undefined){
      throw new Error("There is no such move!");
    }
    else if (child.node === null){
      throw new Error("Child is not expanded");
    }
    
    return child.node;
  }

  expand(move:string, childState:State, unexpandedMoves:string[]):MCTSNode {
    if(!this.children.has(move)){
      throw new Error("No such move!");
    }

    const childNode = new MCTSNode(this,move,childState,unexpandedMoves);
    this.children.set(move, {move:move, node:childNode});

    return childNode;
  }

  getAllMoves():string[] {
    const result = [];

    for(const child in this.children.values()){
      result.push(child);
    }

    return result;
  }

  getUnexpandedMoves():string[] {
    const result = [];
    for(const child in this.children.values()){
      if(this.children.get(child) === null){
        result.push(child);
      }
    }

    return result;
  }

  isFullyExpanded():boolean {
    let result = true;
    for(const child in this.children.values()){
      if(this.children.get(child) === null){
        result = false;
      }
    }
    return result;
  }

  isLeaf():boolean {
    let result = false;
    if(this.children.size === 0){
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