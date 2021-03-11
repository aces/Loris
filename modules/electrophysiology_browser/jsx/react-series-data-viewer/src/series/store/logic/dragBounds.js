// @flow

import * as R from 'ramda';
import {Observable, merge} from 'rxjs';
import * as Rx from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {createAction} from 'redux-actions';
import {SET_INTERVAL, setInterval} from '../state/bounds';
import {updateViewedChunks} from './fetchChunks';

import type {
  State as BoundsState,
  Action as BoundsAction,
} from '../state/bounds';
import {MIN_INTERVAL_FACTOR} from '../../../vector';

export const START_DRAG_INTERVAL = 'START_DRAG_INTERVAL';
export const startDragInterval = createAction(START_DRAG_INTERVAL);

export const CONTINUE_DRAG_INTERVAL = 'CONTINUE_DRAG_INTERVAL';
export const continueDragInterval = createAction(CONTINUE_DRAG_INTERVAL);

export const END_DRAG_INTERVAL = 'END_DRAG_INTERVAL';
export const endDragInterval = createAction(END_DRAG_INTERVAL);

export type Action = BoundsAction | { type: 'UPDATE_VIEWED_CHUNKS' };

export const createDragBoundsEpic = (fromState: any => BoundsState) => (
  action$: Observable<any>,
  state$: Observable<any>
): Observable<Action> => {
  let draggedEnd = null;

  const startDrag$ = action$.pipe(
    ofType(START_DRAG_INTERVAL),
    Rx.map(R.prop('payload'))
  );

  const continueDrag$ = action$.pipe(
    ofType(CONTINUE_DRAG_INTERVAL),
    Rx.map(R.prop('payload'))
  );

  const endDrag$ = action$.pipe(
    ofType(END_DRAG_INTERVAL),
    Rx.map(() => {
      draggedEnd = null;
    })
  );

  const computeNewInterval = ([position, state]) => {
    const {interval, domain} = R.clone(fromState(state));
    const x = position * domain[1];
    const minSize = Math.abs(domain[1] - domain[0]) * MIN_INTERVAL_FACTOR;

    if (draggedEnd === null) {
      draggedEnd = Math.abs(x - interval[0]) < Math.abs(x - interval[1])
        ? 0
        : 1;
    }

    const [i0, i1] = draggedEnd === 0
        ? [0, 1]
        : [1, 0];

    const sign = Math.sign(interval[i1] - interval[i0]);
    interval[i0] = x;
    interval[i0] +=
      sign > 0
        ? Math.min(interval[i1] - minSize - interval[i0], 0)
        : Math.max(interval[i1] + minSize - interval[i0], 0);

    return setInterval(interval);
  };

  const startUpdates$ = startDrag$.pipe(
    Rx.withLatestFrom(state$),
    Rx.map(computeNewInterval)
  );

  const dragUpdates$ = startDrag$.pipe(
    Rx.switchMap(() =>
      continueDrag$.pipe(
        Rx.withLatestFrom(state$),
        Rx.map(computeNewInterval),
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
