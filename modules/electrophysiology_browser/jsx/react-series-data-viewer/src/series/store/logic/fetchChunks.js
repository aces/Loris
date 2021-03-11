// @flow

import * as R from 'ramda';
import {ofType} from 'redux-observable';
import {Observable, from, of} from 'rxjs';
import * as Rx from 'rxjs/operators';
import {createAction} from 'redux-actions';
import type {
  State as DatasetState,
  Action as DatasetAction,
} from '../state/dataset';
import type {Chunk} from '../types';
import type {State as BoundsState} from '../state/bounds';
import {fetchChunk} from '../../../chunks';
import {MAX_VIEWED_CHUNKS} from '../../../vector';
import {setActiveChannel} from '../state/dataset';
import {setChunks} from '../state/channel';

export const UPDATE_VIEWED_CHUNKS = 'UPDATE_VIEWED_CHUNKS';
export const updateViewedChunks = createAction(UPDATE_VIEWED_CHUNKS);

type FetchedChunks = {
  channelIndex: number,
  chunks: Chunk[]
};

export const loadChunks = ({channelIndex, ...rest}: FetchedChunks) => {
  return (dispatch: any => void) => {
    let filters = window.EEGLabSeriesProviderStore.getState().filters;
    rest.chunks.forEach((chunk, index, chunks) => {
      chunk.filters = [];
      chunks[index].values = (Object.values(filters) : any).reduce(
        (signal, filter) => {
          chunks[index].filters.push(filter.name);
          return filter.fn(signal);
        },
        chunk.originalValues
      );
    });

    dispatch(setActiveChannel(channelIndex));
    dispatch(setChunks({...rest, channelIndex}));
    dispatch(setActiveChannel(null));
  };
};

export const fetchChunkAt = R.memoizeWith(
  (baseURL, downsampling, channelIndex, traceIndex, chunkIndex) =>
    `${channelIndex}-${traceIndex}-${chunkIndex}-${downsampling}`,
  (
    baseURL: string,
    downsampling: number,
    channelIndex: number,
    traceIndex: number,
    chunkIndex: number
  ) => fetchChunk(
    `${baseURL}/raw/${downsampling}/${channelIndex}/`
     + `${traceIndex}/${chunkIndex}.buf`
  )
);

type State = {bounds: BoundsState, dataset: DatasetState};

const UPDATE_DEBOUNCE_TIME = 100;

export const createFetchChunksEpic = (fromState: any => State) => (
  action$: Observable<any>,
  state$: Observable<any>
): Observable<DatasetAction> => {
  return action$.pipe(
    ofType(UPDATE_VIEWED_CHUNKS),
    Rx.withLatestFrom(state$),
    Rx.map(([_, state]) => fromState(state)),
    Rx.debounceTime(UPDATE_DEBOUNCE_TIME),
    Rx.concatMap(({bounds, dataset}) => {
      const {chunkDirectoryURL, shapes, timeInterval, channels} = dataset;

      if (!chunkDirectoryURL) {
        return of();
      }

      const fetches = R.flatten(
        channels.map((channel, i) => {
          return (
            channel &&
            channel.traces.map((trace, j) => {
              const ncs = shapes.map((shape) => shape[shape.length - 2]);

              const citvs = ncs
                .map((nc, downsampling) => {
                  const timeLength = Math.abs(
                    timeInterval[1] - timeInterval[0]
                  );
                  const i0 =
                    (nc * Math.ceil(bounds.interval[0] - bounds.domain[0])) /
                    timeLength;
                  const i1 =
                    (nc * Math.ceil(bounds.interval[1] - bounds.domain[0])) /
                    timeLength;
                  return {
                    interval: [Math.floor(i0), Math.min(Math.ceil(i1), nc)],
                    numChunks: nc,
                    downsampling,
                  };
                })
                .filter(
                  ({interval, downsampling}) =>
                    // TODO: check this condition...
                    // Why interval[1] - interval[0] < MAX_VIEWED_CHUNKS ?
                    // downsampling === 0 prevents a change of downsampling
                    // otherwise the interval becomes wrong
                    interval[1] - interval[0] < MAX_VIEWED_CHUNKS
                    && downsampling === 0
                );

              const max = R.reduce(
                R.maxBy(({interval}) => interval[1] - interval[0]),
                {interval: [0, 0]},
                citvs
              );

              const chunkPromises = R.range(...max.interval).map(
                (chunkIndex) => {
                  const numChunks = max.numChunks;

                  return fetchChunkAt(
                    chunkDirectoryURL,
                    max.downsampling,
                    channel.index,
                    j,
                    chunkIndex
                  ).then((chunk) => ({
                    interval: [
                      timeInterval[0] +
                        (chunkIndex / numChunks) *
                          (timeInterval[1] - timeInterval[0]),
                      timeInterval[0] +
                        ((chunkIndex + 1) / numChunks) *
                          (timeInterval[1] - timeInterval[0]),
                    ],
                    ...chunk,
                  }));
                }
              );

              return from(
                Promise.all(chunkPromises).then((chunks) => ({
                  channelIndex: channel.index,
                  traceIndex: j,
                  chunks,
                }))
              );
            })
          );
        })
      );

      return from(fetches).pipe(Rx.mergeMap(R.identity));
    }),
    Rx.map((payload) => loadChunks(payload))
  );
};
