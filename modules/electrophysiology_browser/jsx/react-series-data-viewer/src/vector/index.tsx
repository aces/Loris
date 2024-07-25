import {vec2, glMatrix} from 'gl-matrix';

export type Vector2 = typeof glMatrix.ARRAY_TYPE;

/**
 * Apply transformation f on point p
 *
 * @param {Function[]} f - an array of functions
 * @param {vec2} p - a point
 * @returns {vec2} - a vector
 */
export const ap = (
  f: [(_: number) => number, (_: number) => number],
  p: vec2
): vec2 => vec2.fromValues(f[0](p[0]), f[1](p[1]));

export const MIN_INTERVAL = 0.001;

export const MIN_EPOCH_WIDTH = 0.025;

export const MAX_VIEWED_CHUNKS = 4;

export const DEFAULT_MAX_CHANNELS = 16;

export const CHANNEL_DISPLAY_OPTIONS = [4, 8, 16, 32, 64];

export const STATIC_SERIES_RANGE: [number, number] = [-0.05, 0.05];

export const DEFAULT_TIME_INTERVAL: [number, number] = [0, 5];

export const DEFAULT_VIEWER_HEIGHT = 700;

export const SIGNAL_SCALE = Math.pow(10, 6);

export const SIGNAL_UNIT = 'µV';

export const MAX_RENDERED_EPOCHS = 500;
