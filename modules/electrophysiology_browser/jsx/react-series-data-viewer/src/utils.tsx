/**
 * Get the minimum and maximum values from a non-empty list of numbers.
 */
export function getMinMaxRange(values: number[]): [number, number] {
  let min = values[0];
  let max = values[0];
  for (let i = 1; i < values.length; i++) {
    if (values[i] < min) {
      min = values[i];
    }
    if (values[i] > max) {
      max = values[i];
    }
  }

  return [min, max];
}

/**
 * Get the value at the n-th percentile index in a list.
 */
export function getIndexPercentile(
  values: number[],
  percentile: number,
): number {
  const index = Math.floor((percentile / 100) * values.length);
  const clampedIndex = Math.min(index, values.length - 1);
  return values[clampedIndex];
}

/**
 * Compute the percentile range in a list of numbers.
 */
export function computePercentileRange(
  values: number[],
  lowerPercentile = 5,
  upperPercentile = 95,
): [number, number] {
  if (values.length === 0) {
    return [0, 0];
  }

  const sorted = [...values].sort((a, b) => a - b);

  return [
    getIndexPercentile(sorted, lowerPercentile),
    getIndexPercentile(sorted, upperPercentile),
  ];
}

/**
 * Compute the mean in a list of numbers.
 */
export function computeMean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Normalize a channel unit for visualization.
 */
export function normalizeUnit(unit: string): string {
  // Display MEG signals in femtoteslas instead of teslas.
  if (unit === 'T') {
    return 'fT';
  }

  // Display EEG signals in microvolts instead of volts.
  if (unit === 'V') {
    return 'µV';
  }

  // Do not modify unknown units.
  return unit;
}

/**
 * Normalize a value for visualization based on the target unit, assuming the value is in the
 * non-prefixed.
 */
export function normalizeValueUnit(value: number, unit: string): number {
  // Convert MEG signal values from teslas to femtoteslas.
  if (unit === 'fT') {
    return Math.round(value * 1e15);
  }

  // Convert EEG signal values from volts to microvolts.
  if (unit === 'µV') {
    return Math.round(value * 1e6);
  }

  // Simply remove decimals for unknown units.
  return Math.round(value);
}
