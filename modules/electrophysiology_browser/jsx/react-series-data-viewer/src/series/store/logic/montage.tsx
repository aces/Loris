import {tsvParse} from 'd3-dsv';

import {Sensor} from '../types';

/**
 * Parse an `electrodes.tsv` text response to a list of electrophysiology viewer
 * sensors.
 */
export function parseElectrodes(text: string): Sensor[] {
  return tsvParse(text).map(({name, x, y, z}, i) => ({
    type: 'electrode',
    name: name,
    channelIndex: i,
    position: [parseFloat(x), parseFloat(y), parseFloat(z)],
  }));
}

/**
 * Parse a LORIS electrophysiogy API MEG sensors JSON response to a list of
 * electrophysiology viewer sensors.
 */
export function parseMegSensors(json: any): Sensor[] {
  return Object.entries(json['sensors'])
    .filter(([_, point]: [string, any]) =>
      !(isNaN(point.x) || isNaN(point.y) || isNaN(point.z))
    )
    .map(([name, point]: [string, any], i) => ({
      type: 'meg-sensor',
      name: name,
      channelIndex: i,
      position: [point.x, point.y, point.z],
    }));
}

/**
 * Parse a LORIS electrophysiogy API head shape points JSON response to a list
 * of electrophysiology viewer sensors.
 */
export function parseHeadShapePoints(json: any): Sensor[] {
  return Object.entries(json['points'])
    .map(([name, point]: [string, any]) => ({
      type: 'head-shape-point',
      name: name,
      channelIndex: undefined,
      position: [point.x, point.y, point.z],
    }));
}
