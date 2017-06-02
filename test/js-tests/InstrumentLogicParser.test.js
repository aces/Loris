import 'mocha';
import { expect } from 'chai';
import InstrumentLogicParser from '../../jsx/lib/InstrumentLogicParser';

describe('InstrumentLogicParser#parse', () => {
  describe('when passed an empty string', () => {
    it('throws an error', () => {
      expect(() => InstrumentLogicParser.parse('')).to.throw();
    })
  })
})

