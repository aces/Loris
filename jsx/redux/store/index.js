import {createStore, combineReducers} from 'redux';
import reducers from '../reducers/reducers.js';

export const store = createStore(
  combineReducers({
    state: reducers,
  }),
);
