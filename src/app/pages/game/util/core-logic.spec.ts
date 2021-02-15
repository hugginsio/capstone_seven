import { CoreLogic } from './core-logic.util';

describe('CoreLogic', () => {
  //let utility: CoreLogic;

  describe('move to string',()=>{
    it('should convert a move to the proper string format', ()=>{
      const answer = CoreLogic.moveToString({tradedIn:['R','B','B'],received:'G',nodesPlaced:[5,4,3],branchesPlaced:[12,4,16]});

      expect(answer).toEqual('R,B,B,G;5,4,3;12,4,16');
    });
  });

  describe('move to string empty trade',()=>{
    it('should convert a move to the proper string format', ()=>{
      const answer = CoreLogic.moveToString({tradedIn:[],received:'',nodesPlaced:[5,4,3],branchesPlaced:[12,4,16]});

      expect(answer).toEqual(';5,4,3;12,4,16');
    });
  });

  describe('move to string empty nodes',()=>{
    it('should convert a move to the proper string format', ()=>{
      const answer = CoreLogic.moveToString({tradedIn:['R','B','B'],received:'G',nodesPlaced:[],branchesPlaced:[12,4,16]});

      expect(answer).toEqual('R,B,B,G;;12,4,16');
    });
  });

  describe('move to string empty branches',()=>{
    it('should convert a move to the proper string format', ()=>{
      const answer = CoreLogic.moveToString({tradedIn:['R','B','B'],received:'G',nodesPlaced:[5,4,3],branchesPlaced:[]});

      expect(answer).toEqual('R,B,B,G;5,4,3;');
    });
  });

  describe('string to move', ()=>{
    it('should convert a string representation of a move to an object',()=>{
      const answer = CoreLogic.stringToMove('R,B,B,G;5,4,3;12,4,16');
      expect(answer).toEqual({tradedIn:['R','B','B'],received:'G',nodesPlaced:[5,4,3],branchesPlaced:[12,4,16]});
    });
  });

  describe('string to move no trade', ()=>{
    it('should convert a string representation of a move to an object',()=>{
      const answer = CoreLogic.stringToMove(';5,4,3;12,4,16');
      expect(answer).toEqual({tradedIn:[],received:'',nodesPlaced:[5,4,3],branchesPlaced:[12,4,16]});
    });
  });

  describe('string to move no nodes', ()=>{
    it('should convert a string representation of a move to an object',()=>{
      const answer = CoreLogic.stringToMove('R,B,B,G;;12,4,16');
      expect(answer).toEqual({tradedIn:['R','B','B'],received:'G',nodesPlaced:[],branchesPlaced:[12,4,16]});
    });
  });

  describe('string to move no branches', ()=>{
    it('should convert a string representation of a move to an object',()=>{
      const answer = CoreLogic.stringToMove('R,B,B,G;5,4,3;');
      expect(answer).toEqual({tradedIn:['R','B','B'],received:'G',nodesPlaced:[5,4,3],branchesPlaced:[]});
    });
  });

  describe('kStringCombinations for red', ()=>{
    it('should output combinations of k number from an array of strings', ()=>{
      const resources = ['B','G','Y'];
      const result = CoreLogic.kStringCombinations(resources, 3);

      expect(result).toContain(['B','G','Y']);
    });
  });

  describe('kStringCombinations for blue', ()=>{
    it('should output combinations of k number from an array of strings', ()=>{
      const resources = ['R','R','G','Y'];
      const result = CoreLogic.kStringCombinations(resources, 3);

      expect(result).toContain(['R','R','Y']);
      expect(result).toContain(['R','R','G']);
      expect(result).toContain(['R','Y','G']);
    });
  });

  describe('kStringCombinations for green', ()=>{
    it('should output combinations of k number from an array of strings', ()=>{
      const resources = ['R','R','B','Y'];
      const result = CoreLogic.kStringCombinations(resources, 3);

      expect(result).toContain(['R','R','Y']);
      expect(result).toContain(['R','R','B']);
      expect(result).toContain(['R','B','Y']);
    });
  });

  describe('kStringCombinations for yellow', ()=>{
    it('should output combinations of k number from an array of strings', ()=>{
      const resources = ['R','R','B','G'];
      const result = CoreLogic.kStringCombinations(resources, 3);

      expect(result).toContain(['R','R','G']);
      expect(result).toContain(['R','R','B']);
      expect(result).toContain(['R','B','G']);
    });
  });

  describe('kNumberCombinations', ()=>{
    it('should output combinations of k number from an array of strings', ()=>{
      const numbers = [3,14,27];
      const result = CoreLogic.kNumberCombinations(numbers, 2);

      expect(result).toContain([14,27]);
      expect(result).toContain([3,27]);
      expect(result).toContain([3,14]);
    });
  });

});
