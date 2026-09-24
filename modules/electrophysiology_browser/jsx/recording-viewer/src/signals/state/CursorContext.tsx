import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import {HoveredChannelsContext} from '../../recording/RecordingDataProvider';

type CursorPosition = [number, number] | null;
type Cursor = {
  cursorPosition: CursorPosition,
  viewerRef: React.MutableRefObject<SVGSVGElement | null>,
};

const CURSOR_HIT_RADIUS = 10;

const CursorPositionContext = createContext<CursorPosition>(null);
const SetCursorContext = createContext<((_: Cursor | null) => void) | undefined>(
  undefined
);

/** Own the signal viewer cursor and derive the channels beneath it. */
export function CursorProvider({children}: {
  children: React.ReactNode,
}) {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>(null);
  const {setHoveredChannels} = useContext(HoveredChannelsContext);

  const setCursor = useCallback((cursor: Cursor | null) => {
    if (cursor === null) {
      setCursorPosition(null);
      setHoveredChannels([]);
      return;
    }

    setCursorPosition(cursor.cursorPosition);

    const channelIndices = getChannelsAtCursor(
      cursor.cursorPosition,
      cursor.viewerRef
    );
    setHoveredChannels((previousChannelIndices) => (
      arraysEqual(previousChannelIndices, channelIndices)
        ? previousChannelIndices
        : channelIndices
    ));
  }, [setHoveredChannels]);

  return (
    <SetCursorContext.Provider value={setCursor}>
      <CursorPositionContext.Provider value={cursorPosition}>
        {children}
      </CursorPositionContext.Provider>
    </SetCursorContext.Provider>
  );
}

/** Read the current normalized cursor position. */
export function useCursorPosition(): CursorPosition {
  return useContext(CursorPositionContext);
}

/** Update the cursor without subscribing to its rapidly changing position. */
export function useSetCursor(): (_: Cursor | null) => void {
  const setCursor = useContext(SetCursorContext);
  if (setCursor === undefined) {
    throw new Error('useSetCursor must be used within a CursorProvider');
  }
  return setCursor;
}

/** Arrays equal. */
function arraysEqual(left: number[], right: number[]): boolean {
  return left.length === right.length
    && left.every((value, index) => value === right[index]);
}

/** Get channels at cursor. */
function getChannelsAtCursor(
  cursorPosition: CursorPosition,
  viewerRef: React.MutableRefObject<SVGSVGElement | null>
): number[] {
  if (cursorPosition === null || viewerRef.current === null) {
    return [];
  }

  const viewerElement = viewerRef.current;
  const {top, left, width, height} = viewerElement.getBoundingClientRect();
  const cursorX = cursorPosition[0] * width + left;
  const cursorY = cursorPosition[1] * height + top;
  let closestChannel: number | null = null;
  let closestDistance = CURSOR_HIT_RADIUS + 1;

  viewerElement.querySelectorAll<SVGPathElement>('path[class*="channel-"]')
    .forEach((path) => {
      const channelIndex = getChannelIndex(path);
      const point = getPathPointAtScreenX(path, cursorX);
      if (channelIndex === null || point === null) {
        return;
      }

      const distance = Math.abs(point.y - cursorY);
      if (distance < closestDistance) {
        closestChannel = channelIndex;
        closestDistance = distance;
      }
    });

  return closestChannel === null ? [] : [closestChannel];
}

/** Get channel index. */
function getChannelIndex(path: SVGPathElement): number | null {
  const className = Array.from(path.classList)
    .find((name) => name.startsWith('channel-'));
  if (className === undefined) {
    return null;
  }

  const channelIndex = Number.parseInt(className.slice('channel-'.length), 10);
  return Number.isNaN(channelIndex) ? null : channelIndex;
}

/** Find a point on an X-monotonic signal path at the requested screen X. */
function getPathPointAtScreenX(
  path: SVGPathElement,
  screenX: number
): DOMPoint | null {
  const matrix = path.getScreenCTM();
  if (matrix === null) {
    return null;
  }

  const totalLength = path.getTotalLength();
  const firstPoint = path.getPointAtLength(0).matrixTransform(matrix);
  const lastPoint = path.getPointAtLength(totalLength).matrixTransform(matrix);
  if (screenX < firstPoint.x || screenX > lastPoint.x) {
    return null;
  }

  let lowerLength = 0;
  let upperLength = totalLength;
  let point = firstPoint;
  for (let iteration = 0; iteration < 12; iteration += 1) {
    const length = (lowerLength + upperLength) / 2;
    point = path.getPointAtLength(length).matrixTransform(matrix);
    if (point.x < screenX) {
      lowerLength = length;
    } else {
      upperLength = length;
    }
  }

  return point;
}
