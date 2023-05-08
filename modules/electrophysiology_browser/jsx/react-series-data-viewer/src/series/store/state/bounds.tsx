import {createAction} from 'redux-actions';
import {DEFAULT_VIEWER_HEIGHT} from '../../../vector';

export const SET_INTERVAL = 'SET_INTERVAL';
export const setInterval = createAction(SET_INTERVAL);

export const SET_DOMAIN = 'SET_DOMAIN';
export const setDomain = createAction(SET_DOMAIN);

export const SET_AMPLITUDE_SCALE = 'SET_AMPLITUDE_SCALE';
export const setAmplitudeScale = createAction(SET_AMPLITUDE_SCALE);

export const SET_VIEWER_WIDTH = 'SET_VIEWER_WIDTH';
export const setViewerWidth = createAction(SET_VIEWER_WIDTH);

export const SET_VIEWER_HEIGHT = 'SET_VIEWER_HEIGHT';
export const setViewerHeight = createAction(SET_VIEWER_HEIGHT);

export type Action =
  | {type: 'SET_INTERVAL', payload: [number, number]}
  | {type: 'SET_DOMAIN', payload: [number, number]}
  | {type: 'SET_AMPLITUDE_SCALE', payload: number}
  | {type: 'SET_VIEWER_WIDTH', payload: number}
  | {type: 'SET_VIEWER_HEIGHT', payload: number}

export type State = {
  interval: [number, number],
  domain: [number, number],
  amplitudeScale: number,
  viewerWidth: number,
  viewerHeight: number,
};

/**
 * interval reducer
 *
 * @param {State} state - The current state
 * @param {Action} action - The action
 * @returns {State} - The updated state
 */
const interval = (
  state: [number, number] = [0.25, 0.75],
  action?: Action
): [number, number] => {
  if (action && action.type === 'SET_INTERVAL') {
    return [
      Math.min(action.payload[0], action.payload[1]),
      Math.max(action.payload[0], action.payload[1]),
    ];
  }
  return state;
};

/**
 * domain reducer
 *
 * @param {State} state - The current state
 * @param {Action} action - The action
 * @returns {State} - The updated state
 */
const domain = (
  state: [number, number] = [0, 1],
  action?: Action
): [number, number] => {
  if (action && action.type === 'SET_DOMAIN') {
    return action.payload;
  }
  return state;
};

/**
 * amplitudeScale reducer
 *
 * @param {State} state - The current state
 * @param {Action} action - The action
 * @returns {State} - The updated state
 */
const amplitudeScale = (state = 0.0005, action?: Action): number => {
  if (action && action.type === 'SET_AMPLITUDE_SCALE') {
    return action.payload;
  }
  return state;
};

/**
 * viewerWidth reducer
 *
 * @param {State} state - The current state
 * @param {Action} action - The action
 * @returns {State} - The updated state
 */
const viewerWidth = (state = 400, action?: Action): number => {
  if (action && action.type === 'SET_VIEWER_WIDTH') {
    return action.payload;
  }
  return state;
};

/**
 * viewerHeight reducer
 *
 * @param {State} state - The current state
 * @param {Action} action - The action
 * @returns {State} - The updated state
 */
const viewerHeight = (
  state = DEFAULT_VIEWER_HEIGHT,
  action?: Action
): number => {
  if (action && action.type === 'SET_VIEWER_HEIGHT') {
    return action.payload;
  }
  return state;
};

/**
 * boundsReducer
 *
 * @param {State} state - The current state
 * @param {Action} action - The action
 * @returns {State} - The updated state
 */
export const boundsReducer: (State, Action) => State = (
  state = {
    interval: interval(),
    domain: domain(),
    amplitudeScale: amplitudeScale(),
    viewerWidth: viewerWidth(),
    viewerHeight: viewerHeight(),
  },
  action
) => ({
  interval: interval(state.interval, action),
  domain: domain(state.domain, action),
  amplitudeScale: amplitudeScale(state.amplitudeScale, action),
  viewerWidth: viewerWidth(state.viewerWidth, action),
  viewerHeight: viewerHeight(state.viewerHeight, action),
});
