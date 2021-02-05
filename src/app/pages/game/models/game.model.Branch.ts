import { Owner } from '../interfaces/game.interfaces';

export class Branch {
    ownedBy: Owner;
  

    // should this just be an array??
    branch1: number;
    branch2: number;
    branch3: number;
    branch4: number;
    branch5: number;
    branch6: number;
    
    // NOTE: branches counted in clockwise fashion beginning at top

    constructor() {
        this.ownedBy = 1;
    }
  }