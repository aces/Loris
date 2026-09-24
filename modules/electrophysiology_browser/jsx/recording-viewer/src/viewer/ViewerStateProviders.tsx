import React from 'react';
import {AmplitudeProvider} from '../signals/state/AmplitudeContext';
import {PassFilterProvider} from '../signals/state/PassFilterContext';
import {TimeSelectionProvider} from '../timeline/TimeSelectionContext';
import {TimeWindowProvider} from '../timeline/TimeWindowContext';
import {RightPanelProvider} from './RightPanelContext';
import {CursorProvider} from '../signals/state/CursorContext';
import {CurrentAnnotationProvider} from '../annotations/state/CurrentAnnotationContext';
import {EventProvider} from '../events/state/EventContext';
import {RecordingEvent} from '../domain/types';
import {RecordingMetadata, RecordingProvider} from '../recording/RecordingContext';
import {HEDProvider, HEDState} from '../hed/state/HEDContext';

/**
 * Compose the React state providers used by the signal viewer.
 */
export function ViewerStateProviders({
  children,
  events,
  recordingMetadata,
  initialLimit,
  initialHEDState,
  unsavedChangesMessage,
}: {
  children: React.ReactNode,
  events: RecordingEvent[],
  recordingMetadata: RecordingMetadata,
  initialLimit: number,
  initialHEDState: HEDState,
  unsavedChangesMessage: string,
}) {
  return (
    <RecordingProvider metadata={recordingMetadata} initialLimit={initialLimit}>
      <HEDProvider
        initialState={initialHEDState}
        unsavedChangesMessage={unsavedChangesMessage}
      >
        <RightPanelProvider>
          <CursorProvider>
            <CurrentAnnotationProvider>
              <PassFilterProvider>
                <AmplitudeProvider>
                  <TimeWindowProvider>
                    <EventProvider initialEvents={events}>
                      <TimeSelectionProvider>
                        {children}
                      </TimeSelectionProvider>
                    </EventProvider>
                  </TimeWindowProvider>
                </AmplitudeProvider>
              </PassFilterProvider>
            </CurrentAnnotationProvider>
          </CursorProvider>
        </RightPanelProvider>
      </HEDProvider>
    </RecordingProvider>
  );
}
