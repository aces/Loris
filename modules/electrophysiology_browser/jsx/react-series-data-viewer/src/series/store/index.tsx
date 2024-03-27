import {combineReducers} from 'redux';
import {combineEpics} from 'redux-observable';
import {boundsReducer} from './state/bounds';
import {filtersReducer} from './state/filters';
import {datasetReducer} from './state/dataset';
import {currentAnnotationReducer} from './state/currentAnnotation';
import {cursorReducer} from './state/cursor';
import {panelReducer} from './state/rightPanel';
import {timeSelectionReducer} from './state/timeSelection';
import {montageReducer} from './state/montage';
import {channelsReducer} from './state/channels';
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
import {createCursorInteractionEpic} from './logic/cursorInteraction';

export const rootReducer = combineReducers({
  bounds: boundsReducer,
  filters: filtersReducer,
  dataset: datasetReducer,
  currentAnnotation: currentAnnotationReducer,
  cursor: cursorReducer,
  rightPanel: panelReducer,
  timeSelection: timeSelectionReducer,
  montage: montageReducer,
  channels: channelsReducer,
});

export const rootEpic = combineEpics(
  createDragBoundsEpic(),
  createTimeSelectionEpic(({bounds, timeSelection}) => {
    const {interval} = bounds;
    return {interval, timeSelection};
  }),
  createFetchChunksEpic(({bounds, dataset, channels}) => ({
    bounds,
    dataset,
    channels,
  })),
  createPaginationEpic(({dataset, channels}) => {
    const {limit, channelMetadata} = dataset;
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
  createCursorInteractionEpic(({cursor}) => {
    const {hoveredChannels} = cursor;
    return {hoveredChannels};
  }),
);

export type RootState = ReturnType<typeof rootReducer>;
