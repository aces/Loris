import * as R from 'ramda';
import {createAction} from 'redux-actions';
import {
  ChannelMetadata,
  Epoch,
  EpochFilter,
  HEDSchemaElement,
  HEDTag,
} from '../types';
import {DEFAULT_MAX_CHANNELS} from '../../../vector';

export const SET_EPOCHS = 'SET_EPOCHS';
export const setEpochs = createAction(SET_EPOCHS);

export const SET_FILTERED_EPOCHS = 'SET_FILTERED_EPOCHS';
export const setFilteredEpochs = createAction(SET_FILTERED_EPOCHS);

export const SET_ACTIVE_EPOCH = 'SET_ACTIVE_EPOCH';
export const setActiveEpoch = createAction(SET_ACTIVE_EPOCH);

export const SET_PHYSIOFILE_ID = 'SET_PHYSIOFILE_ID';
export const setPhysioFileID = createAction(SET_PHYSIOFILE_ID);

export const SET_HED_SCHEMA_DOCUMENT = 'SET_HED_SCHEMA_DOCUMENT';
export const setHedSchemaDocument = createAction(SET_HED_SCHEMA_DOCUMENT);

export const SET_DATASET_TAGS = 'SET_DATASET_TAGS';
export const setDatasetTags = createAction(SET_DATASET_TAGS);

export const SET_HED_REL_OVERRIDES = 'SET_HED_REL_OVERRIDES';
export const setRelOverrides = createAction(SET_HED_REL_OVERRIDES);

export const SET_ADDED_TAGS = 'SET_ADDED_TAGS';
export const setAddedTags = createAction(SET_ADDED_TAGS);

export const SET_DELETED_TAGS = 'SET_DELETED_TAGS';
export const setDeletedTags = createAction(SET_DELETED_TAGS);

export const SET_DATASET_METADATA = 'SET_DATASET_METADATA';
export const setDatasetMetadata = createAction(SET_DATASET_METADATA);

export type Action =
  | {type: 'SET_EPOCHS', payload: Epoch[]}
  | {type: 'SET_FILTERED_EPOCHS', payload: number[]}
  | {type: 'SET_ACTIVE_EPOCH', payload: number}
  | {type: 'SET_PHYSIOFILE_ID', payload: number}
  | {type: 'SET_HED_SCHEMA_DOCUMENT', payload: HEDSchemaElement[]}
  | {type: 'SET_DATASET_TAGS', payload: any}
  | {type: 'SET_HED_REL_OVERRIDES', payload: HEDTag[]}
  | {type: 'SET_ADDED_TAGS', payload: HEDTag[]}
  | {type: 'SET_DELETED_TAGS', payload: HEDTag[]}
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
        samplingFrequency: string,
        offsetIndex: number,
      }
    };

export type State = {
  chunksURL: string,
  channelMetadata: ChannelMetadata[],
  offsetIndex: number,
  limit: number,
  samplingFrequency: string,
  epochs: Epoch[],
  filteredEpochs: EpochFilter,
  activeEpoch: number | null,
  physioFileID: number | null,
  shapes: number[][],
  validSamples: number[],
  timeInterval: [number, number],
  seriesRange: [number, number],
  hedSchema: HEDSchemaElement[],
  datasetTags: any,
  hedRelOverrides: HEDTag[],
  addedTags: HEDTag[],
  deletedTags: HEDTag[],
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
    filteredEpochs: {
      plotVisibility: [],
      columnVisibility: [],
    },
    activeEpoch: null,
    physioFileID: null,
    offsetIndex: 1,
    limit: DEFAULT_MAX_CHANNELS,
    samplingFrequency: '',
    shapes: [],
    validSamples: [],
    timeInterval: [0, 1],
    seriesRange: [-1, 2],
    hedSchema: [],
    datasetTags: {},
    hedRelOverrides: [],
    addedTags: [],
    deletedTags: [],
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
    case SET_HED_SCHEMA_DOCUMENT: {
      return R.assoc('hedSchema', action.payload, state);
    }
    case SET_DATASET_TAGS: {
      return R.assoc('datasetTags', action.payload, state);
    }
    case SET_HED_REL_OVERRIDES: {
      return R.assoc('hedRelOverrides', action.payload, state);
    }
    case SET_ADDED_TAGS: {
      return R.assoc('addedTags', action.payload, state);
    }
    case SET_DELETED_TAGS: {
      return R.assoc('deletedTags', action.payload, state);
    }
    case SET_DATASET_METADATA: {
      return R.merge(state, action.payload);
    }
    default: {
      return state;
    }
  }
};
