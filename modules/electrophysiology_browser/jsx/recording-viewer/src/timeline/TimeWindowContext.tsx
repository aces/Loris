import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {DEFAULT_TIME_WINDOW} from '../shared/constants';
import {TimeRange} from './types';
import {normalizeTimeWindow, shiftTimeWindow} from './timeWindow';
import {useRecording} from '../recording/RecordingContext';

type TimeWindowContextValue = {
  recordingTimeRange: TimeRange,
  timeWindow: TimeRange,
  setTimeWindow: (_: TimeRange) => void,
  zoomIn: () => void,
  zoomOut: () => void,
  resetZoom: () => void,
  moveByWindow: (_: -1 | 1) => void,
}

const TimeWindowContext = createContext<TimeWindowContextValue | undefined>(
  undefined
);

/** Time window provider component. */
export function TimeWindowProvider({children}: {
  children: React.ReactNode,
}) {
  const {timeInterval: recordingTimeRange} = useRecording();
  const [timeWindow, updateTimeWindow] = useState<TimeRange>(() =>
    normalizeTimeWindow(DEFAULT_TIME_WINDOW, recordingTimeRange)
  );

  const setTimeWindow = useCallback((nextTimeWindow: TimeRange) => {
    updateTimeWindow(normalizeTimeWindow(
      nextTimeWindow,
      recordingTimeRange
    ));
  }, [recordingTimeRange]);

  useEffect(() => {
    updateTimeWindow((currentTimeWindow) => normalizeTimeWindow(
      currentTimeWindow,
      recordingTimeRange
    ));
  }, [recordingTimeRange]);

  const duration = timeWindow[1] - timeWindow[0];
  const zoomStep = 10 ** Math.max(
    Math.floor(Math.log10(duration)) - 1,
    -1
  );
  const zoomIn = useCallback(() => {
    const step = duration < 2 * zoomStep
      ? 0
      : duration === 2 * zoomStep ? zoomStep / 2 : zoomStep;
    setTimeWindow([timeWindow[0] + step, timeWindow[1] - step]);
  }, [duration, setTimeWindow, timeWindow, zoomStep]);
  const zoomOut = useCallback(() => {
    setTimeWindow([timeWindow[0] - zoomStep, timeWindow[1] + zoomStep]);
  }, [setTimeWindow, timeWindow, zoomStep]);
  const resetZoom = useCallback(() => {
    const defaultDuration = DEFAULT_TIME_WINDOW[1] - DEFAULT_TIME_WINDOW[0];
    const midpoint = (timeWindow[0] + timeWindow[1]) / 2;
    setTimeWindow(shiftTimeWindow(
      [midpoint - defaultDuration / 2, midpoint + defaultDuration / 2],
      0,
      recordingTimeRange
    ));
  }, [recordingTimeRange, setTimeWindow, timeWindow]);
  const moveByWindow = useCallback((direction: -1 | 1) => {
    setTimeWindow(shiftTimeWindow(
      timeWindow,
      direction * duration,
      recordingTimeRange
    ));
  }, [duration, recordingTimeRange, setTimeWindow, timeWindow]);

  const value = useMemo(() => ({
    recordingTimeRange,
    timeWindow,
    setTimeWindow,
    zoomIn,
    zoomOut,
    resetZoom,
    moveByWindow,
  }), [
    moveByWindow,
    recordingTimeRange,
    resetZoom,
    setTimeWindow,
    timeWindow,
    zoomIn,
    zoomOut,
  ]);

  return (
    <TimeWindowContext.Provider value={value}>
      {children}
    </TimeWindowContext.Provider>
  );
}

/**
 */
export function useTimeWindow(): TimeWindowContextValue {
  const context = useContext(TimeWindowContext);
  if (context === undefined) {
    throw new Error('useTimeWindow must be used within a TimeWindowProvider');
  }
  return context;
}
