import { Acknowledgement } from '../../';
import { Http } from 'jsx/../jslib/core';

export class AcknowledgementClient extends Http.Client<Acknowledgement.Type> {
  constructor() {
    super('/acknowledgements');
  }
}
