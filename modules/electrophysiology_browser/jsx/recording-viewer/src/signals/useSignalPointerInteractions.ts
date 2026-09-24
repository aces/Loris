import React, {useRef} from 'react';
import {useSetCursor} from './state/CursorContext';
import {useTimeSelection} from '../timeline/TimeSelectionContext';

/** Convert an SVG pointer event to coordinates in the unit square. */
function getPointerPosition(
  event: React.PointerEvent<SVGSVGElement>
): [number, number] {
  const {left, top, width, height} =
    event.currentTarget.getBoundingClientRect();
  return [
    Math.min(1, Math.max(0, (event.clientX - left) / width)),
    Math.min(1, Math.max(0, (event.clientY - top) / height)),
  ];
}

/** Own SVG pointer tracking and drag-to-select behavior. */
export function useSignalPointerInteractions() {
  const viewerRef = useRef<SVGSVGElement | null>(null);
  const setCursor = useSetCursor();
  const {startTimeSelection, continueTimeSelection, endTimeSelection} =
    useTimeSelection();

  /** Update the cursor and extend an active selection. */
  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const cursorPosition = getPointerPosition(event);
    setCursor({cursorPosition, viewerRef});
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      continueTimeSelection(cursorPosition[0]);
    }
  }

  /** Begin a selection for the primary pointer button. */
  function handlePointerDown(event: React.PointerEvent<SVGSVGElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    startTimeSelection(getPointerPosition(event)[0]);
  }

  /** Finish a captured pointer selection. */
  function handlePointerUp(event: React.PointerEvent<SVGSVGElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    endTimeSelection();
  }

  /** Release capture and finish a cancelled pointer selection. */
  function handlePointerCancel(event: React.PointerEvent<SVGSVGElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    endTimeSelection();
  }

  /** Clear the cursor after an uncaptured pointer leaves the viewer. */
  function handlePointerLeave(event: React.PointerEvent<SVGSVGElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      setCursor(null);
    }
  }

  return {
    viewerRef,
    handlePointerMove,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
    handlePointerLeave,
  };
}
