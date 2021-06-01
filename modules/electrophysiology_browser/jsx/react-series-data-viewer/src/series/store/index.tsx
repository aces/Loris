import * as R from 'ramda';
import {combineReducers} from 'redux';
import {combineEpics} from 'redux-observable';
import {boundsReducer} from './state/bounds';
import {filtersReducer} from './state/filters';
import {datasetReducer} from './state/dataset';
import {cursorReducer} from './state/cursor';
import {panelReducer} from './state/rightPanel';
import {timeSelectionReducer} from './state/timeSelection';
import {montageReducer} from './state/montage';
import {createDragBoundsEpic} from './logic/dragBounds';
import {createTimeSelectionEpic} from './logic/timeSelection';
import {createFetchChunksEpic} from './logic/fetchChunks';
import {createPaginationEpic} from './logic/pagination';
import {
  createActiveEpochEpic,
  createFilterEpochsEpic,
  createToggleEpochEpic,
} from './logic/filterEpochs';
import {
  createScaleAmplitudesEpic,
  createResetAmplitudesEpic,
} from './logic/scaleAmplitudes';
import {
  createLowPassFilterEpic,
  createHighPassFilterEpic,
} from './logic/highLowPass';

export const rootReducer = combineReducers({
  bounds: boundsReducer,
  filters: filtersReducer,
  dataset: datasetReducer,
  cursor: cursorReducer,
  rightPanel: panelReducer,
  timeSelection: timeSelectionReducer,
  montage: montageReducer,
});

export const rootEpic = combineEpics(
  createDragBoundsEpic(R.prop('bounds')),
  createTimeSelectionEpic(({bounds, timeSelection}) => {
    const {interval} = bounds;
    return {interval, timeSelection};
  }),
  createFetchChunksEpic(({bounds, dataset}) => ({
    bounds,
    dataset,
  })),
  createPaginationEpic(({dataset}) => {
    const {limit, channelMetadata, channels} = dataset;
    return {limit, channelMetadata, channels};
  }),
  createScaleAmplitudesEpic(({bounds}) => {
    const {amplitudeScale} = bounds;
    return amplitudeScale;
  }),
  createResetAmplitudesEpic(),
  createLowPassFilterEpic(),
  createHighPassFilterEpic(),
  createFilterEpochsEpic(({bounds, dataset}) => {
    const {interval} = bounds;
    const {epochs} = dataset;
    return {interval, epochs};
  }),
  createToggleEpochEpic(({dataset}) => {
    const {epochs, filteredEpochs} = dataset;
    return {filteredEpochs, epochs};
  }),
  createActiveEpochEpic(({dataset}) => {
    const {epochs} = dataset;
    return {epochs};
  }),
);

export type RootState = ReturnType<typeof rootReducer>;