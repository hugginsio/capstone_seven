import { Owner } from '../interfaces/game.interfaces';


export class Node {
    ownedBy: Owner;
    
    redProvided: number;
    blueProvided: number;
    greenProvided: number;
    yellowProvided: number;
  
    topBranch: number;
    rightBranch: number;
    bottomBranch: number;
    leftBranch: number;
  
    topLeftTile: number;
    topRightTile: number;
    bottomLeftTile: number;
    bottomRightTile: number;

    constructor() {
        this.ownedBy = 1;

        this.redProvided = 0;
        this.blueProvided = 0;
        this.greenProvided = 0;
        this.yellowProvided = 0;
        
    }
  }