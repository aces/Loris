import 'mocha';
import { expect } from 'chai';
import { Evaluator, UndefinedVariableError, NullVariableError } from '../../jsx/lib/Parser';
describe('Parser Unit Tests', () => {
  describe('When passed an empty string', () => {
    it('Returns an empty string', () => {
      expect(Evaluator('')).to.equal('');
    })
  })

  describe('When the expression contains a variable not defined in the scope', () => {
    it('Throws an UndefinedVariableError', () => {
      expect(() => Evaluator('[a] + 2', { b: 2 })).to.throw(UndefinedVariableError);
    })
  })

  describe('When the expression contains a variable set to null', () => {
    it('Throws an NullVariableError', () => {
      expect(() => Evaluator('[a] + 2', { a: null })).to.throw(NullVariableError);
    })
  })

  describe('When passed null', () => {
    it('Returns null', () => {
      const LOGIC_STR = 'null';
      const res = Evaluator(LOGIC_STR);
      expect(res).to.equal(null);
    })
  })

  describe('Simple equation', () => {
    it('Maintains order of operations', () => {
      const LOGIC_STR = 'abs((sqrt(64)-12^(4^(1/2)))/(min(5,99,104.1232234,3.0001,3))+1/3)'; 
      const res = Evaluator(LOGIC_STR);
      expect(res).to.equal(45);
    })
	
	it('Maintains order of operations', () => {
      const LOGIC_STR = '10+(-5)';
      const res = Evaluator(LOGIC_STR);
      expect(res).to.equal(5);
    })
    
	it('Maintains order of operations', () => {
      const LOGIC_STR = '(median(1,2,6,3,4,5)=3.5) and (median(1,2,3,4,5)=3)';
      const res = Evaluator(LOGIC_STR);
      expect(res).to.equal(true);
    })
  })

  describe('Simple if statement', () => {
    it('Returns true string', () => {
      const LOGIC_STR = 'if(true, 2 + " string test", 0)';
      const res = Evaluator(LOGIC_STR);
      expect(res).to.equal("2 string test");
    })
  })

  describe('Complex equation containing nested ifs, boolean operations, counting operations, and string concatenation', () => {
    it('Maintains order of operatopms and context', () => {
      const LOGIC_STR = 'max(if([d]="North America",if([e]<>"Montreal",1,0.5),0),if(([a]+1)/[c]>(product(100,1/2,1/2,1/2,1/2,1/(12.5))),2,0)) + ", " + [e] + ", " + [d]'; 
      const CONTEXT = {a: 100, b: 50, c: 1, d: "North America", e: "Montreal"}; 
      const res = Evaluator(LOGIC_STR, CONTEXT);
      expect(res).to.equal("2, Montreal, North America");
    })
  })
  
  describe('Complex boolean operation', () => {
    it('Maintains boolean logic', () => {
      const LOGIC_STR = 'if((5+4)>=[a] and not ((4>10) or [d]),5,4)';
      const CONTEXT = {a: 9, d: false};
      const res = Evaluator(LOGIC_STR, CONTEXT);
      expect(res).to.equal(5);
    })
  })

  describe('Rounding operations', () => {
    it('Correctly rounds up or down', () => {
      const LOGIC_STR = 'if(rounddown([a],[b])<>roundup([a],[b]) and (round([a],[b])<>roundup([a],[b]) or round([a],[b])<>rounddown([a],[b])),round([a],[b]),"Rounding failure")';
      const CONTEXT = {a: 2.43298570129128437893429384, b: 4};
      const res = Evaluator(LOGIC_STR, CONTEXT);
      expect(res).to.equal(2.4330);
    })

    it('Handles trailing zeros correctly', () => {
      const LOGIC_STR = 'round([a],[b])';
      const CONTEXT = {a: 2, b: 4};
      const res = Evaluator(LOGIC_STR, CONTEXT);
      expect(res).to.equal(2.0000);
    })
  })
  
  describe('Date difference operations', () => {
    it('Returns date diff in y', () => {
      const LOGIC_STR = 'datediff("2017-01-01","2018-07-01","y")';
      const CONTEXT = {a: 2, b: 4};
      const res = Evaluator(LOGIC_STR, CONTEXT);
      expect(res).to.be.closeTo(1.5, 0.01);
    })
  })

  describe('Nested Variables', () => {
    it('Accesses correct context (2 levels)', () => {
      const LOGIC_STR = '[t1_arm_1][age_mnths]';
      const CONTEXT = {t1_arm_1: {age_mnths: 45, visits: {v1: 'v1',v2: 'v2',v3: {site: 'Montreal', active: 'Y'}}}};
      const res = Evaluator(LOGIC_STR, CONTEXT);
      expect(res).to.equal(45);
    })

    it('Accesses correct context (3 levels)', () => {
      const LOGIC_STR = '[t1_arm_1][visits][v2]';
      const CONTEXT = {t1_arm_1: {age_mnths: 45, visits: {v1: 'v1',v2: 'v2',v3: {site: 'Montreal', active: 'Y'}}}};
      const res = Evaluator(LOGIC_STR, CONTEXT);
      expect(res).to.equal('v2');
    })

    it('Accesses correct context (4 levels)', () => {
      const LOGIC_STR = '[t1_arm_1][visits][v3][site]';
      const CONTEXT = {t1_arm_1: {age_mnths: 45, visits: {v1: 'v1',v2: 'v2',v3: {site: 'Montreal', active: 'Y'}}}};
      const res = Evaluator(LOGIC_STR, CONTEXT);
      expect(res).to.equal('Montreal');
    })
    it('Accesses correct context (multi-level, array access)', () => {
      const LOGIC_STR = '[t1_arm_1][visits(v3)][site]';
      const CONTEXT = {t1_arm_1: {age_mnths: 45, visits: {v1: 'v1',v2: 'v2',v3: {site: 'Montreal', active: 'Y'}}}};
      const res = Evaluator(LOGIC_STR, CONTEXT);
      expect(res).to.equal('Montreal');
    })

  });
})
