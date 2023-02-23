import * as R from 'ramda';
import {Observable, merge} from 'rxjs';
import * as Rx from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {createAction} from 'redux-actions';
import {setTimeSelection} from '../state/timeSelection';
import {Action as BoundsAction} from '../state/bounds';
import {MIN_INTERVAL} from '../../../vector';

export const START_DRAG_SELECTION = 'START_DRAG_SELECTION';
export const startDragSelection = createAction(START_DRAG_SELECTION);

export const CONTINUE_DRAG_SELECTION = 'CONTINUE_DRAG_SELECTION';
export const continueDragSelection = createAction(CONTINUE_DRAG_SELECTION);

export const END_DRAG_SELECTION = 'END_DRAG_SELECTION';
export const endDragSelection = createAction(END_DRAG_SELECTION);

export type Action = BoundsAction | { type: 'UPDATE_VIEWED_CHUNKS' };

/**
 * roundTime
 *
 * @param {number} value - The initial time value
 * @param {number} decimals - The desired decimal precision
 * @returns {number} - The value rounded to 'decimal' decimal places
 */
export const roundTime = (value, decimals = 3) => {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};

/**
 * createTimeSelectionEpic
 *
 * @param {Function} fromState - A function to parse the current state
 * @returns {Observable<Action>} - A stream of actions
 */
export const createTimeSelectionEpic = (fromState: (_: any) => any) => (
  action$: Observable<any>,
  state$: Observable<any>
): Observable<Action> => {
  const startDrag$ = action$.pipe(
    ofType(START_DRAG_SELECTION),
    Rx.map(R.prop('payload')),
  );

  const continueDrag$ = action$.pipe(
    ofType(CONTINUE_DRAG_SELECTION),
    Rx.map(R.prop('payload'))
  );

  /**
   * initInterval
   *
   * @param {Array} root - An array
   * @param {number} root."0" - The mouse position
   * @param {object} root."1" - The state
   * @returns {Function} - Action creator for dispatching actions
   */
  const initInterval = ([position, state]) => {
    const {interval} = R.clone(fromState(state));
    const x = roundTime(interval[0] + position * (interval[1] - interval[0]));
    return setTimeSelection([x, x]);
  };

  /**
   * updateInterval
   *
   * @param {Array} root - An array
   * @param {number} root."0" - The mouse position
   * @param {object} root."1" - The state
   * @returns {Function} - Action creator for dispatching actions
   */
  const updateInterval = ([position, state]) => {
    const {interval, timeSelection} = R.clone(fromState(state));
    const x = interval[0] + position * (interval[1] - interval[0]);
    timeSelection[1] = roundTime(x);
    return setTimeSelection(timeSelection);
  };

  const endDrag$ = action$.pipe(
    ofType(END_DRAG_SELECTION),
    Rx.withLatestFrom(state$),
    Rx.map(([, state]) => {
      if (
        state.timeSelection
        && (
          Math.abs(state.timeSelection[1] - state.timeSelection[0]
        ) < MIN_INTERVAL)
      ) {
        return setTimeSelection(null);
      } else {
        return setTimeSelection(state.timeSelection);
      }
    })
  );

  const startUpdates$ = startDrag$.pipe(
    Rx.withLatestFrom(state$),
    Rx.map(initInterval)
  );

  const dragUpdates$ = startDrag$.pipe(
    Rx.switchMap(() =>
      continueDrag$.pipe(
        Rx.withLatestFrom(state$),
        Rx.map(updateInterval),
        Rx.takeUntil(endDrag$)
      )
    )
  );

  return merge(startUpdates$, dragUpdates$, endDrag$);
};
