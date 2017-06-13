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
      const LOGIC_STR = 'constPi+2'; 
      const res = InstrumentLogicParser.evaluate(LOGIC_STR);
      expect(res).to.equal(Math.PI+2);
    })
  })

  describe('when given context', () => {
    it('uses it', () => {
      const LOGIC_STR = '[a]'; 
      const CONTEXT = {a: 100, b: 50, c: 1}; 
      const res = InstrumentLogicParser.evaluate(LOGIC_STR, CONTEXT);
      expect(res).to.equal(100);
    })
  })
  
  describe('bool ops', () => {
    it('evals', () => {
      const LOGIC_STR = 'if((5+4)=[a],5,4)';
      const CONTEXT = {a: 9};
      const res = InstrumentLogicParser.evaluate(LOGIC_STR, CONTEXT);
      expect(res).to.equal(5);
    })
  })

  describe('counting ops', () => {
    it('evals', () => {
      const LOGIC_STR = 'stdev(5,[a],1,[b],3)';
      const CONTEXT = {a: 2, b: 4};
      const res = InstrumentLogicParser.evaluate(LOGIC_STR, CONTEXT);
      expect(res).to.equal(Math.sqrt(2));
    })
  })
  
 describe('date ops', () => {
    it('evals', () => {
      const LOGIC_STR = 'datediff("2017-01-02","2017","d",0)';
      const CONTEXT = {a: 2, b: 4};
      const res = InstrumentLogicParser.evaluate(LOGIC_STR, CONTEXT);
      expect(res).to.equal(1);
    })
  })
 describe('more date ops', () => {
    it('evals', () => {
      const LOGIC_STR = 'datediff(curdatetime(),curdate(),"h",0)';
      const CONTEXT = {a: 2, b: 4};
      const res = InstrumentLogicParser.evaluate(LOGIC_STR, CONTEXT);
      expect(res).to.equal(1);
    })
  });
})
