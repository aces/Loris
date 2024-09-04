import * as R from 'ramda';
import {ofType} from 'redux-observable';
import {Observable, from, of} from 'rxjs';
import * as Rx from 'rxjs/operators';
import {createAction} from 'redux-actions';
import {State as DatasetState} from '../state/dataset';
import {Filter} from '../state/filters';
import {Channel, Chunk} from '../types';
import {State as BoundsState} from '../state/bounds';
import {fetchChunk} from '../../../chunks';
import {MAX_VIEWED_CHUNKS} from '../../../vector';
import {setChannels} from '../state/channels';

export const UPDATE_VIEWED_CHUNKS = 'UPDATE_VIEWED_CHUNKS';
export const updateViewedChunks = createAction(UPDATE_VIEWED_CHUNKS);

type FetchedChunks = {
  chunksURL: string,
  channelIndex: number,
  traceIndex: number,
  chunks: Chunk[]
};

/**
 * loadChunks
 *
 * @param {FetchedChunks[]} chunksData - The fetched chunks
 * @returns {Function} - Dispatch actions to the store
 */
export const loadChunks = (chunksData: FetchedChunks[]) => {
  return (dispatch: (_: any) => void) => {
    const channels : Channel[] = [];

    const filters: Filter[] = window
      .EEGLabSeriesProviderStore[chunksData[0].chunksURL]
      .getState().filters;
    for (let index = 0; index < chunksData.length; index++) {
      const {channelIndex, chunks} : {
        channelIndex: number,
        chunks: Chunk[]
      } = chunksData[index];
      for (let i = 0; i < chunks.length; i++) {
        chunks[i].filters = [];
        chunks[i].values = Object.values(filters).reduce(
          (signal: number[], filter: Filter) => {
            chunks[i].filters.push(filter.name);
            return filter.fn(signal);
          },
          chunks[i].originalValues
        );
      }

      const idx = channels.findIndex((c) => c.index === channelIndex);
      if (idx >= 0) {
        channels[idx].traces.push({
          chunks: chunks,
          type: 'line',
        });
      } else {
        channels.push({
          index: channelIndex,
          traces: [{
            chunks: chunks,
            type: 'line',
          }],
        });
      }
    }

    channels.sort((a, b) => a.index - b.index);
    dispatch(setChannels(channels));
  };
};

export const fetchChunkAt = R.memoizeWith(
  (baseURL, downsampling, channelIndex, traceIndex, chunkIndex) =>
    `${baseURL}-${channelIndex}-${traceIndex}-${chunkIndex}-${downsampling}`,
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

type State = {bounds: BoundsState, dataset: DatasetState, channels: Channel[]};
type chunkIntervals = {
  interval: [ number, number ],
  numChunks: number,
  downsampling: number,
};

const UPDATE_DEBOUNCE_TIME = 100;

/**
 * createFetchChunksEpic
 *
 * @param {Function} fromState - A function to parse the current state
 * @returns {Observable} - An observable
 */
export const createFetchChunksEpic = (fromState: (any) => State) => (
  action$: Observable<any>,
  state$: Observable<any>
) => {
  return action$.pipe(
    ofType(UPDATE_VIEWED_CHUNKS),
    Rx.withLatestFrom(state$),
    Rx.map(([, state]) => fromState(state)),
    Rx.debounceTime(UPDATE_DEBOUNCE_TIME),
    Rx.concatMap(({bounds, dataset, channels}) => {
      const {chunksURL, shapes, validSamples, timeInterval} = dataset;
      if (!chunksURL) {
        return of();
      }

      const fetches = R.flatten(
        channels.map((channel) => {
          return (
            channel &&
            channel.traces.map((_, traceIndex) => {
              const shapeChunks =
                shapes.map((shape) => shape[shape.length - 2]);

              const valuesPerChunk =
                shapes.map((shape) => shape[shape.length - 1]);

              const chunkIntervals = shapeChunks
                .map((numChunks, downsampling) => {
                  const recordingDuration = Math.abs(
                    timeInterval[1] - timeInterval[0]
                  );

                  const filledChunks = (numChunks - 1) +
                    (validSamples[downsampling] / valuesPerChunk[downsampling]);

                  const i0 =
                    (filledChunks *
                      Math.floor(bounds.interval[0] - bounds.domain[0])
                    ) / recordingDuration;

                  const i1 =
                    (filledChunks *
                      Math.ceil(bounds.interval[1] - bounds.domain[0])
                    ) / recordingDuration;

                  return {
                    interval:
                      [
                        Math.floor(i0),
                        Math.min(Math.ceil(i1), filledChunks),
                      ],
                    numChunks: numChunks,
                    downsampling,
                  };
                })
                .filter(({interval}) =>
                    interval[1] - interval[0] < MAX_VIEWED_CHUNKS
                )
                .reverse();

              const finestChunks : chunkIntervals = R.reduce(
                R.maxBy(({interval}) => interval[1] - interval[0]),
                chunkIntervals[0],
                chunkIntervals
              );

              const chunkPromises = R.range(...finestChunks.interval).flatMap(
                (chunkIndex) => {
                  const numChunks = finestChunks.numChunks;

                  const filledChunks = (numChunks - 1) + (
                    validSamples[finestChunks.downsampling] /
                    valuesPerChunk[finestChunks.downsampling]
                  );

                  const chunkInterval = [
                    timeInterval[0] +
                    (chunkIndex / filledChunks) *
                    (timeInterval[1] - timeInterval[0]),
                    timeInterval[0] +
                    ((chunkIndex + 1) / filledChunks) *
                    (timeInterval[1] - timeInterval[0]),
                  ];
                  if (chunkInterval[0] <= bounds.interval[1]) {
                    return fetchChunkAt(
                      chunksURL,
                      finestChunks.downsampling,
                      channel.index,
                      traceIndex,
                      chunkIndex
                    ).then((chunk) => ({
                      interval: chunkInterval,
                      ...chunk,
                    }));
                  } else {
                    return [];
                  }
                }
              );

              return from(
                Promise.all(chunkPromises).then((chunks) => ({
                  chunksURL: chunksURL,
                  channelIndex: channel.index,
                  traceIndex: traceIndex,
                  chunks,
                }))
              );
            })
          );
        })
      );

      return from(fetches).pipe(
        Rx.mergeMap(R.identity),
        Rx.toArray(),
      );
    }),
    // @ts-ignore
    Rx.map((payload) => loadChunks(payload))
  );
};
