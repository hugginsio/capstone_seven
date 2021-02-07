import { Owner } from '../enums/game.enums';


export class Node {
    private ownedBy: Owner;
    
    private redProvided: number;
    private blueProvided: number;
    private greenProvided: number;
    private yellowProvided: number;
  
    private topBranch: number;
    private rightBranch: number;
    private bottomBranch: number;
    private leftBranch: number;
  
    private topLeftTile: number;
    private topRightTile: number;
    private bottomLeftTile: number;
    private bottomRightTile: number;

    constructor(tb: number = -1, rb: number = -1,
                bb: number = -1, lb: number = -1,
                tlt: number = -1, trt: number = -1,
                blt: number = -1, brt: number = -1) {
        this.ownedBy = Owner.NONE;

        this.redProvided = 0;
        this.blueProvided = 0;
        this.greenProvided = 0;
        this.yellowProvided = 0;
        
        this.topBranch = tb;
        this.rightBranch = rb;
        this.bottomBranch = bb;
        this.leftBranch = lb;

        this.topLeftTile = tlt;
        this.topRightTile = trt;
        this.bottomLeftTile = blt;
        this.bottomRightTile = brt;
    }

    getOwner(): Owner {
        return this.ownedBy;
    }

    setOwner(newOwner: Owner): void {
        this.ownedBy = newOwner;
    }

    getRedProvided(): number {
        return this.redProvided;
    }

    getBlueProvided(): number {
        return this.blueProvided;
    }

    getGreenProvided(): number {
        return this.greenProvided;
    }

    getYellowProvided(): number {
        return this.yellowProvided;
    }

    setRedProvided(num: number): void {
        this.redProvided = num;
    }

    setBlueProvided(num: number): void {
        this.blueProvided = num;
    }

    setGreenProvided(num: number): void {
        this.greenProvided = num;
    }

    setYellowProvided(num: number): void {
        this.yellowProvided = num;
    }

    getTopBranch(): number {
        return this.topBranch;
    }
    setTopBranch(num: number): void {
        this.topBranch = num;
    }

    getRightBranch(): number {
        return this.rightBranch;
    }
    setRightBranch(num: number): void {
        this.rightBranch = num;
    }

    getBottomBranch(): number {
        return this.bottomBranch;
    }
    setBottomBranch(num: number): void {
        this.bottomBranch = num;
    }

    getLeftBranch(): number {
        return this.leftBranch;
    }
    setLeftBranch(num: number): void {
        this.leftBranch = num;
    }

    setTopLeftTile(num: number): void {
        this.topLeftTile = num;
    }
    
    setTopRightTile(num: number): void {
        this.topRightTile = num;
    }
    
    setBottomLeftTile(num: number): void {
        this.bottomLeftTile = num;
    }
    setBottomRightTile(num: number): void {
        this.bottomRightTile = num;
    }
}