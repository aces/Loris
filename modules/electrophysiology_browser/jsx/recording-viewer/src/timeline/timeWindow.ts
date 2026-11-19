import {TimeRange} from './types';

/** Clamp and order a time window so it remains inside the recording. */
export function normalizeTimeWindow(
  timeWindow: TimeRange,
  recordingTimeRange: TimeRange
): TimeRange {
  const [recordingStart, recordingEnd] = recordingTimeRange;
  const start = Math.max(
    recordingStart,
    Math.min(recordingEnd, Math.min(timeWindow[0], timeWindow[1]))
  );
  const end = Math.max(
    recordingStart,
    Math.min(recordingEnd, Math.max(timeWindow[0], timeWindow[1]))
  );

  return [start, end];
}

/** Move a time window without changing its size or leaving the recording. */
export function shiftTimeWindow(
  timeWindow: TimeRange,
  offset: number,
  recordingTimeRange: TimeRange
): TimeRange {
  const normalizedWindow = normalizeTimeWindow(
    timeWindow,
    recordingTimeRange
  );
  const windowSize = normalizedWindow[1] - normalizedWindow[0];
  const recordingSize = recordingTimeRange[1] - recordingTimeRange[0];

  if (windowSize >= recordingSize) {
    return [recordingTimeRange[0], recordingTimeRange[1]];
  }

  const start = Math.max(
    recordingTimeRange[0],
    Math.min(
      recordingTimeRange[1] - windowSize,
      normalizedWindow[0] + offset
    )
  );

  return [start, start + windowSize];
}
