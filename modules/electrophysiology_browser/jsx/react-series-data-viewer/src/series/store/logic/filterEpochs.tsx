import * as R from 'ramda';
import {Observable} from 'rxjs';
import * as Rx from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {createAction} from 'redux-actions';
import {setFilteredEpochs, setActiveEpoch} from '../state/dataset';
import {MAX_RENDERED_EPOCHS} from '../../../vector';
import {Epoch} from '../types';

export const UPDATE_FILTERED_EPOCHS = 'UPDATE_FILTERED_EPOCHS';
export const updateFilteredEpochs = createAction(UPDATE_FILTERED_EPOCHS);

export const TOGGLE_EPOCH = 'TOGGLE_EPOCH';
export const toggleEpoch = createAction(TOGGLE_EPOCH);

export const UPDATE_ACTIVE_EPOCH = 'UPDATE_ACTIVE_EPOCH';
export const updateActiveEpoch = createAction(UPDATE_ACTIVE_EPOCH);

export type Action = (_: (_: any) => void) => void;

/**
 * createFilterEpochsEpic
 *
 * @param {Function} fromState - A function to parse the current state
 * @returns {Observable<Action>} - A stream of actions
 */
export const createFilterEpochsEpic = (fromState: (_: any) => any) => (
  action$: Observable<any>,
  state$: Observable<any>
): Observable<Action> => {
  return action$.pipe(
    ofType(UPDATE_FILTERED_EPOCHS),
    Rx.map(R.prop('payload')),
    Rx.withLatestFrom(state$),
    Rx.map(([, state]) => {
      const {interval, epochs} = fromState(state);
      let newFilteredEpochs = [...Array(epochs.length).keys()]
        .filter((index) =>
          epochs[index].onset + epochs[index].duration > interval[0]
          && epochs[index].onset < interval[1]
        );

      if (newFilteredEpochs.length >= MAX_RENDERED_EPOCHS) {
        newFilteredEpochs = [];
      }

      return (dispatch) => {
        dispatch(setFilteredEpochs(newFilteredEpochs));
      };
    })
  );
};

/**
 * createToggleEpochEpic
 *
 * @param {Function} fromState - A function to parse the current state
 * @returns {Observable<Action>} - A stream of actions
 */
export const createToggleEpochEpic = (fromState: (_: any) => any) => (
  action$: Observable<any>,
  state$: Observable<any>
): Observable<Action> => {
  return action$.pipe(
    ofType(TOGGLE_EPOCH),
    Rx.map(R.prop('payload')),
    Rx.withLatestFrom(state$),
    Rx.map(([payload, state]) => {
      const {filteredEpochs, epochs} = fromState(state);
      const index = payload;
      let newFilteredEpochs;

      if (filteredEpochs.includes(index)) {
        newFilteredEpochs = filteredEpochs.filter((i) => i !== index);
      } else if (index >= 0 && index < epochs.length) {
        newFilteredEpochs = filteredEpochs.slice();
        newFilteredEpochs.push(index);
        newFilteredEpochs.sort();
      } else {
        return;
      }

      return (dispatch) => {
        dispatch(setFilteredEpochs(newFilteredEpochs));
      };
    })
  );
};

/**
 * createActiveEpochEpic
 *
 * @param {Function} fromState - A function to parse the current state
 * @returns {Observable<Action>} - A stream of actions
 */
export const createActiveEpochEpic = (fromState: (_: any) => any) => (
  action$: Observable<any>,
  state$: Observable<any>
): Observable<Action> => {
  return action$.pipe(
    ofType(UPDATE_ACTIVE_EPOCH),
    Rx.map(R.prop('payload')),
    Rx.withLatestFrom(state$),
    Rx.map(([payload, state]) => {
      const {epochs} = fromState(state);
      const index = payload;

      if (index < 0 || index >= epochs.length) {
        return;
      }

      return (dispatch) => {
        dispatch(setActiveEpoch(index));
      };
    })
  );
};

/**
 * getEpochsInRange
 *
 * @param {Epoch[]} epochs - Array of epoch
 * @param {[number, number]} interval - Time interval to search
 * @param {string} epochType - Epoch type (Annotation|Event)
 * @param {boolean} withComments - Include only if has comments
 * @returns {Epoch[]} - Epoch[] in interval with epochType
 */
export const getEpochsInRange = (
  epochs,
  interval,
  epochType,
  withComments = false,
) => {
  return [...Array(epochs.length).keys()].filter((index) =>
    (
      (isNaN(epochs[index].onset) && interval[0] === 0)
      ||
      (
        epochs[index].onset + epochs[index].duration > interval[0] &&
        epochs[index].onset < interval[1]
      )
    ) &&
    epochs[index].type === epochType &&
    (!withComments || epochs[index].hed || epochs[index].comment)
  );
};
