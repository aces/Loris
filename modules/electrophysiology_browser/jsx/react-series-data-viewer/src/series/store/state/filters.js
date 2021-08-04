// @flow

import * as R from 'ramda';
import {createAction} from 'redux-actions';

export const SET_FILTER = 'SET_FILTER';
export const setFilter = createAction(SET_FILTER);

export type Action = {
  type: 'SET_FILTER',
  payload: {
    key: string,
    name: string,
    fn: (number[]) => number[],
  }
};

export const filtersReducer = (
  state: {[key: string]: {
    name: string,
    fn: (number[]) => number[]
  }} = {},
  action: ?Action
): any => {
  if (!action) {
    return state;
  }
  switch (action.type) {
    case SET_FILTER: {
      return R.assoc(
        action.payload.key,
        {
          name: action.payload.name,
          fn: action.payload.fn,
        },
        state
      );
    }
    default: {
      return state;
    }
  }
};
