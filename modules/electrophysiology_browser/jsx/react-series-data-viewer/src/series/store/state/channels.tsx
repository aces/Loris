import * as R from 'ramda';
import {createAction} from 'redux-actions';
import {Channel, Trace, Chunk} from '../types';

export const SET_CHUNKS = 'SET_CHUNKS';
export const setChunks = createAction(SET_CHUNKS);

export const SET_CHANNELS = 'SET_CHANNELS';
export const setChannels = createAction(SET_CHANNELS);

export type Action =
| {
  type: 'SET_CHUNKS',
  payload: {
    channelIndex: number,
    traceIndex: number,
    chunks: Chunk[]}
  }
| {type: 'SET_CHANNELS', payload: Channel[]}

/**
 * channelsReducer
 *
 * @param state - The current state
 * @param action - The action
 * @returns - The updated state
 */
export const channelsReducer = (
  state: Channel[] = [],
  action?: Action
) => {
  if (!action) {
    return state;
  }
  switch (action.type) {
  case SET_CHUNKS: {
    const i = state.findIndex(
      (c) => c.index === action.payload.channelIndex
    );

    if (i >= 0) {
      return R.assocPath(
        [i, 'traces', action.payload.traceIndex, 'chunks'],
        action.payload.chunks,
        state
      );
    }
    break;
  }
  case SET_CHANNELS: {
    return action.payload;
  }
  default: {
    return state;
  }
  }
};

/**
 * emptyChannels
 *
 * @param channelsCount - The channels count
 * @param tracesCount - The traces count
 * @returns - A Fn that returns channelsCount empty channels
 */
export const emptyChannels = (channelsCount: number, tracesCount: number) => {
  /**
   * makeTrace
   *
   * @returns - An empty trace
   */
  const makeTrace = () => ({chunks: [], type: 'line'});

  /**
   * makeChannel
   *
   * @param index - The channel index
   * @returns - An empty channel
   */
  const makeChannel = (index) => ({
    index,
    traces: R.range(0, tracesCount).map(makeTrace),
  });

  return R.range(0, channelsCount).map(makeChannel);
};
