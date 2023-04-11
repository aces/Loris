/*
* Author    Jonathan Lurie - http://me.jonathanlurie.fr
* License   MIT
* Link      https://github.com/jonathanlurie/differenceequationsignal1d
* Lab       MCIN - http://mcin.ca/ - Montreal Neurological Institute
*/


class DifferenceEquationSignal1D {
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
  setInput(signal) {
    this._outputSignal = null;
    this._inputSignal = signal;
  }


  /**
   * Set the array of 'a' coefficients. Must be padded by an additional "1.0" because
   * this set of coefficient will be addressed at it index "1" (and not "0")
   *
   * @param {Float32Array|Array} a - the 'a' coeficients
   */
  setACoefficients(a) {
    this._aCoefficients = a;
  }


  /**
   * Set the array of 'b' coefficients
   *
   * @param {Float32Array|Array} b - the 'b' coeficients
   */
  setBCoefficients(b) {
    this._bCoefficients = b;
  }


  /**
   * Get the output signal
   *
   * @return {Float32Array} the filtered signal
   */
  getOutput() {
    return this._outputSignal;
  }


  /**
   * Will process the signal backwards as a second pass, using the same coeficients.
   * This is to make sure the output remain in phase with the input
   */
  enableBackwardSecondPass() {
    this._enableBackwardSecondPass = true;
  }


  /**
   * Will not process the signal backwards as a second pass.
   * Depending on the coefficients, the output may not be in phase with the input.
   */
  disableBackwardSecondPass() {
    this._enableBackwardSecondPass = false;
  }


  /**
   * Launch the filtering. In the end, get the output using the method `.getOutput()`
   */
  run() {
    let out = new Float32Array(this._inputSignal.length).fill(0);

    // some shortcuts
    let x = this._inputSignal;
    let y = out;
    let b = this._bCoefficients;
    let a = this._aCoefficients;
    let M = b.length - 1;
    let N = a.length - 1;

    /**
     *
     * @param {number} n
     */
    function getOutputAt(n) {
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

      let valueAtN = xSum - ySum;
      return valueAtN;
    }

    for (let i=0; i<out.length; i++) {
      out[i] = getOutputAt(i);
    }

    if (this._enableBackwardSecondPass) {
      out.reverse();
      x = out;
      out = new Float32Array(this._inputSignal.length).fill(0);
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
