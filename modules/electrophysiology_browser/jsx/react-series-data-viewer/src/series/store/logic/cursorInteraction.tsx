import * as R from 'ramda';
import {Observable} from 'rxjs';
import * as Rx from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {createAction} from 'redux-actions';
import {setCursor} from '../state/cursor';
import {Cursor} from '../types';

export const SET_CURSOR_INTERACTION = 'SET_CURSOR_INTERACTION';
export const setCursorInteraction = createAction(SET_CURSOR_INTERACTION);

export type Action = (_: (_: any) => void) => void;

/**
 * createChannelInteractionEpic
 *
 * @param {Function} fromState - A function to parse the current state
 * @returns {Observable<Action>} - A stream of actions
 */
export const createCursorInteractionEpic = (fromState: (_: any) => any) => (
  action$: Observable<any>,
  state$: Observable<any>
): Observable<Action> => {
  return action$.pipe(
    ofType(SET_CURSOR_INTERACTION),
    Rx.map(R.prop('payload')),
    Rx.withLatestFrom(state$),
    Rx.map<[Cursor, any], any>(([cursor, state]) => {
      if (cursor === null) {
        return (dispatch) => {
          dispatch(setCursor(null));
        };
      }

      const {
        cursorPosition,
        viewerRef,
        hoveredChannels = [],
        setHoveredChannels = () => undefined,
      } = cursor;

      const channelElements = getChannelsAtCursor(
        cursorPosition,
        viewerRef
      );

      const channelIndices = channelElements.map((element) => {
        const className = Array.from(element.classList)
          .find((name) => name.includes('channel'));
        return parseInt(className.split('-')[1]);
      }).reverse();

      return (dispatch) => {
        dispatch(setCursor(cursorPosition));
        if (
          JSON.stringify(hoveredChannels) !== JSON.stringify(channelIndices)
        ) {
          setHoveredChannels(channelIndices);
        }
      };
    })
  );
};


/**
 * getChannelsAtCursor
 *
 * @param {[number, number]} cursorPosition - Cursor position from mouseMove callback
 * @param {object} viewerRef - Reference to corresponding ResponsiveViewer
 * @returns {Array} - The output signal
 */
const getChannelsAtCursor = (cursorPosition, viewerRef) => {
  if (cursorPosition === null || viewerRef === null) return [];

  const viewerElement = viewerRef.current.container;
  const {
    top,
    left,
    width,
    height,
  } = viewerElement.getBoundingClientRect();

  return document.elementsFromPoint(
    (cursorPosition[0] * width) + left,
    (cursorPosition[1] * height) + top
  ).filter((element) => element.tagName === 'path');
};
