import { TileColor, Owner } from '../interfaces/game.interfaces';

// what all needs to be private and such for this and all the other classes too 
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
        this.color = TileColor.BLANK;
        this.nodeCount = 0;
        this.maxNodes = 0;      // how to deal with maxNodes if its just the blank... do i set this in the constuctor in general?
        this.isExhausted = false;
        this.capturedBy = Owner.NONE;

        // well i just simply dont know how to deal with the nodes and branches??
    }

    getColor(){
        return this.color;
    }

    getNodeCount(){
        return this.nodeCount;
    }
    setNodeCount(count: number){
        this.nodeCount = count;
    }

    getMaxNodes(){
        return this.maxNodes;
    }

    getIsExhaused(){
        return this.isExhausted;
    }
    setIsExhaused(value: boolean){
        this.isExhausted = value;
    }

    getCapturedBy(){
        return this.capturedBy;
    }
    setCapturedBy(newCap: Owner){
        this.capturedBy = newCap;
    }
  }