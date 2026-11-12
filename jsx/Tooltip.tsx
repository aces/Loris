import React, {ReactElement, ReactNode, useEffect, useId, useRef} from 'react';
import './Tooltip.css';

type TooltipProps = {
  // What the tooltip shows. Nothing is rendered when this is empty.
  content: ReactNode;
  // The element the tooltip describes. It must pass `aria-describedby`, `style`
  // and the pointer and focus handlers on to a DOM element.
  children: ReactElement;
  // The preferred side of the element. The browser flips it when there is no
  // room.
  placement?: 'top' | 'bottom' | 'left' | 'right';
  // Milliseconds before a hover opens the tooltip.
  delay?: number;
};

const CLOSE_DELAY = 100;

/**
 * A short description next to an element, shown on hover or keyboard focus
 * and dismissed with Escape.
 *
 * The browser places the tooltip (CSS anchor positioning) and draws it in the
 * top layer, so no ancestor clips it. It stays open while the pointer is over
 * it, and its content is React, so nothing is parsed as HTML.
 *
 * @param props The props of the component
 * @param props.content What the tooltip shows
 * @param props.children The element the tooltip describes
 * @param props.placement The preferred side of the element
 * @param props.delay Milliseconds before a hover opens the tooltip
 * @returns The element, followed by its tooltip
 */
const Tooltip = ({
  content,
  children,
  placement = 'top',
  delay = 300,
}: TooltipProps): ReactElement => {
  const id = useId();
  const anchor = '--' + id.replace(/:/g, '');
  const tip = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();
  const held = useRef({hover: false, focus: false});
  const own = children.props;

  /**
   * Close on Escape.
   *
   * @param e The key event
   */
  const onEscape = useRef((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      tip.current?.hidePopover();
    }
  });

  /** Close the tooltip. */
  const close = () => {
    tip.current?.hidePopover();
    document.removeEventListener('keydown', onEscape.current);
  };

  /**
   * Open the tooltip after a pause.
   *
   * @param wait Milliseconds to wait
   */
  const open = (wait: number) => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      tip.current?.showPopover();
      document.addEventListener('keydown', onEscape.current);
    }, wait);
  };

  /** Close shortly, unless the pointer or focus still holds the tooltip. */
  const release = () => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (!held.current.hover && !held.current.focus) {
        close();
      }
    }, CLOSE_DELAY);
  };

  useEffect(() => () => {
    clearTimeout(timer.current);
    document.removeEventListener('keydown', onEscape.current);
  }, []);

  if (content === null || content === undefined || content === false
    || content === '') {
    return children;
  }

  return (
    <>
      {React.cloneElement(children, {
        'aria-describedby': id,
        'style': {...own.style, anchorName: anchor},
        /**
         * Open after a pause when a mouse or pen rests on the element.
         *
         * @param e The event
         */
        'onPointerEnter': (e: React.PointerEvent) => {
          own.onPointerEnter?.(e);
          if (e.pointerType !== 'touch') {
            held.current.hover = true;
            open(delay);
          }
        },
        /**
         * Close shortly after the pointer leaves.
         *
         * @param e The event
         */
        'onPointerLeave': (e: React.PointerEvent) => {
          own.onPointerLeave?.(e);
          held.current.hover = false;
          release();
        },
        /**
         * Open when the element gets keyboard focus, not on a click.
         *
         * @param e The event
         */
        'onFocus': (e: React.FocusEvent) => {
          own.onFocus?.(e);
          if (e.currentTarget.matches(':focus-visible')) {
            held.current.focus = true;
            open(0);
          }
        },
        /**
         * Close when the element loses focus.
         *
         * @param e The event
         */
        'onBlur': (e: React.FocusEvent) => {
          own.onBlur?.(e);
          held.current.focus = false;
          release();
        },
      })}
      <div
        ref={tip}
        id={id}
        role='tooltip'
        className='loris-tooltip'
        data-placement={placement}
        style={{positionAnchor: anchor} as React.CSSProperties}
        {...{popover: 'manual'}}
        onPointerEnter={() => {
          held.current.hover = true;
          clearTimeout(timer.current);
        }}
        onPointerLeave={() => {
          held.current.hover = false;
          release();
        }}
      >
        {content}
      </div>
    </>
  );
};

export default Tooltip;
export type {TooltipProps};
