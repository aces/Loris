import 'mocha';
import { expect } from 'chai';
import InstrumentLogicParser from '../../jsx/lib/InstrumentLogicParser';

describe('InstrumentLogicParser#parse', () => {
  describe('when passed an empty string', () => {
    it('throws an error', () => {
      expect(() => InstrumentLogicParser.parse('')).to.throw();
    })
  })

  describe('when passed something', () => {
    it('evals', () => {
      const LOGIC_STR = '4+1'; 
      const res = InstrumentLogicParser.evaluate(LOGIC_STR);
      expect(res).to.equal(5);
    })
  })

  describe('when given context', () => {
    it('uses it', () => {
      const LOGIC_STR = 'ROUND(2.283534293, 3)'; 
      const CONTEXT = {a: 100, b: 50, c: 1}; 
      const res = InstrumentLogicParser.evaluate(LOGIC_STR, CONTEXT);
      expect(res).to.equal(2.284);
    })
  })
  
  describe('bool ops', () => {
    it('evals', () => {
      const LOGIC_STR = 'LEQ(SQRT(49),ROUND(4+1.384729392834, 5))';
      const CONTEXT = {};
      const res = InstrumentLogicParser.evaluate(LOGIC_STR, CONTEXT);
      expect(res).to.equal(false);
    })
  });
})
