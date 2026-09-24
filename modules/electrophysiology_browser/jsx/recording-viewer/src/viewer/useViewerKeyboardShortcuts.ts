import {MutableRefObject, useEffect, useState} from 'react';
import {RightPanelView, useRightPanel} from './RightPanelContext';

type KeyboardShortcutActions = {
  cursorRef: MutableRefObject<HTMLElement | null>,
  limit: number,
  offsetIndex: number,
  updateOffsetIndex: (_: number) => void,
  moveByWindow: (_: -1 | 1) => void,
  toggleCursor: () => void,
  toggleStackedView: () => void,
  stackedView: boolean,
  toggleSingleMode: () => void,
  zoomToSelection: () => void,
  resetZoom: () => void,
  zoomOut: () => void,
  zoomIn: () => void,
  scaleAmplitude: (_: number) => void,
};

/** Map a keyboard shortcut to the panel it opens. */
function panelForShortcut(code: string): RightPanelView | null {
  if (code === 'KeyA') return 'annotationForm';
  if (code === 'KeyE') return 'eventList';
  if (code === 'KeyH') return 'hedEndorsement';
  return null;
}

const RELAYED_PANEL_KEYS = ['KeyC', 'KeyE', 'KeyM', 'Enter'];

/** Own global keyboard shortcuts and the key relayed to the right panel. */
export function useViewerKeyboardShortcuts({
  cursorRef,
  limit,
  offsetIndex,
  updateOffsetIndex,
  moveByWindow,
  toggleCursor,
  toggleStackedView,
  stackedView,
  toggleSingleMode,
  zoomToSelection,
  resetZoom,
  zoomOut,
  zoomIn,
  scaleAmplitude,
}: KeyboardShortcutActions): string {
  const {rightPanel, setRightPanel} = useRightPanel();
  const [pressedKey, setPressedKey] = useState('');

  useEffect(() => {
    /** Apply viewer shortcuts while respecting focused controls. */
    function handleKeyDown(event: KeyboardEvent) {
      const cursorIsVisible = cursorRef.current !== null;
      const isHedSearchFocused = document.activeElement?.id === 'hed-search';
      const isArrow = event.code.startsWith('Arrow');

      if (!isHedSearchFocused && rightPanel && event.shiftKey && isArrow) {
        event.preventDefault();
        setPressedKey(event.code);
      } else if (!isHedSearchFocused && cursorIsVisible && !event.shiftKey) {
        if (isArrow) event.preventDefault();
        if (event.code === 'ArrowUp') {
          updateOffsetIndex(offsetIndex - limit);
        }
        if (event.code === 'ArrowDown') {
          updateOffsetIndex(offsetIndex + limit);
        }
        if (event.code === 'ArrowRight') moveByWindow(1);
        if (event.code === 'ArrowLeft') moveByWindow(-1);
      }

      if (rightPanel && event.ctrlKey
        && RELAYED_PANEL_KEYS.includes(event.code)) {
        setPressedKey(event.code);
      }
      if (!cursorIsVisible || !event.shiftKey) return;

      const panel = panelForShortcut(event.code);
      if (panel !== null) setRightPanel(panel);
      if (event.code === 'KeyV') toggleCursor();
      if (event.code === 'KeyB') toggleStackedView();
      if (event.code === 'KeyS' && stackedView) toggleSingleMode();
      if (event.code === 'KeyZ') zoomToSelection();
      if (event.code === 'KeyX') resetZoom();
      if (event.code === 'Minus') zoomOut();
      if (event.code === 'Equal') zoomIn();
      if (event.code === 'KeyN') scaleAmplitude(1.1);
      if (event.code === 'KeyM') scaleAmplitude(0.9);
    }

    /** Clear transient arrow-key state after the key is released. */
    function handleKeyUp(event: KeyboardEvent) {
      if (event.code.startsWith('Arrow')) setPressedKey('');
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    cursorRef, limit, moveByWindow, offsetIndex, rightPanel, scaleAmplitude,
    setRightPanel, stackedView, toggleCursor, toggleSingleMode,
    resetZoom, toggleStackedView, updateOffsetIndex, zoomIn, zoomOut,
    zoomToSelection,
  ]);

  return pressedKey;
}
