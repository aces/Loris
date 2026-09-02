import * as R from 'ramda';
import {createAction} from 'redux-actions';

export const SET_CURSOR = 'SET_CURSOR';
export const setCursor = createAction(SET_CURSOR);

export type Action =
  | {type: 'SET_CURSOR', payload?: [number, number]}

export type State = {
  cursorPosition: [number, number] | null,
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
  state = {cursorPosition: null},
  action
) => {
  if (!action) {
    return state;
  }
  switch (action.type) {
  case SET_CURSOR: {
    return R.assoc('cursorPosition', action.payload, state);
  }
  default: {
    return state;
  }
  }
};
