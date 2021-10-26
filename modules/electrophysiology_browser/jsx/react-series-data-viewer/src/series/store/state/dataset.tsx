import * as R from 'ramda';
import {createAction} from 'redux-actions';
import {Channel, ChannelMetadata, Epoch} from '../types';
import {Action as ChannelAction} from './channel';
import {channelReducer} from './channel';
import {MAX_CHANNELS} from '../../../vector';

export const SET_CHANNELS = 'SET_CHANNELS';
export const setChannels = createAction(SET_CHANNELS);

export const SET_ACTIVE_CHANNEL = 'SET_ACTIVE_CHANNEL';
export const setActiveChannel = createAction(SET_ACTIVE_CHANNEL);

export const SET_EPOCHS = 'SET_EPOCHS';
export const setEpochs = createAction(SET_EPOCHS);

export const SET_FILTERED_EPOCHS = 'SET_FILTERED_EPOCHS';
export const setFilteredEpochs = createAction(SET_FILTERED_EPOCHS);

export const SET_ACTIVE_EPOCH = 'SET_ACTIVE_EPOCH';
export const setActiveEpoch = createAction(SET_ACTIVE_EPOCH);

export const SET_DATASET_METADATA = 'SET_DATASET_METADATA';
export const setDatasetMetadata = createAction(SET_DATASET_METADATA);

export type Action =
  | {type: 'SET_CHANNELS', payload: Channel[]}
  | {type: 'SET_ACTIVE_CHANNEL', payload: number}
  | {type: 'SET_EPOCHS', payload: Epoch[]}
  | {type: 'SET_FILTERED_EPOCHS', payload: number[]}
  | {type: 'SET_ACTIVE_EPOCH', payload: number}
  | {
      type: 'SET_DATASET_METADATA',
      payload: {
        chunksURL: string,
        channelNames: string[],
        shapes: number[][],
        timeInterval: [number, number],
        seriesRange: [number, number],
        limit: number
      }
    }
  | ChannelAction;

export type State = {
  chunksURL: string,
  channelMetadata: ChannelMetadata[],
  channels: Channel[],
  activeChannel: number | null,
  offsetIndex: number,
  limit: number,
  epochs: Epoch[],
  filteredEpochs: number[],
  activeEpoch: number | null,
  shapes: number[][],
  timeInterval: [number, number],
  seriesRange: [number, number],
};

export const datasetReducer = (
  state: State = {
    chunksURL: '',
    channelMetadata: [],
    channels: [],
    activeChannel: null,
    epochs: [],
    filteredEpochs: [],
    activeEpoch: null,
    offsetIndex: 1,
    limit: MAX_CHANNELS,
    shapes: [],
    timeInterval: [0, 1],
    seriesRange: [-1, 2],
  },
  action?: Action
): State => {
  if (!action) {
    return state;
  }
  switch (action.type) {
    case SET_CHANNELS: {
      return R.assoc('channels', action.payload, state);
    }
    case SET_ACTIVE_CHANNEL: {
      return R.assoc('activeChannel', action.payload, state);
    }
    case SET_EPOCHS: {
      return R.assoc('epochs', action.payload, state);
    }
    case SET_FILTERED_EPOCHS: {
      return R.assoc('filteredEpochs', action.payload, state);
    }
    case SET_ACTIVE_EPOCH: {
      return R.assoc('activeEpoch', action.payload, state);
    }
    case SET_DATASET_METADATA: {
      return R.merge(state, action.payload);
    }
    default: {
      const activeIndex = state.channels.findIndex(
        (c) => c.index === state.activeChannel
      );
      if (activeIndex < 0) {
        return state;
      }
      return R.assocPath(
        ['channels', activeIndex],
        channelReducer(state.channels[activeIndex], action),
        state
      );
    }
  }
};

export const emptyChannels = (channelsCount: number, tracesCount: number) => {
  const makeTrace = () => ({chunks: [], type: 'line'});
  const makeChannel = (index) => ({
    index,
    traces: R.range(0, tracesCount).map(makeTrace),
  });

  return R.range(0, channelsCount).map(makeChannel);
};
