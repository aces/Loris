import {useState, useLayoutEffect, RefObject, CSSProperties} from 'react';

const GAP = 4;

/**
 * Places an open dropdown panel over the page, against the control that
 * opened it, so a scrolling or narrow container never clips it. The panel
 * opens below the control, or above it when only that side has room, and
 * stays inside the window. It follows the control as the page scrolls.
 *
 * @param anchor - the control the panel belongs to
 * @param panel - the open panel
 * @param open - whether the panel is shown
 * @param align - "start" lines the panel up with the control's left
 *                edge, "end" with its right edge
 * @return the panel's position
 */
export default function useFloatingPanel(
  anchor: RefObject<HTMLElement | null>,
  panel: RefObject<HTMLElement | null>,
  open: boolean,
  align: 'start' | 'end' = 'start',
): CSSProperties {
  const [place, setPlace] = useState<CSSProperties>({visibility: 'hidden'});

  useLayoutEffect(() => {
    if (!open || !anchor.current || !panel.current) {
      setPlace({visibility: 'hidden'});
      return;
    }
    const target = panel.current;
    /**
     * Moves the panel against the control
     */
    const position = () => {
      if (!anchor.current) {
        return;
      }
      const field = anchor.current.getBoundingClientRect();
      const box = target.getBoundingClientRect();
      const below = window.innerHeight - field.bottom;
      const top = below < box.height + GAP && field.top > below
        ? Math.max(GAP, field.top - box.height - GAP)
        : field.bottom + GAP;
      const wanted = align === 'end' ? field.right - box.width : field.left;
      const left = Math.max(
        GAP,
        Math.min(wanted, window.innerWidth - box.width - GAP)
      );
      setPlace({top, left, minWidth: field.width});
    };
    position();
    const resized = new ResizeObserver(position);
    resized.observe(target);
    window.addEventListener('scroll', position, true);
    window.addEventListener('resize', position);
    return () => {
      resized.disconnect();
      window.removeEventListener('scroll', position, true);
      window.removeEventListener('resize', position);
    };
  }, [open, align]);

  return place;
}
