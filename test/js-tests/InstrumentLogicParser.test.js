import 'mocha';
import { expect } from 'chai';
import InstrumentLogicParser from '../../jsx/lib/InstrumentLogicParser';

describe('InstrumentLogicParser#parse', () => {
  describe('when passed an empty string', () => {
    it('throws an error', () => {
      expect(() => InstrumentLogicParser.parse('')).to.throw();
    })
  })

  describe('when passed a null', () => {
    it('returns null', () => {
      const LOGIC_STR = 'null';
      const res = InstrumentLogicParser.evaluate(LOGIC_STR);
      expect(res).to.equal(null);
    })
  })

  describe('when passed something', () => {
    it('evals', () => {
      const LOGIC_STR = 'constPi'; 
      const res = InstrumentLogicParser.evaluate(LOGIC_STR);
      expect(res).to.equal(Math.PI);
    })
  })

  describe('when given context', () => {
    it('uses it', () => {
      const LOGIC_STR = 'round(2.283534293, [c])'; 
      const CONTEXT = {a: 100, b: 50, c: 1}; 
      const res = InstrumentLogicParser.evaluate(LOGIC_STR, CONTEXT);
      expect(res).to.equal(2.3);
    })
  })
  
  describe('bool ops', () => {
    it('evals', () => {
      const LOGIC_STR = 'if(isNaN("abc"),10+10,4+1)';
      const CONTEXT = {};
      const res = InstrumentLogicParser.evaluate(LOGIC_STR, CONTEXT);
      expect(res).to.equal(20);
    })
  });
})
