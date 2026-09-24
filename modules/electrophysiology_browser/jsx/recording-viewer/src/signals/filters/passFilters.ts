export const LOW_PASS_FILTER_FREQUENCIES = [15, 20, 30, 40, 60];
export const HIGH_PASS_FILTER_FREQUENCIES = [0.5, 1, 5, 10];

const NO_FILTER_SELECT_VALUE = 'none';

export type PassFilterLabel = {
  key: string,
  frequency?: number,
};

/**
 * Return translation metadata for a low pass filter frequency.
 */
export function getLowPassFilterLabel(frequency?: number): PassFilterLabel {
  return frequency === undefined
    ? {key: 'No Low Pass Filter'}
    : {key: 'Low Pass {{frequency}}Hz', frequency};
}

/**
 * Return translation metadata for a high pass filter frequency.
 */
export function getHighPassFilterLabel(frequency?: number): PassFilterLabel {
  return frequency === undefined
    ? {key: 'No High Pass Filter'}
    : {key: 'High Pass {{frequency}}Hz', frequency};
}

/**
 * Serialize an optional filter frequency for use as an HTML select value.
 */
export function getPassFilterSelectValue(frequency?: number): string {
  return frequency === undefined
    ? NO_FILTER_SELECT_VALUE
    : String(frequency);
}

/**
 * Parse an HTML select value back into the optional filter frequency.
 */
export function getPassFilterFrequencyFromSelectValue(
  value: string
): number | undefined {
  return value === NO_FILTER_SELECT_VALUE ? undefined : Number(value);
}
