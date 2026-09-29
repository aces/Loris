import {MutableRefObject} from 'react';
import {Channel, ChannelMetadata} from '../../domain/types';
import {useCursorPosition} from '../state/CursorContext';
import {useEvents} from '../../events/state/EventContext';
import {
  CursorContentProps,
  CursorLine,
  CursorTimeMarker,
  CursorValueTags,
  DefaultCursorContent,
} from './SignalCursorOverlay';

type SignalCursorProps = {
  cursorRef: MutableRefObject<any>,
  channels: Channel[],
  CursorContent: (_: CursorContentProps) => JSX.Element,
  timeWindow: [number, number],
  showEvents: boolean,
  enabled: boolean,
  channelMetadata: ChannelMetadata[],
};

/** Events and their visibility are read from EventContext. */
function SignalCursor({
  cursorRef,
  channels,
  CursorContent,
  timeWindow,
  showEvents,
  enabled,
  channelMetadata,
}: SignalCursorProps) {
  const cursorPosition = useCursorPosition();
  const {
    events,
    eventFilter: {plotVisibility: visibleEventIndices},
  } = useEvents();
  if (cursorPosition === null) return null;

  const left = `${Math.min(Math.max(100 * cursorPosition[0], 0), 100)}%`;
  const time = timeWindow[0]
    + cursorPosition[0] * (timeWindow[1] - timeWindow[0]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      <CursorLine cursorRef={cursorRef} left={left}/>
      {enabled && (
        <CursorValueTags
          left={left}
          time={time}
          channels={channels}
          CursorContent={CursorContent}
          showEvents={showEvents}
          channelMetadata={channelMetadata}
        />
      )}
      <CursorTimeMarker
        left={left}
        time={time}
        timeWindow={timeWindow}
        channels={channels}
        events={events}
        visibleEventIndices={visibleEventIndices}
        showEvents={showEvents}
        channelMetadata={channelMetadata}
      />
    </div>
  );
}

SignalCursor.defaultProps = {
  channels: [],
  CursorContent: DefaultCursorContent,
  showEvents: false,
  enabled: false,
};

export default SignalCursor;
