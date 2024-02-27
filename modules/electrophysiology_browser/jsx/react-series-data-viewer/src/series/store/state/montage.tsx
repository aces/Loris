import * as R from 'ramda';
import {createAction} from 'redux-actions';
import {CoordinateSystem, Electrode} from '../types';

export const SET_ELECTRODES = 'SET_ELECTRODES';
export const setElectrodes = createAction(SET_ELECTRODES);

export const SET_HIDDEN = 'SET_HIDDEN';
export const setHidden = createAction(SET_HIDDEN);

export const SET_COORDINATE_SYSTEM = 'SET_COORDINATE_SYSTEM';
export const setCoordinateSystem = createAction(SET_COORDINATE_SYSTEM);

export type Action =
  | {type: 'SET_ELECTRODES', payload: Electrode[]}
  | {type: 'SET_HIDDEN', payload: number[]}
  | {type: 'SET_COORDINATE_SYSTEM', payload: CoordinateSystem};

export type State = {
  electrodes: Electrode[],
  hidden: number[],
  coordinateSystem: CoordinateSystem,
};

export type Reducer = (state: State, action?: Action) => State;

/**
 * montageReducer
 *
 * @param {State} state - The current state
 * @param {Action} action - The action
 * @returns {State} - The updated state
 */
export const montageReducer: Reducer = (
  state = {electrodes: [], hidden: [], coordinateSystem: null},
  action
) => {
  if (!action) {
    return state;
  }
  switch (action.type) {
    case SET_ELECTRODES: {
      return R.assoc('electrodes', action.payload, state);
    }
    case SET_HIDDEN: {
      return R.assoc('hidden', action.payload, state);
    }
    case SET_COORDINATE_SYSTEM: {
      return R.assoc('coordinateSystem', action.payload, state);
    }
    default: {
      return state;
    }
  }
};
