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
  hitTest: (position: [number, number]) => number[],
};

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

    const channelIndices = cursor.cursorPosition === null
      ? []
      : cursor.hitTest(cursor.cursorPosition);
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
