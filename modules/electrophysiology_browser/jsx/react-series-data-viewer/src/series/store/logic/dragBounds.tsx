import * as R from 'ramda';
import {Observable, merge} from 'rxjs';
import * as Rx from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {createAction} from 'redux-actions';
import {SET_INTERVAL, setInterval} from '../state/bounds';
import {updateViewedChunks} from './fetchChunks';

import {
  Action as BoundsAction,
} from '../state/bounds';

export const START_DRAG_INTERVAL = 'START_DRAG_INTERVAL';
export const startDragInterval = createAction(START_DRAG_INTERVAL);

export const CONTINUE_DRAG_INTERVAL = 'CONTINUE_DRAG_INTERVAL';
export const continueDragInterval = createAction(CONTINUE_DRAG_INTERVAL);

export const END_DRAG_INTERVAL = 'END_DRAG_INTERVAL';
export const endDragInterval = createAction(END_DRAG_INTERVAL);

export type Action = BoundsAction | { type: 'UPDATE_VIEWED_CHUNKS' };

/**
 * createDragBoundsEpic
 *
 * @returns {Observable<Action>} - A stream of actions
 */
export const createDragBoundsEpic = () => (
  action$: Observable<any>,
  state$: Observable<any>,
): Observable<Action> => {
  const startDrag$ = action$.pipe(
    ofType(START_DRAG_INTERVAL),
    Rx.map(R.prop('payload'))
  );

  const continueDrag$ = action$.pipe(
    ofType(CONTINUE_DRAG_INTERVAL),
    Rx.map(R.prop('payload'))
  );

  const endDrag$ = action$.pipe(ofType(END_DRAG_INTERVAL));

  /**
   * computeNewInterval
   *
   * @param {[number, number]} interval - New time interval
   * @returns {void}
   */
  const computeNewInterval = (interval) => {
    return (dispatch) => {
      dispatch(setInterval(interval));
    };
  };

  const startUpdates$ = startDrag$.pipe(
    Rx.withLatestFrom(state$),
    Rx.map((payload) => computeNewInterval(payload[0]))
  );

  const dragUpdates$ = startDrag$.pipe(
    Rx.switchMap(() =>
      continueDrag$.pipe(
        Rx.withLatestFrom(state$),
        Rx.map((payload) => computeNewInterval(payload[0])),
        Rx.takeUntil(endDrag$)
      )
    )
  );

  const updateViewedChunks$ = action$.pipe(
    ofType(SET_INTERVAL),
    Rx.mapTo(updateViewedChunks())
  );

  return merge(startUpdates$, dragUpdates$, updateViewedChunks$);
};
