import {createAction} from 'redux-actions';

export const SET_CURSOR = 'SET_CURSOR';
export const setCursor = createAction(SET_CURSOR);

export type Action = {
  type: 'SET_CURSOR',
  payload?: number
};

export type State = number;

export type Reducer = (state?: number, action?: Action) => State;

/**
 * cursorReducer
 *
 * @param {State} state - The current state
 * @param {Action} action - The action
 * @returns {State} - The updated state
 */
export const cursorReducer: Reducer = (state = null, action) => {
  if (!action) {
    return state;
  }
  switch (action.type) {
    case SET_CURSOR: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
