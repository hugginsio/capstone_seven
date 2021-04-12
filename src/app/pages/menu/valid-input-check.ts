import { LocalStorageService } from './../../shared/services/local-storage/local-storage.service';

export class ValidInputCheck {

  validSortedBoard: string[];
  validBoard: boolean;

  constructor(
    private readonly storageService: LocalStorageService
  ) {
    this.validSortedBoard = ["00", "B1", "B2", "B3", "G1", "G2", "G3", "R1", "R2", "R3", "Y1", "Y2", "Y3"];
    this.validBoard = true;
  }

  checkBoardSeed(boardSeed: string):string {   
    const invalidBoard = "0";
    // https://stackoverflow.com/questions/49145250/how-to-remove-whitespace-from-a-string-in-typescript
    const boardString = boardSeed.replace(/\s/g, "");
    let boardArray = boardString.split(",");
    boardArray = boardArray.sort();

    if (boardArray.length !== 13) {
      this.validBoard = false;
      return invalidBoard;
    }
    for(let i = 0; i < 13; i++) {
      if (boardArray[i] !== this.validSortedBoard[i]){
        this.validBoard = false;
        return invalidBoard;
      }
    }
    this.validBoard = true;
    return boardString;
  }
}  