import {createAction} from 'redux-actions';

export const SET_TIME_SELECTION = 'SET_TIME_SELECTION';
export const setTimeSelection = createAction(SET_TIME_SELECTION);

export type Action = {
  type: 'SET_TIME_SELECTION',
  payload?: [number, number] | null
};

export type State = [number, number] | null | undefined;

export type Reducer = (state?: State, action?: Action) => State;

/**
 * timeSelectionReducer
 *
 * @param {State} state - The current state
 * @param {Action} action - The action
 * @returns {State} - The updated state
 */
export const timeSelectionReducer: Reducer = (state = null, action) => {
  if (!action) {
    return state;
  }

  switch (action.type) {
    case SET_TIME_SELECTION: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
