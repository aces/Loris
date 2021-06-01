import {createAction} from 'redux-actions';
import {RightPanel} from '../types';

export const SET_RIGHT_PANEL = 'SET_RIGHT_PANEL';
export const setRightPanel = createAction(SET_RIGHT_PANEL);

export type Action = {
  type: "SET_RIGHT_PANEL",
  payload: RightPanel
};

export type Reducer = (state: RightPanel, action?: Action) => RightPanel;

export const panelReducer: Reducer = (state = null, action) => {
  if (!action) {
    return state;
  }
  switch (action.type) {
    case SET_RIGHT_PANEL: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
