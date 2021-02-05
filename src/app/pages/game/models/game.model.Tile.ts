import { TileColor, Owner } from '../interfaces/game.interfaces';


export class Tile {
    color: TileColor;
    
    nodeCount: number;
    maxNodes: number;
  
    isExhausted: boolean;
    
    capturedBy: Owner;
  
    topLeftNode: number;
    topRightNode: number;
    bottomLeftNode: number;
    bottomRightNode: number;
    
    topBranch: number;
    rightBranch: number;
    bottomBranch: number;
    leftBranch : number;


    // having things we will reassign later after randomizing in the constructor??
    constructor(){
        this.color = 5;
        this.nodeCount = 0;
        this.maxNodes = 0;      // how to deal with maxNodes if its just the blank
        this.isExhausted = false;
        this.capturedBy = 1;

        // well i just simply dont know how to deal with the nodes and branches??
    }
  }