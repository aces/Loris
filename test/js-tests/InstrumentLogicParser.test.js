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
      const LOGIC_STR = '5*SQRT(36)'; 
      const res = InstrumentLogicParser.evaluate(LOGIC_STR);
      expect(res).to.equal(30);
    })
  })

  describe('when given context', () => {
    it('uses it', () => {
      const LOGIC_STR = '5*[a]'; 
      const CONTEXT = {a: 2}; 
      const res = InstrumentLogicParser.evaluate(LOGIC_STR, CONTEXT);
      expect(res).to.equal(10);
    })
  });
})

