import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {MAX_RENDERED_EVENTS} from '../../shared/constants';
import {RecordingEvent, EventFilter} from '../../domain/types';
import {TimeRange} from '../../timeline/types';
import {useTimeWindow} from '../../timeline/TimeWindowContext';

type EventContextValue = {
  activeEvent: number | null,
  events: RecordingEvent[],
  eventFilter: EventFilter,
  setActiveEvent: (_: number | null) => void,
  setEventFilter: React.Dispatch<React.SetStateAction<EventFilter>>,
  setEvents: React.Dispatch<React.SetStateAction<RecordingEvent[]>>,
  toggleEvent: (_: number) => void,
  showEventsInRange: (_: TimeRange) => void,
};

const EMPTY_FILTER: EventFilter = {
  plotVisibility: [],
  columnVisibility: [],
  searchVisibility: [],
};

const EventContext = createContext<EventContextValue | undefined>(undefined);

/** Own event visibility and the event currently highlighted in the viewer. */
export function EventProvider({children, initialEvents}: {
  children: React.ReactNode,
  initialEvents: RecordingEvent[],
}) {
  const {recordingTimeRange} = useTimeWindow();
  const initialized = useRef(false);
  const initialEventsApplied = useRef(initialEvents.length > 0);
  const [events, setEvents] = useState<RecordingEvent[]>(initialEvents);
  const [activeEvent, updateActiveEvent] = useState<number | null>(null);
  const [eventFilter, setEventFilter] = useState<EventFilter>(EMPTY_FILTER);

  useEffect(() => {
    if (!initialEventsApplied.current && initialEvents.length > 0) {
      initialEventsApplied.current = true;
      setEvents(initialEvents);
    }
  }, [initialEvents]);

  useEffect(() => {
    if (initialized.current || events.length === 0) {
      return;
    }

    initialized.current = true;
    setEventFilter((currentFilter) => ({
      ...currentFilter,
      plotVisibility: events.reduce((indices, event, index) => {
        // Full-recording events are hidden by default.
        if (!(event.onset < 1 && event.duration >= recordingTimeRange[1])) {
          indices.push(index);
        }
        return indices;
      }, [] as number[]),
    }));
  }, [events, recordingTimeRange]);

  const setActiveEvent = useCallback((index: number | null) => {
    if (index === null || index >= 0) {
      updateActiveEvent(index);
    }
  }, []);

  const toggleEvent = useCallback((index: number) => {
    if (index < 0 || index >= events.length) {
      return;
    }

    setEventFilter((currentFilter) => {
      const plotVisibility = currentFilter.plotVisibility.includes(index)
        ? currentFilter.plotVisibility.filter((eventIndex) => eventIndex !== index)
        : [...currentFilter.plotVisibility, index].sort((a, b) => a - b);
      return {...currentFilter, plotVisibility};
    });
  }, [events.length]);

  const showEventsInRange = useCallback((timeRange: TimeRange) => {
    let plotVisibility = events
      .map((_, index) => index)
      .filter((index) => (
        events[index].onset + events[index].duration > timeRange[0]
        && events[index].onset < timeRange[1]
      ));
    if (plotVisibility.length >= MAX_RENDERED_EVENTS) {
      plotVisibility = [];
    }
    setEventFilter((currentFilter) => ({
      ...currentFilter,
      plotVisibility,
    }));
  }, [events]);

  const value = useMemo(() => ({
    activeEvent,
    events,
    eventFilter,
    setActiveEvent,
    setEventFilter,
    setEvents,
    toggleEvent,
    showEventsInRange,
  }), [
    activeEvent,
    events,
    eventFilter,
    setActiveEvent,
    showEventsInRange,
    toggleEvent,
  ]);

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

/** Use events. */
export const useEvents = (): EventContextValue => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
