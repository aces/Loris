import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {createPortal} from 'react-dom';
import './Tooltip.css';

type Placement = 'top' | 'bottom' | 'left' | 'right';

type TooltipProps = {
  // What the tooltip shows. The element is rendered without a tooltip when
  // this is empty.
  content: ReactNode;
  // The element the tooltip describes. It must pass `aria-describedby` and
  // the pointer and focus handlers on to a DOM element.
  children: ReactElement;
  // The preferred side of the element. It flips to the opposite side when
  // there is no room.
  placement?: Placement;
  // Milliseconds before a hover opens the tooltip.
  delay?: number;
};

const GAP = 8;
const MARGIN = 4;
const CLOSE_DELAY = 100;

const OPPOSITE: Record<Placement, Placement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

/**
 * Whether there is room for the tooltip on one side of the trigger.
 *
 * @param placement The side to test
 * @param trigger The trigger's bounds
 * @param tip The tooltip's size
 * @returns True if the tooltip fits on that side
 */
function fits(placement: Placement, trigger: DOMRect, tip: DOMRect): boolean {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  switch (placement) {
  case 'top': return trigger.top - GAP - tip.height >= MARGIN;
  case 'bottom': return trigger.bottom + GAP + tip.height <= height - MARGIN;
  case 'left': return trigger.left - GAP - tip.width >= MARGIN;
  default: return trigger.right + GAP + tip.width <= width - MARGIN;
  }
}

/**
 * Keep a start coordinate so the tooltip stays inside the viewport.
 *
 * @param value The wanted coordinate
 * @param size The tooltip's size along that axis
 * @param limit The viewport's size along that axis
 * @returns The coordinate, moved inside the viewport if needed
 */
function clamp(value: number, size: number, limit: number): number {
  return Math.max(MARGIN, Math.min(value, limit - size - MARGIN));
}

/**
 * Put the tooltip next to the trigger and keep it inside the viewport.
 *
 * @param trigger The element the tooltip describes
 * @param tip The tooltip element
 * @param preferred The side to try first
 */
function position(
  trigger: HTMLElement,
  tip: HTMLElement,
  preferred: Placement
): void {
  const anchor = trigger.getBoundingClientRect();
  const size = tip.getBoundingClientRect();
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;

  const placement = fits(preferred, anchor, size) ? preferred
    : fits(OPPOSITE[preferred], anchor, size) ? OPPOSITE[preferred]
      : preferred;

  let top: number;
  let left: number;
  if (placement === 'top' || placement === 'bottom') {
    left = clamp(
      anchor.left + (anchor.width - size.width) / 2,
      size.width,
      width
    );
    top = placement === 'top'
      ? anchor.top - GAP - size.height
      : anchor.bottom + GAP;
  } else {
    top = clamp(
      anchor.top + (anchor.height - size.height) / 2,
      size.height,
      height
    );
    left = placement === 'left'
      ? anchor.left - GAP - size.width
      : anchor.right + GAP;
  }

  tip.style.top = `${Math.max(MARGIN, top)}px`;
  tip.style.left = `${Math.max(MARGIN, left)}px`;
  tip.dataset.placement = placement;
}

/**
 * A short description that appears next to an element when the pointer rests
 * on it or it receives keyboard focus, and goes away on Escape.
 *
 * The tooltip is linked to the element with `aria-describedby`, drawn in the
 * browser's top layer so no ancestor can clip it, and stays open while the
 * pointer is over it. Its content is React, so nothing is parsed as HTML.
 *
 * @param props The props of the component
 * @param props.content What the tooltip shows
 * @param props.children The element the tooltip describes
 * @param props.placement The preferred side of the element
 * @param props.delay Milliseconds before a hover opens the tooltip
 * @returns The element, with the tooltip next to it while it is open
 */
const Tooltip = ({
  content,
  children,
  placement = 'top',
  delay = 300,
}: TooltipProps): ReactElement => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const tip = useRef<HTMLDivElement | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const hovered = useRef(false);
  const focused = useRef(false);

  const hasContent = content !== null
    && content !== undefined
    && content !== false
    && content !== '';

  /** Stop any pending open or close. */
  const cancel = () => window.clearTimeout(timer.current);
  /**
   * Open the tooltip after a pause.
   *
   * @param wait Milliseconds to wait
   */
  const show = (wait: number) => {
    cancel();
    timer.current = window.setTimeout(() => setOpen(true), wait);
  };
  /**
   * Close the tooltip after a pause, unless the pointer or focus holds it.
   *
   * @param wait Milliseconds to wait
   */
  const hide = (wait: number) => {
    cancel();
    timer.current = window.setTimeout(() => {
      if (!hovered.current && !focused.current) {
        setOpen(false);
      }
    }, wait);
  };

  useEffect(() => cancel, []);

  const reposition = useCallback(() => {
    if (trigger.current && tip.current) {
      position(trigger.current, tip.current, placement);
    }
  }, [placement]);

  useLayoutEffect(() => {
    if (!open || !tip.current) {
      return;
    }
    const element = tip.current as HTMLDivElement & {showPopover?: () => void};
    try {
      element.showPopover?.();
    } catch (e) {
      // Already shown, or the browser has no Popover API.
    }
    reposition();
  }, [open, content, reposition]);

  useEffect(() => {
    if (!open) {
      return;
    }
    /**
     * Close on Escape.
     *
     * @param e The key event
     */
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancel();
        setOpen(false);
      }
    };
    let frame = 0;
    /** Reposition once per animation frame, however many events arrive. */
    const onMove = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(reposition);
    };
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onMove);
    window.addEventListener('scroll', onMove, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove, true);
    };
  }, [open, reposition]);

  if (!hasContent) {
    return children;
  }

  const own = children.props;
  const describedBy = [own['aria-describedby'], open ? id : null]
    .filter(Boolean)
    .join(' ') || undefined;

  const described = React.cloneElement(children, {
    'aria-describedby': describedBy,
    /**
     * Open after a pause when a mouse or pen rests on the element.
     *
     * @param e The event
     */
    'onPointerEnter': (e: React.PointerEvent<HTMLElement>) => {
      own.onPointerEnter?.(e);
      if (e.pointerType !== 'touch') {
        hovered.current = true;
        trigger.current = e.currentTarget;
        show(delay);
      }
    },
    /**
     * Close shortly after the pointer leaves, unless it moves onto the tooltip.
     *
     * @param e The event
     */
    'onPointerLeave': (e: React.PointerEvent<HTMLElement>) => {
      own.onPointerLeave?.(e);
      hovered.current = false;
      hide(CLOSE_DELAY);
    },
    /**
     * Close when the element is pressed.
     *
     * @param e The event
     */
    'onPointerDown': (e: React.PointerEvent<HTMLElement>) => {
      own.onPointerDown?.(e);
      cancel();
      setOpen(false);
    },
    /**
     * Open when the element gets keyboard focus.
     *
     * @param e The event
     */
    'onFocus': (e: React.FocusEvent<HTMLElement>) => {
      own.onFocus?.(e);
      // A click focuses too; only keyboard focus opens the tooltip.
      let keyboard = true;
      try {
        keyboard = e.currentTarget.matches(':focus-visible');
      } catch (err) {
        // Browser without :focus-visible; open on every focus.
      }
      if (keyboard) {
        focused.current = true;
        trigger.current = e.currentTarget;
        cancel();
        setOpen(true);
      }
    },
    /**
     * Close when the element loses focus.
     *
     * @param e The event
     */
    'onBlur': (e: React.FocusEvent<HTMLElement>) => {
      own.onBlur?.(e);
      focused.current = false;
      hide(0);
    },
  });

  const popover = {popover: 'manual'};

  return (
    <>
      {described}
      {open && createPortal(
        <div
          ref={tip}
          id={id}
          role='tooltip'
          className='loris-tooltip'
          {...popover}
          onPointerEnter={() => {
            hovered.current = true;
            cancel();
          }}
          onPointerLeave={() => {
            hovered.current = false;
            hide(CLOSE_DELAY);
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip;
export type {TooltipProps, Placement};
