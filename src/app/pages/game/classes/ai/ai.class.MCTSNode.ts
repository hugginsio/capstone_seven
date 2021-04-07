import { CoreLogic } from '../../util/core-logic.util';
import { State } from './ai.class.State';
import { UCT } from './ai.class.MonteCarlo';
import { core } from '@angular/compiler';


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

  constructor(state:State){
    this.state = state;
    this.parent = null;
    this.childArray = [];
  }

  static copyConstructor(node:MCTSNode):MCTSNode{
    const newNode = new MCTSNode(node.getState().cloneState());
    newNode.parent = node.parent;
    
    newNode.childArray = node.childArray;

    return newNode;
    
  }

  getRandomChildNode():MCTSNode{
    return this.chooseWeightedChildren();
    //return this.childArray[Math.floor(Math.random() * this.childArray.length)];
    

  }

  getChildWithMaxScore():MCTSNode{
    let maxChild = this.childArray[0];
    let maxScore = this.childArray[0].getState().getWinScore();
    let maxVisitRatio = maxScore / this.childArray[0].getState().visitCount;

    const method = 'RATIO';
    if(method === 'RATIO'){
      for(let i = 1; i < this.childArray.length;i++){
        const tempScore = this.childArray[i].getState().getWinScore();
        const visits = this.childArray[i].getState().visitCount;
        const visitRatio = tempScore/visits;
        if(visitRatio > maxVisitRatio){
          maxVisitRatio = visitRatio;
          maxChild = this.childArray[i];
        }
      }
    }
    else{
      for(let i = 1; i < this.childArray.length;i++){
        const tempScore = this.childArray[i].getState().getWinScore();
        
        if(tempScore > maxScore){
          maxScore = tempScore;
          maxChild = this.childArray[i];
        }
      }
    }


    return maxChild;
  }

  getState():State{
    return this.state;
  }

  getChildArray():Array<MCTSNode>{
    return this.childArray;
  }

  getParent():MCTSNode|null{
    return this.parent;
  }

  setParent(node:MCTSNode):void{
    this.parent = node;
  }

  chooseWeightedChildren():MCTSNode{
    //const weights = Array<MCTSNode>();
    const currentPlayer = this.state.playerNumber === 1 ? this.state.player1 : this.state.player2;

    let chosenIndex = 0;
    let chosenPlayerOneValue = Number.NEGATIVE_INFINITY;
    let chosenPlayerTwoValue = Number.POSITIVE_INFINITY;

    for(const child of this.childArray){
      const value = child.state.getHeuristicValue();
      if(child.state.playerNumber === 1){
        if(value >= chosenPlayerOneValue){
          chosenPlayerOneValue = value;
          chosenIndex = this.childArray.indexOf(child);
        }
      }
      else{
        if(value <= chosenPlayerTwoValue){
          chosenPlayerTwoValue = value;
          chosenIndex = this.childArray.indexOf(child);
        }
      }
    }
   
    //const index = this.childArray.indexOf(weights[Math.floor(Math.random() * weights.length)]);

    

    return this.childArray[chosenIndex];
  }
}