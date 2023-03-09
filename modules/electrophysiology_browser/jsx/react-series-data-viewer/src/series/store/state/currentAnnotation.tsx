import {createAction} from 'redux-actions';
import {Epoch} from '../types';

export const SET_CURRENT_ANNOTATION = 'SET_CURRENT_ANNOTATION';
export const setCurrentAnnotation = createAction(SET_CURRENT_ANNOTATION);

export type Action = {
  type: 'SET_CURRENT_ANNOTATION',
  payload: Epoch
};

export type Reducer = (state: Epoch, action?: Action) => Epoch;

/**
 * currentAnnotationReducer
 *
 * @param {object} state - The current state
 * @param {Action} action - The action
 * @returns {object} - The updated state
 */
export const currentAnnotationReducer: Reducer = (state = null, action) => {
  if (!action) {
    return state;
  }
  switch (action.type) {
    case SET_CURRENT_ANNOTATION: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
