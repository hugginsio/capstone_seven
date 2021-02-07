import { Owner } from '../../enums/game.enums';

export class Branch {
    private ownedBy: Owner;

    private branch1: number;
    private branch2: number;
    private branch3: number;
    private branch4: number;
    private branch5: number;
    private branch6: number;
    
    // NOTE: branches counted in clockwise fashion beginning at top

    constructor(b1: number = -1, b2: number = -1, b3: number = -1, b4: number = -1, b5: number = -1, b6: number = -1) {
        this.ownedBy = Owner.NONE;

        this.branch1 = b1;
        this.branch2 = b2;
        this.branch3 = b3;
        this.branch4 = b4;
        this.branch5 = b5;
        this.branch6 = b6;

    }

    getOwner(): Owner {
        return this.ownedBy;
    }
    setOwner(newOwner: Owner): void {
        this.ownedBy = newOwner;
    }

    getBranch(b: number ): number {
        return this[`branch${b}`];
    }

    setBranch(b: number, newB: number): void {
        this[`branch${b}`] = newB;
    }
}