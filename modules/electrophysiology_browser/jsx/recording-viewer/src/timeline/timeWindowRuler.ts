import {roundTime} from '../shared/utils';
import {TimeRange} from './types';

export type TimeTick = {
  isMajor: boolean,
  percent: number,
  value: number,
};

/** Return a readable axis interval in the familiar 1, 2, 2.5, 5 sequence. */
export function getNiceTimeStep(roughStep: number): number {
  if (!Number.isFinite(roughStep) || roughStep <= 0) {
    return 1;
  }

  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalizedStep = roughStep / magnitude;
  const niceNormalizedStep = normalizedStep <= 1
    ? 1
    : normalizedStep <= 2
      ? 2
      : normalizedStep <= 2.5
        ? 2.5
        : normalizedStep <= 5
          ? 5
          : 10;

  return niceNormalizedStep * magnitude;
}

/** Create aligned major and minor ticks for a recording time range. */
export function createTimeTicks(
  recordingTimeRange: TimeRange,
  majorStep: number
): TimeTick[] {
  const [start, end] = recordingTimeRange;
  const duration = end - start;
  if (duration <= 0) {
    return [];
  }

  const minorStep = majorStep / 5;
  const firstTickIndex = Math.ceil((start - minorStep / 1000) / minorStep);
  const lastTickIndex = Math.floor((end + minorStep / 1000) / minorStep);
  const ticks: TimeTick[] = [];

  for (let index = firstTickIndex; index <= lastTickIndex; index += 1) {
    const value = roundTime(index * minorStep);
    ticks.push({
      isMajor: index % 5 === 0,
      percent: ((value - start) / duration) * 100,
      value,
    });
  }

  return ticks;
}
