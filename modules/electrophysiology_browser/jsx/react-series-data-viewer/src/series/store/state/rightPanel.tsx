import {createAction} from 'redux-actions';
import {RightPanel} from '../types';

export const SET_RIGHT_PANEL = 'SET_RIGHT_PANEL';
export const setRightPanel = createAction(SET_RIGHT_PANEL);

export type Action = {
  type: 'SET_RIGHT_PANEL',
  payload: RightPanel
};

export type Reducer = (state: RightPanel, action?: Action) => RightPanel;

/**
 * panelReducer
 *
 * @param {RightPanel} state - The current state
 * @param {Action} action - The action
 * @returns {RightPanel} - The updated state
 */
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
