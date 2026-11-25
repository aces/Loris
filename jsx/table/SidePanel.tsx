import React, {ReactNode, useState, useRef, useLayoutEffect} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'jsx/Button';
import {Icon} from './icons';

const MIN_WIDTH = 320;
const STEP = 16;

/**
 * Reads a width saved in this browser, if there is one
 *
 * @param key - the saved width's key
 * @param fallback - the width when none is saved
 */
function savedWidth(key: string, fallback: number): number {
  try {
    const saved = Number(window.localStorage.getItem(key));
    return saved >= MIN_WIDTH ? saved : fallback;
  } catch (e) {
    return fallback;
  }
}

/**
 * The panel that slides over the right side of a table's rows, holding one
 * record or a form. Its left edge can be dragged, or moved with the arrow
 * keys, to make it wider or narrower; the width is kept in this browser.
 *
 * @param props - React props
 * @param props.label - names the panel for assistive technology
 * @param props.title - shown in the panel's head
 * @param props.tools - controls shown before the close button
 * @param props.wide - whether the panel is wide, for a form
 * @param props.leaving - whether the panel is sliding out
 * @param props.onLeft - called once it has slid out
 * @param props.onClose - closes the panel
 * @param props.children - the panel's content
 */
function SidePanel(props: {
  label: string,
  title: ReactNode,
  tools?: ReactNode,
  wide?: boolean,
  leaving?: boolean,
  onLeft?: () => void,
  onClose: () => void,
  children: ReactNode,
}) {
  const {t} = useTranslation(['loris']);
  const key = 'loris-side-panel-width' + (props.wide ? '-wide' : '');
  const [width, setWidth] = useState(
    () => savedWidth(key, props.wide ? 520 : 380)
  );
  const panel = useRef<HTMLElement>(null);

  // The space beside the panel learns its width, so content can keep clear
  // of it.
  useLayoutEffect(() => {
    const parent = panel.current?.parentElement;
    parent?.style.setProperty('--rt-panel-width', width + 'px');
    return () => {
      parent?.style.removeProperty('--rt-panel-width');
    };
  }, [width]);

  /**
   * Sets the width within its bounds and keeps it
   *
   * @param next - the width wanted
   */
  const resize = (next: number) => {
    const room = panel.current?.parentElement?.clientWidth || next;
    const bounded = Math.round(
      Math.max(MIN_WIDTH, Math.min(next, room * 0.8))
    );
    setWidth(bounded);
    try {
      window.localStorage.setItem(key, String(bounded));
    } catch (e) {
      // Without storage the width lasts until the page is left.
    }
  };

  /**
   * Follows the pointer while the edge is dragged
   *
   * @param e - the press on the edge
   */
  const drag = (e: React.PointerEvent) => {
    e.preventDefault();
    const right = panel.current?.getBoundingClientRect().right || 0;
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    /**
     * Resizes to the pointer
     *
     * @param move - the pointer's move
     */
    const follow = (move: PointerEvent) => resize(right - move.clientX);
    /**
     * Stops following the pointer
     */
    const stop = () => {
      target.removeEventListener('pointermove', follow as EventListener);
      target.removeEventListener('pointerup', stop);
    };
    target.addEventListener('pointermove', follow as EventListener);
    target.addEventListener('pointerup', stop);
  };

  return (
    <aside
      ref={panel}
      className={'rt-record' + (props.wide ? ' rt-record-wide' : '')
        + (props.leaving ? ' rt-record-leaving' : '')}
      style={{width}}
      aria-label={props.label}
      onAnimationEnd={(e) => {
        if (props.leaving && e.target === e.currentTarget) {
          props.onLeft?.();
        }
      }}
    >
      <div
        className="rt-record-resize"
        role="separator"
        aria-orientation="vertical"
        aria-label={t('Resize panel')}
        aria-valuenow={width}
        aria-valuemin={MIN_WIDTH}
        tabIndex={0}
        onPointerDown={drag}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            resize(width + (e.key === 'ArrowLeft' ? STEP : -STEP));
          }
        }}
      />
      <div className="rt-record-body">
        <div className="rt-record-head">
          <h3 className="rt-record-title">{props.title}</h3>
          {props.tools}
          <Button display="quiet" title={t('Close')} onClick={props.onClose}>
            <Icon name="close" />
          </Button>
        </div>
        {props.children}
      </div>
    </aside>
  );
}

export default SidePanel;
