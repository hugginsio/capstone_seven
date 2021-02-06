import { Owner } from '../interfaces/game.interfaces';

export class Branch {
    ownedBy: Owner;

    // should this just be an array??
    /*branch1: number;
    branch2: number;
    branch3: number;
    branch4: number;
    branch5: number;
    branch6: number;*/

    Branches: number[];
    
    // NOTE: branches counted in clockwise fashion beginning at top

    constructor() {
        this.ownedBy = Owner.NONE;

        this.Branches = new Array<number>(6);
        //where to establish branch references??

    }

    getOwner(){
        return this.ownedBy;
    }
    setOwner(newOwner: Owner){
        this.ownedBy = newOwner;
    }

    getBranches(){
        return this.Branches;
    }
  }