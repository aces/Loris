import {useCallback, useReducer} from 'react';

type ViewerDisplayState = {
  cursorEnabled: boolean,
  withDCOffset: boolean,
  stackedView: boolean,
  singleMode: boolean,
  showOverflow: boolean,
};

type ViewerDisplayOption = keyof ViewerDisplayState;

const initialDisplayState: ViewerDisplayState = {
  cursorEnabled: false,
  withDCOffset: true,
  stackedView: false,
  singleMode: false,
  showOverflow: false,
};

/** Toggle one display option while preserving display-state invariants. */
function toggleDisplayOption(
  state: ViewerDisplayState,
  option: ViewerDisplayOption
): ViewerDisplayState {
  const nextState = {...state, [option]: !state[option]};
  if (option === 'stackedView' && !nextState.stackedView) {
    nextState.singleMode = false;
  }
  return nextState;
}

/** Own the independent signal display toggles. */
export function useViewerDisplay() {
  const [state, toggle] = useReducer(toggleDisplayOption, initialDisplayState);
  const toggleCursor = useCallback(() => toggle('cursorEnabled'), []);
  const toggleDCOffset = useCallback(() => toggle('withDCOffset'), []);
  const toggleStackedView = useCallback(() => toggle('stackedView'), []);
  const toggleSingleMode = useCallback(() => toggle('singleMode'), []);
  const toggleShowOverflow = useCallback(() => toggle('showOverflow'), []);

  return {
    ...state,
    toggleCursor,
    toggleDCOffset,
    toggleStackedView,
    toggleSingleMode,
    toggleShowOverflow,
  };
}
