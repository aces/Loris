import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {MIN_INTERVAL} from '../shared/constants';
import {roundTime} from '../shared/utils';
import {useTimeWindow} from './TimeWindowContext';
import {TimeRange} from './types';

export type TimeSelection = TimeRange | null;

type TimeSelectionContextValue = {
  timeSelection: TimeSelection,
  setTimeSelection: (_: TimeSelection) => void,
  startTimeSelection: (_: number) => void,
  continueTimeSelection: (_: number) => void,
  endTimeSelection: () => void,
  selectionCanBeZoomedTo: boolean,
  zoomToSelection: () => void,
}

const TimeSelectionContext = createContext<
  TimeSelectionContextValue | undefined
>(undefined);

/** Time selection provider component. */
export function TimeSelectionProvider({children}: {
  children: React.ReactNode,
}) {
  const {timeWindow, setTimeWindow} = useTimeWindow();
  const [timeSelection, setTimeSelection] = useState<TimeSelection>(null);

  const getTimeAtPosition = useCallback((position: number) => {
    return roundTime(
      timeWindow[0] + position * (timeWindow[1] - timeWindow[0])
    );
  }, [timeWindow]);

  const startTimeSelection = useCallback((position: number) => {
    const time = getTimeAtPosition(position);
    setTimeSelection([time, time]);
  }, [getTimeAtPosition]);

  const continueTimeSelection = useCallback((position: number) => {
    const time = getTimeAtPosition(position);
    setTimeSelection((selection) => (
      selection === null ? null : [selection[0], time]
    ));
  }, [getTimeAtPosition]);

  const endTimeSelection = useCallback(() => {
    setTimeSelection((selection) => (
      selection !== null
      && Math.abs(selection[1] - selection[0]) < MIN_INTERVAL
        ? null
        : selection
    ));
  }, []);
  const selectionCanBeZoomedTo = timeSelection !== null
    && Math.abs(timeSelection[1] - timeSelection[0]) >= MIN_INTERVAL;
  const zoomToSelection = useCallback(() => {
    if (timeSelection === null || !selectionCanBeZoomedTo) return;
    setTimeWindow([
      roundTime(Math.min(timeSelection[0], timeSelection[1]), 1),
      roundTime(Math.max(timeSelection[0], timeSelection[1]), 1),
    ]);
  }, [selectionCanBeZoomedTo, setTimeWindow, timeSelection]);

  const value = useMemo(() => ({
    timeSelection,
    setTimeSelection,
    startTimeSelection,
    continueTimeSelection,
    endTimeSelection,
    selectionCanBeZoomedTo,
    zoomToSelection,
  }), [
    continueTimeSelection,
    endTimeSelection,
    startTimeSelection,
    timeSelection,
    selectionCanBeZoomedTo,
    zoomToSelection,
  ]);

  return (
    <TimeSelectionContext.Provider value={value}>
      {children}
    </TimeSelectionContext.Provider>
  );
}

/**
 */
export function useTimeSelection(): TimeSelectionContextValue {
  const context = useContext(TimeSelectionContext);
  if (context === undefined) {
    throw new Error(
      'useTimeSelection must be used within a TimeSelectionProvider'
    );
  }
  return context;
}
