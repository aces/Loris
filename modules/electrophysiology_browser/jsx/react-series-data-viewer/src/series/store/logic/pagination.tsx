import * as R from 'ramda';
import {Observable} from 'rxjs';
import * as Rx from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {createAction} from 'redux-actions';
import {Channel, ChannelMetadata} from '../types';
import {setChannels} from '../state/channels';
import {setDatasetMetadata} from '../state/dataset';
import {updateViewedChunks} from './fetchChunks';

export const SET_OFFSET_INDEX = 'SET_OFFSET_INDEX';
export const setOffsetIndex = createAction(SET_OFFSET_INDEX);

export type Action = (_: (_: any) => void) => void;

export type State = {
  limit: number,
  channelMetadata: ChannelMetadata[],
  channels: Channel[]
};

/**
 * createPaginationEpic
 *
 * @param {Function} fromState - A function to parse the current state
 * @returns {Observable<Action>} - A stream of actions
 */
export const createPaginationEpic = (fromState: (_: any) => State) => (
  action$: Observable<any>,
  state$: Observable<any>
): Observable<Action> => {
  return action$.pipe(
    ofType(SET_OFFSET_INDEX),
    Rx.map(R.prop('payload')),
    Rx.withLatestFrom(state$),
    Rx.map<[number, State], any>(([payload, state]) => {
      const {limit, channelMetadata, channels} = fromState(state);

      const offsetIndex = Math.min(
        Math.max(payload, 1),
        Math.max(channelMetadata.length - limit + 1, 1)
      );

      let channelIndex = offsetIndex - 1;

      const newChannels = [];
      const hardLimit = Math.min(
        offsetIndex + limit - 1,
        channelMetadata.length
      );
      while (channelIndex < hardLimit) {
        // TODO: need to handle multiple traces using shapes
        const channel =
          channels.find(
            R.pipe(
              R.prop('index'),
              R.equals(channelIndex)
            )
          ) || {
            index: channelIndex,
            traces: [{chunks: [], type: 'line'}],
          };

        newChannels.push(channel);
        channelIndex++;
      }

      return (dispatch) => {
        dispatch(setDatasetMetadata({offsetIndex}));
        dispatch(setChannels(newChannels));
        dispatch(updateViewedChunks());
      };
    })
  );
};
