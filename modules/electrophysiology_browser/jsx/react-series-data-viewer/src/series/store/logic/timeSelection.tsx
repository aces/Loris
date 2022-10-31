import * as R from 'ramda';
import {Observable, merge} from 'rxjs';
import * as Rx from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {createAction} from 'redux-actions';
import {setTimeSelection} from '../state/timeSelection';
import {Action as BoundsAction} from '../state/bounds';
import {MIN_INTERVAL_FACTOR} from '../../../vector';

export const START_DRAG_SELECTION = 'START_DRAG_SELECTION';
export const startDragSelection = createAction(START_DRAG_SELECTION);

export const CONTINUE_DRAG_SELECTION = 'CONTINUE_DRAG_SELECTION';
export const continueDragSelection = createAction(CONTINUE_DRAG_SELECTION);

export const END_DRAG_SELECTION = 'END_DRAG_SELECTION';
export const endDragSelection = createAction(END_DRAG_SELECTION);

export type Action = BoundsAction | { type: 'UPDATE_VIEWED_CHUNKS' };

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

  const initInterval = ([position, state]) => {
    const {interval} = R.clone(fromState(state));
    const x = Math.round(interval[0] + position * (interval[1] - interval[0]));
    return setTimeSelection([x, x]);
  };

  const updateInterval = ([position, state]) => {
    const {interval, timeSelection} = R.clone(fromState(state));
    const x = interval[0] + position * (interval[1] - interval[0]);
    const minSize = Math.abs(interval[1] - interval[0]) * MIN_INTERVAL_FACTOR;
    timeSelection[1] = Math.round(
      x + Math.max(timeSelection[0] + minSize - timeSelection[1], 0)
    );

    return setTimeSelection(timeSelection);
  };

  const endDrag$ = action$.pipe(
    ofType(END_DRAG_SELECTION),
    Rx.withLatestFrom(state$),
    Rx.map(([payload, state]) => {
      if (
        state.timeSelection
        && (state.timeSelection[1] - state.timeSelection[0] < 2)
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
