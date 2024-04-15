import * as R from 'ramda';
import {Observable} from 'rxjs';
import * as Rx from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {createAction} from 'redux-actions';
import {updateViewedChunks} from './fetchChunks';
import {setFilter} from '../state/filters';
import {DifferenceEquationSignal1D}
from '../../../libs/DifferenceEquationSignal1D';

export const SET_LOW_PASS_FILTER = 'SET_LOW_PASS_FILTER';
export const setLowPassFilter = createAction(SET_LOW_PASS_FILTER);

export const SET_HIGH_PASS_FILTER = 'SET_HIGH_PASS_FILTER';
export const setHighPassFilter = createAction(SET_HIGH_PASS_FILTER);

export type Action = (_: (_: any) => void) => void;

/**
 * applyFilter
 *
 * @param {object} coefficients - The coefficients a, b
 * @param {Float32Array} input - The input signal
 * @returns {Float32Array} - The output signal
 */
const applyFilter = (coefficients, input) => {
  const diffFilter = new DifferenceEquationSignal1D();
  diffFilter.enableBackwardSecondPass();

  if (coefficients) {
    diffFilter.setInput(input);
    diffFilter.setACoefficients(coefficients.a);
    diffFilter.setBCoefficients(coefficients.b);
    diffFilter.run(); // eventually should be pixpipe's update()
    return Array.from(diffFilter.getOutput());
  }
  return input;
};

export const LOW_PASS_FILTERS = {
  'none': {
    label: 'No Low Pass Filter',
    coefficients: {
      '500': null,
      '512': null,
      '1000': null,
      '1024': null,
    },
  },
  'lopass15': {
    label: 'Low Pass 15Hz',
    coefficients: {
      '500': {
        b: [0.0021, 0.0042, 0.0021],
        a: [1.0000, -1.8668, 0.8752],
      },
      '512': {
        b: [0.0020, 0.0040, 0.0020],
        a: [1.0000, -1.8700, 0.8780],
      },
      '1000': {
        b: [0.0005, 0.0011, 0.0005],
        a: [1.0000, -1.9334, 0.9355],
      },
      '1024': {
        b: [0.0005, 0.0010, 0.0005],
        a: [1.0000, -1.9349, 0.9370],
      },
    },
  },
  'lopass20': {
    label: 'Low Pass 20Hz',
    coefficients: {
      '500': {
        b: [0.0036, 0.0072, 0.0036],
        a: [1.0000, -1.8227, 0.8372],
      },
      '512': {
        b: [0.0035, 0.0069, 0.0035],
        a: [1.0000, -1.8268, 0.8407],
      },
      '1000': {
        b: [0.0009, 0.00189, 0.0009],
        a: [1.0000, -1.9112, 0.9150],
      },
      '1024': {
        b: [0.0009, 0.0018, 0.0009],
        a: [1.0000, -1.9133, 0.9169],
      },
    },
  },
  'lopass30': {
    label: 'Low Pass 30Hz',
    coefficients: {
      '500': {
        b: [0.0078, 0.0156, 0.0078],
        a: [1.0000, -1.7347, 0.7660],
      },
      '512': {
        b: [0.0075, 0.0150, 0.0075],
        a: [1.0000, -1.7409, 0.7708],
      },
      '1000': {
        b: [0.0021, 0.0042, 0.0021],
        a: [1.0000, -1.8669, 0.8752],
      },
      '1024': {
        b: [0.0020, 0.0040, 0.0020],
        a: [1.0000, -1.8700, 0.8780],
      },
    },
  },
  'lopass40': {
    label: 'Low Pass 40Hz',
    coefficients: {
      '500': {
        b: [0.0134, 0.0267, 0.0134],
        a: [1.0000, -1.6475, 0.7009],
      },
      '512': {
        b: [0.0128, 0.0256, 0.0128],
        a: [1.0000, -1.6556, 0.7068],
      },
      '1000': {
        b: [0.0036, 0.0072, 0.0036],
        a: [1.0000, -1.8227, 0.8372],
      },
      '1024': {
        b: [0.0035, 0.0069, 0.0035],
        a: [1.0000, -1.8268, 0.8407],
      },
    },
  },
  'lopass60': {
    label: 'Low Pass 60Hz',
    coefficients: {
      '500': {
        b: [0.0279, 0.0557, 0.0279],
        a: [1.0000, -1.4754, 0.5869],
      },
      '512': {
        b: [0.0267, 0.0534, 0.0267],
        a: [1.0000, -1.4875, 0.5943],
      },
      '1000': {
        b: [0.0078, 0.0156, 0.0078],
        a: [1.0000, -1.7347, 0.7660],
      },
      '1024': {
        b: [0.0075, 0.0150, 0.0075],
        a: [1.0000, -1.7409, 0.7708],
      },
    },
  },
};

/**
 * createLowPassFilterEpic
 *
 * @returns {Observable<Action>} - A stream of actions
 */
export const createLowPassFilterEpic = () => (
  action$: Observable<any>,
  state$: Observable<any>,
): Observable<Action> => action$.pipe(
  ofType(SET_LOW_PASS_FILTER),
  Rx.map(R.prop('payload')),
  Rx.withLatestFrom(state$),
  Rx.map<[string, any], any>(([payload, state]) => (dispatch) => {
    const samplingFrequency = state.dataset.samplingFrequency;
    dispatch(setFilter({
      key: 'lowPass',
      name: payload,
      fn: R.curry(applyFilter)(
        LOW_PASS_FILTERS[payload].coefficients[samplingFrequency]
      ),
    }));
    dispatch(updateViewedChunks());
  })
);

export const HIGH_PASS_FILTERS = {
  'none': {
    label: 'No High Pass Filter',
    coefficients: {
      '500': null,
      '512': null,
      '1000': null,
      '1024': null,
    },
  },
  'hipass0_5': {
    label: 'High Pass 0.5Hz',
    coefficients: {
      '500': {
        b: [0.9978, -1.9956, 0.9978],
        a: [1.0000, -1.9956, 0.9956],
      },
      '512': {
        b: [0.9978, -1.9957, 0.9978],
        a: [1.0000, -1.9957, 0.9957],
      },
      '1000': {
        b: [0.9989, -1.9978, 0.9989],
        a: [1.0000, -1.9978, 0.9978],
      },
      '1024': {
        b: [0.9989, -1.9978, 0.9989],
        a: [1.0000, -1.9978, 0.9978],
      },
    },
  },
  'hipass1': {
    label: 'High Pass 1Hz',
    coefficients: {
      '500': {
        b: [0.9956, -1.9911, 0.9956],
        a: [1.0000, -1.9911, 0.9912],
      },
      '512': {
        b: [0.9957, -1.9913, 0.9957],
        a: [1.0000, -1.9913, 0.9914],
      },
      '1000': {
        b: [0.9978, -1.9956, 0.9978],
        a: [1.0000, -1.9956, 0.9956],
      },
      '1024': {
        b: [0.9978, -1.9957, 0.9978],
        a: [1.0000, -1.9957, 0.9957],
      },
    },
  },
  'hipass5': {
    label: 'High Pass 5Hz',
    coefficients: {
      '500': {
        b: [0.9780, -1.9561, 0.9780],
        a: [1.0000, -1.9556, 0.9565],
      },
      '512': {
        b: [0.9785, -1.9571, 0.9785],
        a: [1.0000, -1.9566, 0.9575],
      },
      '1000': {
        b: [0.9890, -1.9779, 0.9890],
        a: [1.0000, -1.9778, 0.9780],
      },
      '1024': {
        b: [0.9892, -1.9784, 0.9892],
        a: [1.0000, -1.9783, 0.9785],
      },
    },
  },
  'hipass10': {
    label: 'High Pass 10Hz',
    coefficients: {
      '500': {
        b: [0.9565, -1.9131, 0.9565],
        a: [1.0000, -1.9112, 0.9150],
      },
      '512': {
        b: [0.9575, -1.9151, 0.9575],
        a: [1.0000, -1.9133, 0.9169],
      },
      '1000': {
        b: [0.9780, -1.9561, 0.9780],
        a: [1.0000, -1.9556, 0.9565],
      },
      '1024': {
        b: [0.9785, -1.9571, 0.9785],
        a: [1.0000, -1.9566, 0.9575],
      },
    },
  },
};

/**
 * createLowPassFilterEpic
 *
 * @returns {Observable<Action>} - A stream of actions
 */
export const createHighPassFilterEpic = () => (
  action$: Observable<any>,
  state$: Observable<any>
): Observable<Action> => action$.pipe(
  ofType(SET_HIGH_PASS_FILTER),
  Rx.map(R.prop('payload')),
  Rx.withLatestFrom(state$),
  Rx.map<[string, any], any>(([payload, state]) => (dispatch) => {
    const samplingFrequency = state.dataset.samplingFrequency;
    dispatch(setFilter({
      key: 'highPass',
      name: payload,
      fn: R.curry(applyFilter)(
        HIGH_PASS_FILTERS[payload].coefficients[samplingFrequency]
      ),
    }));
    dispatch(updateViewedChunks());
  })
);
