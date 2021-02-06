import { Injectable } from '@angular/core';

import { MCTSNode, State, MCTSNodePlaceHolder } from '../../interfaces/ai.interfaces';

@Injectable({
  providedIn: 'root'
})
export class MCTSNodeService implements MCTSNode{
  move:string;
  parent:MCTSNode;
  visits:number;
  wins:number;
  children:Map<string,MCTSNodePlaceHolder>;
  unexpandedMoves:string[];
  state:State;

  constructor(parent:MCTSNode, move:string, state:State, unexpandedMoves:string[]) {
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

    const childNode = new MCTSNodeService(this,move,childState,unexpandedMoves);
    this.children.set(move, {move:move, node:childNode});

    return childNode;
  }

  getAllMoves():string[] {
    const result = [];
    for(const child of this.children.values()){
      result.push(child.move);
    }

    return result;
  }

  getUnexpandedMoves():string[] {
    const result = [];
    for(const child of this.children.values()){
      if(child.node === null){
        result.push(child.move);
      }
    }

    return result;
  }

  isFullyExpanded():boolean {
    let result = true;
    for(const child of this.children.values()){
      if(child.node === null){
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
    return (this.wins / this.visits) + Math.sqrt(biasParam * Math.log(this.parent.visits) / this.visits);
  }
}
