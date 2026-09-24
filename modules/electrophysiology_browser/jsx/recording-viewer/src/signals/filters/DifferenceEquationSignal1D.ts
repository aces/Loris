/*
* Author    Jonathan Lurie - http://me.jonathanlurie.fr
* License   MIT
* Link      https://github.com/jonathanlurie/differenceequationsignal1d
* Lab       MCIN - http://mcin.ca/ - Montreal Neurological Institute
*/

/* eslint-disable jsdoc/require-jsdoc */


class DifferenceEquationSignal1D {
  private _inputSignal: Float32Array | null;
  private _outputSignal: Float32Array | null;
  private _aCoefficients: ArrayLike<number> | null;
  private _bCoefficients: ArrayLike<number> | null;
  private _enableBackwardSecondPass: boolean;

  constructor() {
    this._inputSignal = null;
    this._outputSignal = null;
    this._aCoefficients = null;
    this._bCoefficients = null;
    this._enableBackwardSecondPass = false;
  }


  /**
   * Set the input signal. Will also reset the output to null.
   *
   * @param {Float32Array} signal - the signal
   */
  setInput(signal: Float32Array): void {
    this._outputSignal = null;
    this._inputSignal = signal;
  }


  /**
   * Set the array of 'a' coefficients. Must be padded by an additional "1.0" because
   * this set of coefficient will be addressed at it index "1" (and not "0")
   *
   * @param {Float32Array|Array} a - the 'a' coeficients
   */
  setACoefficients(a: ArrayLike<number>): void {
    this._aCoefficients = a;
  }


  /**
   * Set the array of 'b' coefficients
   *
   * @param {Float32Array|Array} b - the 'b' coeficients
   */
  setBCoefficients(b: ArrayLike<number>): void {
    this._bCoefficients = b;
  }


  /**
   * Get the output signal
   *
   * @return {Float32Array} the filtered signal
   */
  getOutput(): Float32Array {
    if (!this._outputSignal) {
      throw new Error('The filter must be run before reading its output');
    }
    return this._outputSignal;
  }


  /**
   * Will process the signal backwards as a second pass, using the same coeficients.
   * This is to make sure the output remain in phase with the input
   */
  enableBackwardSecondPass(): void {
    this._enableBackwardSecondPass = true;
  }


  /**
   * Will not process the signal backwards as a second pass.
   * Depending on the coefficients, the output may not be in phase with the input.
   */
  disableBackwardSecondPass(): void {
    this._enableBackwardSecondPass = false;
  }


  /**
   * Launch the filtering. In the end, get the output using the method `.getOutput()`
   */
  run(): void {
    const inputSignal = this._inputSignal;
    const aCoefficients = this._aCoefficients;
    const bCoefficients = this._bCoefficients;
    if (!inputSignal || !aCoefficients || !bCoefficients) {
      throw new Error(
        'Input signal and filter coefficients must be set before run()'
      );
    }

    let out = new Float32Array(inputSignal.length).fill(0);

    // some shortcuts
    let x = inputSignal;
    let y = out;
    const b = bCoefficients;
    const a = aCoefficients;
    const M = b.length - 1;
    const N = a.length - 1;

    /**
     *
     * @param {number} n - Output sample index.
     */
    function getOutputAt(n: number): number {
      // sum of the x
      let xSum = 0;
      for (let i=0; i<=M; i++) {
        const safeSignaValue = (i>n)? 0 : x[n-i];
        xSum += b[i] * safeSignaValue;
      }

      // sum of the y
      let ySum = 0;
      for (let j=1; j<=N; j++) {
        const safeSignaValue = (j>n)? 0 : y[n-j];
        ySum += a[j] * safeSignaValue;
      }

      return xSum - ySum;
    }

    for (let i=0; i<out.length; i++) {
      out[i] = getOutputAt(i);
    }

    if (this._enableBackwardSecondPass) {
      out.reverse();
      x = out;
      out = new Float32Array(inputSignal.length).fill(0);
      y = out;

      for (let i=0; i<out.length; i++) {
        out[i] = getOutputAt(i);
      }
      out.reverse();
    }

    this._outputSignal = out;
  }
} /* END of class DifferenceEquationSignal1D */

export {DifferenceEquationSignal1D};
