import {createAction} from 'redux-actions';

export const SET_TIME_SELECTION = 'SET_TIME_SELECTION';
export const setTimeSelection = createAction(SET_TIME_SELECTION);

export type Action = {
  type: "SET_TIME_SELECTION",
  payload?: [number, number]
};

export type State = [number, number];

export type Reducer = (state?: [number, number], action?: Action) => State;

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
