import * as R from 'ramda';
import {Observable} from 'rxjs';
import * as Rx from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {createAction} from 'redux-actions';
import {updateViewedChunks} from './fetchChunks';
import {setFilter} from '../state/filters';
import {DifferenceEquationSignal1D} from 'differenceequationsignal1d';

export const SET_LOW_PASS_FILTER = 'SET_LOW_PASS_FILTER';
export const setLowPassFilter = createAction(SET_LOW_PASS_FILTER);

export const SET_HIGH_PASS_FILTER = 'SET_HIGH_PASS_FILTER';
export const setHighPassFilter = createAction(SET_HIGH_PASS_FILTER);

export type Action = (_: (_: any) => void) => void;

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
    coefficients: null,
  },
  'lopass15': {
    label: 'Low Pass 15Hz',
    coefficients: {
      b: [0.080716994603448, 0.072647596309189, 0.080716994603448],
      a: [1.000000000000000, -1.279860238209870, 0.527812029663189],
    },
  },
  'lopass20': {
    label: 'Low Pass 20Hz',
    coefficients: {
      b: [0.113997925584386, 0.149768961515167, 0.113997925584386],
      a: [1.000000000000000, -1.036801335341888, 0.436950120418250],
    },
  },
  'lopass30': {
    label: 'Low Pass 30Hz',
    coefficients: {
      b: [0.192813914343002, 0.325725940431161, 0.192813914343002],
      a: [1.000000000000000, -0.570379950222695, 0.323884080078956],
    },
  },
  'lopass40': {
    label: 'Low Pass 40Hz',
    coefficients: {
      b: [0.281307434361307, 0.517866041871659, 0.281307434361307],
      a: [1.000000000000000, -0.135289362582513, 0.279792792112445],
    },
  },
};

export const createLowPassFilterEpic = () => (
  action$: Observable<any>,
  state$: Observable<any>,
): Observable<Action> => action$.pipe(
  ofType(SET_LOW_PASS_FILTER),
  Rx.map(R.prop('payload')),
  Rx.withLatestFrom(state$),
  Rx.map<[string, any], any>(([payload]) => (dispatch) => {
    dispatch(setFilter({
      key: 'lowPass',
      name: payload,
      fn: R.curry(applyFilter)(LOW_PASS_FILTERS[payload].coefficients),
    }));
    dispatch(updateViewedChunks());
  })
);

export const HIGH_PASS_FILTERS = {
  'none': {
    label: 'No High Pass Filter',
    coefficients: null,
  },
  'hipass0_5': {
    label: 'High Pass 0.5Hz',
    coefficients: {
      b: [0.937293010134975, -1.874580964130496, 0.937293010134975],
      a: [1.000000000000000, -1.985579602684723, 0.985739491853153],
    },
  },
  'hipass1': {
    label: 'High Pass 1Hz',
    coefficients: {
      b: [0.930549324176904, -1.861078566912498, 0.930549324176904],
      a: [1.000000000000000, -1.971047525054235, 0.971682555986628],
    },
  },
  'hipass5': {
    label: 'High Pass 5Hz',
    coefficients: {
      b: [0.877493430773021, -1.754511635757187, 0.877493430773021],
      a: [1.000000000000000, -1.851210698908115, 0.866238657864428],
    },
  },
  'hipass10': {
    label: 'High Pass 10Hz',
    coefficients: {
      b: [0.813452161011750, -1.625120853023986, 0.813452161011750],
      a: [1.000000000000000, -1.694160769645868, 0.750559011393507],
    },
  },
};

export const createHighPassFilterEpic = () => (
  action$: Observable<any>,
  state$: Observable<any>
): Observable<Action> => action$.pipe(
  ofType(SET_HIGH_PASS_FILTER),
  Rx.map(R.prop('payload')),
  Rx.withLatestFrom(state$),
  Rx.map<[string, any], any>(([payload]) => (dispatch) => {
    dispatch(setFilter({
      key: 'highPass',
      name: payload,
      fn: R.curry(applyFilter)(HIGH_PASS_FILTERS[payload].coefficients),
    }));
    dispatch(updateViewedChunks());
  })
);
