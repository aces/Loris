import 'mocha';
import { expect } from 'chai';
const Evaluator = require('/var/www/LORIS/Loris/jsx/lib/CAPParser/js/Evaluator');
describe('CAPParser Unit Tests', () => {
  describe('When passed an empty string', () => {
    it('Throws an error', () => {
      expect(() => Evaluator('')).to.throw();
    })
  })

  describe('When passed null', () => {
    it('Returns null', () => {
      const LOGIC_STR = 'null';
      const res = Evaluator(LOGIC_STR);
      expect(res).to.equal(null);
    })
  })

  describe('When passed a simple equation', () => {
    it('Evaluates the equation, maintaining order of ops', () => {
      const LOGIC_STR = 'abs((sqrt(64)-12^2)/(min(5,99,104.1232234,3.0001,3))+1/3)'; 
      const res = Evaluator(LOGIC_STR);
      expect(res).to.equal(45);
    })
  })

  describe('when given context', () => {
    it('uses it', () => {
      const LOGIC_STR = '[a]'; 
      const CONTEXT = {a: 100, b: 50, c: 1}; 
      const res = Evaluator(LOGIC_STR, CONTEXT);
      expect(res).to.equal(100);
    })
  })
  
  describe('bool ops', () => {
    it('evals', () => {
      const LOGIC_STR = 'if((5+4)>=[a],5,4)';
      const CONTEXT = {a: 9};
      const res = Evaluator(LOGIC_STR, CONTEXT);
      expect(res).to.equal(5);
    })
  })

  describe('counting ops', () => {
    it('evals', () => {
      const LOGIC_STR = 'stdev(5,[a],1,[b],3)';
      const CONTEXT = {a: 2, b: 4};
      const res = Evaluator(LOGIC_STR, CONTEXT);
      expect(res).to.equal(Math.sqrt(2));
    })
  })
  
  describe('more date ops', () => {
    it('evals', () => {
      const LOGIC_STR = 'datediff(curdatetime(),"00:00:00","h",0)';
      const CONTEXT = {a: 2, b: 4};
      const res = Evaluator(LOGIC_STR, CONTEXT);
      expect(res).to.equal(1);
    })
  });
})
