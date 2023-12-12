import * as R from 'ramda';
import {createAction} from 'redux-actions';

export const SET_CURSOR = 'SET_CURSOR';
export const setCursor = createAction(SET_CURSOR);

export const SET_HOVERED_CHANNELS = 'SET_HOVERED_CHANNELS';
export const setHoveredChannels = createAction(SET_HOVERED_CHANNELS);

export type Action =
  | {type: 'SET_CURSOR', payload?: [number, number]}
  | {type: 'SET_HOVERED_CHANNELS', payload?: number[]}


export type State = {
  cursorPosition: [number, number] | null,
  hoveredChannels: number[],
};

export type Reducer = (state?: State, action?: Action) => State;

/**
 * cursorReducer
 *
 * @param {State} state - The current state
 * @param {Action} action - The action
 * @returns {State} - The updated state
 */
export const cursorReducer: Reducer = (
  state = {cursorPosition: null, hoveredChannels: []},
  action
) => {
  if (!action) {
    return state;
  }
  switch (action.type) {
    case SET_CURSOR: {
      return R.assoc('cursorPosition', action.payload, state);
    }
    case SET_HOVERED_CHANNELS: {
      return R.assoc('hoveredChannels', action.payload, state);
    }
    default: {
      return state;
    }
  }
};
