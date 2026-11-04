import {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import swal from 'sweetalert2';
import {useEvents} from '../events/state/EventContext';
import {useRightPanel} from '../viewer/RightPanelContext';
import {useTimeSelection} from '../timeline/TimeSelectionContext';

/** Own unsaved-form protection and the channels attached to an annotation. */
export function useAnnotationPanel() {
  const {t} = useTranslation();
  const {events, activeEvent, setActiveEvent} = useEvents();
  const {rightPanel} = useRightPanel();
  const {setTimeSelection} = useTimeSelection();
  const [panelIsDirty, setPanelIsDirty] = useState(false);
  const [eventChannels, setEventChannels] = useState<string[]>([]);
  const hasMounted = useRef(false);

  useEffect(() => {
    /** Ask the browser to protect edits that have not been saved. */
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!panelIsDirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [panelIsDirty]);

  useEffect(() => {
    setEventChannels(activeEvent === null
      ? []
      : events[activeEvent]?.channels ?? []);
  }, [activeEvent, events]);

  useEffect(() => {
    if (rightPanel === 'annotationForm') return;
    if (hasMounted.current) setActiveEvent(null);
    else hasMounted.current = true;
    setEventChannels([]);
    setTimeSelection(null);
  }, [rightPanel, setActiveEvent, setTimeSelection]);

  const confirmPanelClose = useCallback(async (
    closePanel: () => void
  ) => {
    if (panelIsDirty) {
      const result = await swal.fire({
        title: t('Are you sure?', {ns: 'loris'}),
        text: t(
          'Leaving the form will result in the loss of any information '
            + 'entered.',
          {ns: 'loris'}
        ),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: t('Proceed', {ns: 'loris'}),
        cancelButtonText: t('Cancel', {ns: 'loris'}),
      });
      if (!result.value) return false;
      setPanelIsDirty(false);
    }
    closePanel();
    setActiveEvent(null);
    return true;
  }, [panelIsDirty, setActiveEvent, t]);

  return {
    panelIsDirty,
    setPanelIsDirty,
    eventChannels,
    setEventChannels,
    confirmPanelClose,
  };
}
