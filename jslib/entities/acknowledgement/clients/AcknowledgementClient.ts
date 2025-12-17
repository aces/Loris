import {Acknowledgement} from '../../';
import {Http} from 'jslib/core';

/**
 *
 */
export class AcknowledgementClient extends Http.Client<Acknowledgement.Type> {
  /**
   *
   */
  constructor() {
    super('/acknowledgements');
  }
}
