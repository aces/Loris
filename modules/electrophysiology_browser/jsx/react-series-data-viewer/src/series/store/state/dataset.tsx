import * as R from 'ramda';
import {createAction} from 'redux-actions';
import {ChannelMetadata, Epoch} from '../types';
import {DEFAULT_MAX_CHANNELS} from '../../../vector';

export const SET_EPOCHS = 'SET_EPOCHS';
export const setEpochs = createAction(SET_EPOCHS);

export const SET_FILTERED_EPOCHS = 'SET_FILTERED_EPOCHS';
export const setFilteredEpochs = createAction(SET_FILTERED_EPOCHS);

export const SET_ACTIVE_EPOCH = 'SET_ACTIVE_EPOCH';
export const setActiveEpoch = createAction(SET_ACTIVE_EPOCH);

export const SET_PHYSIOFILE_ID = 'SET_PHYSIOFILE_ID';
export const setPhysioFileID = createAction(SET_PHYSIOFILE_ID);

export const SET_DATASET_METADATA = 'SET_DATASET_METADATA';
export const setDatasetMetadata = createAction(SET_DATASET_METADATA);

export type Action =
  | {type: 'SET_EPOCHS', payload: Epoch[]}
  | {type: 'SET_FILTERED_EPOCHS', payload: number[]}
  | {type: 'SET_ACTIVE_EPOCH', payload: number}
  | {type: 'SET_PHYSIOFILE_ID', payload: number}
  | {
      type: 'SET_DATASET_METADATA',
      payload: {
        chunksURL: string,
        channelNames: string[],
        shapes: number[][],
        validSamples: number[],
        timeInterval: [number, number],
        seriesRange: [number, number],
        limit: number,
        offsetIndex: number,
      }
    };

export type State = {
  chunksURL: string,
  channelMetadata: ChannelMetadata[],
  offsetIndex: number,
  limit: number,
  epochs: Epoch[],
  filteredEpochs: number[],
  activeEpoch: number | null,
  physioFileID: number | null,
  shapes: number[][],
  validSamples: number[],
  timeInterval: [number, number],
  seriesRange: [number, number],
};

/**
 * datasetReducer
 *
 * @param {State} state - The current state
 * @param {Action} action - The action
 * @returns {State} - The updated state
 */
export const datasetReducer = (
  state: State = {
    chunksURL: '',
    channelMetadata: [],
    epochs: [],
    filteredEpochs: [],
    activeEpoch: null,
    physioFileID: null,
    offsetIndex: 1,
    limit: DEFAULT_MAX_CHANNELS,
    shapes: [],
    validSamples: [],
    timeInterval: [0, 1],
    seriesRange: [-1, 2],
  },
  action?: Action
): State => {
  if (!action) {
    return state;
  }
  switch (action.type) {
    case SET_EPOCHS: {
      return R.assoc('epochs', action.payload, state);
    }
    case SET_FILTERED_EPOCHS: {
      return R.assoc('filteredEpochs', action.payload, state);
    }
    case SET_ACTIVE_EPOCH: {
      return R.assoc('activeEpoch', action.payload, state);
    }
    case SET_PHYSIOFILE_ID: {
      return R.assoc('physioFileID', action.payload, state);
    }
    case SET_DATASET_METADATA: {
      return R.mergeAll([state, action.payload]);
    }
    default: {
      return state;
    }
  }
};
