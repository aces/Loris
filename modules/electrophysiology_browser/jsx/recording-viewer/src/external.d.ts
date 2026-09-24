declare module 'gl-matrix' {
  export const glMatrix: {ARRAY_TYPE: Float32ArrayConstructor};
  export type vec2 = Float32Array;
  export const vec2: {
    create(): vec2;
    fromValues(x: number, y: number): vec2;
    add(out: vec2, a: vec2, b: vec2): vec2;
    sub(out: vec2, a: vec2, b: vec2): vec2;
    scale(out: vec2, a: vec2, scale: number): vec2;
  };
}

declare module 'd3-array' {
  export function bisector<T, U>(
    accessor: (value: T) => U
  ): {left(array: ArrayLike<T>, value: U): number};
}

declare module 'd3-dsv' {
  export type DSVRowString = Record<string, string>;
  export function tsvParse(text: string): DSVRowString[];
}

declare module 'd3-scale-chromatic' {
  export const schemeDark2: readonly string[];
  export const schemeCategory10: readonly string[];
}
