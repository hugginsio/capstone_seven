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
        this.ownedBy = Owner.NONE;

        this.redProvided = 0;
        this.blueProvided = 0;
        this.greenProvided = 0;
        this.yellowProvided = 0;
        
        // do we set the branches and tiles here for weach node space? since this doesnt change 
    }

    getOwner(){
        return this.ownedBy;
    }
    setOwner(newOwner: Owner){
        this.ownedBy = newOwner;
    }

    getRedProvided(){
        return this.redProvided;
    }
    getBlueProvided(){
        return this.blueProvided;
    }
    getGreenProvided(){
        return this.greenProvided;
    }
    getYellowProvided(){
        return this.yellowProvided;
    }

    setRedProvided(num: number){
        this.redProvided = num;
    }
    setBlueProvided(num: number){
        this.blueProvided = num;
    }
    setGreenProvided(num: number){
        this.greenProvided = num;
    }
    setYellowProvided(num: number){
        this.yellowProvided = num;
    }
  }