import {useState, useLayoutEffect, useMemo, useCallback} from 'react';

const OVERSCAN = 10;
const DEFAULT_HEIGHTS: {[kind: string]: number} = {record: 45, group: 37};

/**
 * Finds the last item that starts at or above a position
 *
 * @param offsets - where each item starts, then where the last one ends
 * @param position - the position, from the top of the first item
 */
function itemAt(offsets: number[], position: number): number {
  let low = 0;
  let high = offsets.length - 2;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (offsets[mid] <= position) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }
  return Math.max(low, 0);
}

/**
 * Picks the rows of a long list that are in view, so only those are drawn.
 * Rows of one kind share one height, measured from a drawn row. Drawn rows
 * carry their kind in `data-row-kind`.
 *
 * @param scroll - the element that scrolls the rows
 * @param body - the element holding the rows, below any sticky header
 * @param kinds - each row's kind, in order
 */
export function useRowWindow(
  scroll: HTMLElement | null,
  body: HTMLElement | null,
  kinds: string[],
) {
  const [heights, setHeights] = useState(DEFAULT_HEIGHTS);
  const [view, setView] = useState({top: 0, height: 1000, bodyTop: 0});

  const offsets = useMemo(() => {
    const result = new Array(kinds.length + 1);
    result[0] = 0;
    kinds.forEach((kind, i) => {
      result[i + 1] = result[i] + (heights[kind] || DEFAULT_HEIGHTS.record);
    });
    return result;
  }, [kinds, heights]);

  /**
   * Reads where the rows are scrolled to and how much of them shows
   */
  const measure = useCallback(() => {
    if (!scroll || !body) {
      return;
    }
    const bodyTop = body.getBoundingClientRect().top
      - scroll.getBoundingClientRect().top + scroll.scrollTop;
    const next = {
      top: scroll.scrollTop, height: scroll.clientHeight, bodyTop,
    };
    setView((prev) => prev.top === next.top && prev.height === next.height
      && prev.bodyTop === next.bodyTop ? prev : next);
  }, [scroll, body]);

  useLayoutEffect(() => {
    if (!scroll) {
      return;
    }
    measure();
    let frame = 0;
    /**
     * Measures once per frame while scrolling
     */
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    scroll.addEventListener('scroll', onScroll, {passive: true});
    const observer = new ResizeObserver(measure);
    observer.observe(scroll);
    return () => {
      cancelAnimationFrame(frame);
      scroll.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [scroll, measure]);

  // A drawn row of each kind gives that kind's height. The header above the
  // rows can change height too, so the view is read again after each render.
  useLayoutEffect(() => {
    if (!body) {
      return;
    }
    measure();
    const measured = {...heights};
    let changed = false;
    Object.keys(DEFAULT_HEIGHTS).forEach((kind) => {
      const row = body.querySelector(`[data-row-kind="${kind}"]`);
      const height = row && row.getBoundingClientRect().height;
      if (height && Math.abs(height - measured[kind]) > 0.5) {
        measured[kind] = height;
        changed = true;
      }
    });
    if (changed) {
      setHeights(measured);
    }
  });

  const total = offsets[kinds.length];
  const top = view.top - view.bodyTop;
  const bottom = view.top + view.height - view.bodyTop;
  const empty = kinds.length === 0;
  const firstShown = empty ? 0 : itemAt(offsets, Math.max(top, 0));
  const lastShown = empty ? -1 : itemAt(offsets, Math.max(bottom - 1, 0));
  const start = Math.max(0, firstShown - OVERSCAN);
  const end = Math.min(kinds.length, lastShown + 1 + OVERSCAN);

  /**
   * Scrolls just enough to bring a row fully into view
   *
   * @param index - the row's position in the list
   */
  const scrollToItem = useCallback((index: number) => {
    if (!scroll || index < 0 || index >= kinds.length) {
      return;
    }
    let next = scroll.scrollTop;
    if (offsets[index] < next) {
      next = offsets[index];
    } else if (view.bodyTop + offsets[index + 1] > next + scroll.clientHeight) {
      next = view.bodyTop + offsets[index + 1] - scroll.clientHeight;
    }
    if (next !== scroll.scrollTop) {
      scroll.scrollTop = next;
      measure();
    }
  }, [scroll, kinds.length, offsets, view.bodyTop, measure]);

  return {
    start,
    end,
    before: offsets[start],
    after: total - offsets[end],
    firstShown,
    lastShown,
    scrollToItem,
  };
}
