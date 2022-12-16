import * as R from 'ramda';
import {createAction} from 'redux-actions';
import {Channel, Chunk} from '../types';

export const SET_CHUNKS = 'SET_CHUNKS';
export const setChunks = createAction(SET_CHUNKS);

export type Action = {
  type: 'SET_CHUNKS',
  payload: {traceIndex: number, chunks: Chunk[]}
};

export type State = Channel;

/**
 * channelReducer
 *
 * @param {State} state - The current state
 * @param {Action} action - The action
 * @returns {State} - The updated state
 */
export const channelReducer = (
  state: Channel = {index: 0, traces: []},
  action?: Action
): State => {
  if (!action) {
    return state;
  }
  switch (action.type) {
    case SET_CHUNKS: {
      return R.assocPath(
        ['traces', action.payload.traceIndex, 'chunks'],
        action.payload.chunks,
        state
      );
    }
    default: {
      return state;
    }
  }
};
