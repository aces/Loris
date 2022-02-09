import {vec2, glMatrix} from 'gl-matrix';

export type Vector2 = typeof glMatrix.ARRAY_TYPE;

export const ap = (f: [(_: any) => any, (_: any) => any], p: Vector2): Vector2 =>
  vec2.fromValues(f[0](p[0]), f[1](p[1]));

export const MIN_INTERVAL_FACTOR = 0.005;

export const MIN_EPOCH_WIDTH = 1;

export const MAX_VIEWED_CHUNKS = 3;

export const MAX_CHANNELS = 6;

export const SIGNAL_SCALE = Math.pow(10, 6);

export const SIGNAL_UNIT = 'µV';

export const MAX_RENDERED_EPOCHS = 100;
