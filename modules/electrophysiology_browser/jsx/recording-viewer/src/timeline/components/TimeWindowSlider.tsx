import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {roundTime} from '../../shared/utils';
import {TimeRange} from '../types';
import {shiftTimeWindow} from '../timeWindow';
import {createTimeTicks, getNiceTimeStep} from '../timeWindowRuler';

type TimeWindowSliderProps = {
  recordingTimeRange: TimeRange,
  timeWindow: TimeRange,
  onTimeWindowChange: (_: TimeRange) => void,
};

type DragKind = 'start' | 'end' | 'window';

type DragState = {
  pointerId: number,
  kind: DragKind,
  initialClientX: number,
  initialTimeWindow: TimeRange,
};

type TimeWindowHandleProps = {
  bound: 0 | 1,
  percent: number,
  recordingTimeRange: TimeRange,
  timeWindow: TimeRange,
  step: number,
  onTimeWindowChange: (_: TimeRange) => void,
};

const MINIMUM_WINDOW_HIT_WIDTH = 16;

/** Clamp. */
function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

/** Time window handle component. */
function TimeWindowHandle({
  bound,
  percent,
  recordingTimeRange,
  timeWindow,
  step,
  onTimeWindowChange,
}: TimeWindowHandleProps) {
  const {t} = useTranslation();
  const [hasFocus, setHasFocus] = useState(false);

  /** Handle key down. */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let nextValue: number | undefined;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      nextValue = timeWindow[bound] - step;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      nextValue = timeWindow[bound] + step;
    } else if (event.key === 'Home') {
      nextValue = bound === 0 ? recordingTimeRange[0] : timeWindow[0];
    } else if (event.key === 'End') {
      nextValue = bound === 0 ? timeWindow[1] : recordingTimeRange[1];
    } else {
      return;
    }

    event.preventDefault();
    const nextTimeWindow: TimeRange = [timeWindow[0], timeWindow[1]];
    nextTimeWindow[bound] = roundTime(clamp(
      nextValue,
      bound === 0 ? recordingTimeRange[0] : timeWindow[0],
      bound === 0 ? timeWindow[1] : recordingTimeRange[1]
    ), 1);
    onTimeWindowChange(nextTimeWindow);
  };

  return (
    <div
      data-drag-kind={bound === 0 ? 'start' : 'end'}
      role="slider"
      tabIndex={0}
      aria-label={t(
        bound === 0 ? 'Range start' : 'Range end',
        {ns: 'electrophysiology_browser'}
      )}
      aria-valuemin={bound === 0 ? recordingTimeRange[0] : timeWindow[0]}
      aria-valuemax={bound === 0 ? timeWindow[1] : recordingTimeRange[1]}
      aria-valuenow={timeWindow[bound]}
      onKeyDown={handleKeyDown}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
      style={{
        position: 'absolute',
        top: 11,
        left: `${percent}%`,
        width: 11,
        height: 11,
        cursor: 'ew-resize',
        transform: bound === 0 ? 'translateX(-11px)' : undefined,
        zIndex: 3,
        boxSizing: 'border-box',
        outline: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: bound === 0 ? 5 : 0,
          width: 6,
          borderRadius: '999px 999px 0 0',
          background: '#6f7880',
          boxShadow: hasFocus
            ? '0 0 0 2px rgba(52, 125, 184, 0.35)'
            : 'none',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/** Select and move the visible portion of a recording on a time axis. */
export default function TimeWindowSlider({
  recordingTimeRange,
  timeWindow,
  onTimeWindowChange,
}: TimeWindowSliderProps) {
  const {t} = useTranslation();
  const axisRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [axisWidth, setAxisWidth] = useState(1000);
  const [activeDragKind, setActiveDragKind] = useState<DragKind | null>(null);
  const [windowHasFocus, setWindowHasFocus] = useState(false);
  const duration = recordingTimeRange[1] - recordingTimeRange[0];
  const desiredMajorTickCount = clamp(Math.floor(axisWidth / 55), 8, 24);
  const majorStep = getNiceTimeStep(duration / desiredMajorTickCount);
  const keyboardStep = majorStep / 5;
  const ticks = createTimeTicks(recordingTimeRange, majorStep);

  useEffect(() => {
    const axis = axisRef.current;
    if (!axis) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      setAxisWidth(entry.contentRect.width);
    });
    resizeObserver.observe(axis);

    return () => resizeObserver.disconnect();
  }, []);

  /** Time to percent. */
  const timeToPercent = (time: number) => duration > 0
    ? ((time - recordingTimeRange[0]) / duration) * 100
    : 0;

  const startPercent = timeToPercent(timeWindow[0]);
  const endPercent = timeToPercent(timeWindow[1]);
  const windowWidthPercent = Math.max(0, endPercent - startPercent);
  const windowWidth = axisWidth * windowWidthPercent / 100;
  const windowHitWidth = Math.max(windowWidth, MINIMUM_WINDOW_HIT_WIDTH);
  const windowHitLeft = axisWidth * (startPercent + endPercent) / 200
    - windowHitWidth / 2;

  /** Client x to time. */
  const clientXToTime = (clientX: number): number => {
    const axis = axisRef.current;
    if (!axis || duration <= 0) {
      return recordingTimeRange[0];
    }

    const bounds = axis.getBoundingClientRect();
    const percent = clamp((clientX - bounds.left) / bounds.width, 0, 1);
    return recordingTimeRange[0] + percent * duration;
  };

  /** Handle pointer down. */
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || duration <= 0) {
      return;
    }

    const requestedKind = (event.target as HTMLElement).dataset.dragKind as
      DragKind | undefined;
    if (requestedKind) {
      (event.target as HTMLElement).focus();
    }
    const clickedTime = clientXToTime(event.clientX);
    const kind = requestedKind || 'window';
    let initialTimeWindow: TimeRange = [timeWindow[0], timeWindow[1]];

    if (!requestedKind) {
      const windowMidpoint = (timeWindow[0] + timeWindow[1]) / 2;
      initialTimeWindow = shiftTimeWindow(
        timeWindow,
        clickedTime - windowMidpoint,
        recordingTimeRange
      );
      initialTimeWindow = [
        roundTime(initialTimeWindow[0], 1),
        roundTime(initialTimeWindow[1], 1),
      ];
      onTimeWindowChange(initialTimeWindow);
      windowRef.current?.focus();
    }

    dragRef.current = {
      pointerId: event.pointerId,
      kind,
      initialClientX: event.clientX,
      initialTimeWindow,
    };
    setActiveDragKind(kind);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  /** Handle pointer move. */
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const axis = axisRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !axis) {
      return;
    }

    const bounds = axis.getBoundingClientRect();
    if (bounds.width <= 0) {
      return;
    }

    const timeDelta = (
      (event.clientX - drag.initialClientX) / bounds.width
    ) * duration;
    let nextTimeWindow: TimeRange;

    if (drag.kind === 'window') {
      nextTimeWindow = shiftTimeWindow(
        drag.initialTimeWindow,
        timeDelta,
        recordingTimeRange
      );
    } else if (drag.kind === 'start') {
      nextTimeWindow = [
        clamp(
          drag.initialTimeWindow[0] + timeDelta,
          recordingTimeRange[0],
          drag.initialTimeWindow[1]
        ),
        drag.initialTimeWindow[1],
      ];
    } else {
      nextTimeWindow = [
        drag.initialTimeWindow[0],
        clamp(
          drag.initialTimeWindow[1] + timeDelta,
          drag.initialTimeWindow[0],
          recordingTimeRange[1]
        ),
      ];
    }

    onTimeWindowChange([
      roundTime(nextTimeWindow[0], 1),
      roundTime(nextTimeWindow[1], 1),
    ]);
    event.preventDefault();
  };

  /** Finish drag. */
  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;
    setActiveDragKind(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  /** Handle window key down. */
  const handleWindowKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    let offset: number;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      offset = -keyboardStep;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      offset = keyboardStep;
    } else {
      return;
    }

    event.preventDefault();
    onTimeWindowChange(shiftTimeWindow(
      timeWindow,
      offset,
      recordingTimeRange
    ));
  };

  return (
    <div className='time-window-slider' style={{height: 54, position: 'relative'}}>
      <div
        ref={axisRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        style={{
          position: 'relative',
          width: '100%',
          height: 43,
          touchAction: 'none',
          userSelect: 'none',
          cursor: activeDragKind === 'window'
            ? 'grab'
            : activeDragKind
              ? 'ew-resize'
              : 'pointer',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 22,
            width: '100%',
            height: 1,
            background: '#064785',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 15,
            left: `${startPercent}%`,
            right: `${100 - endPercent}%`,
            height: 7,
            background: windowHasFocus ? '#8fc7e9' : '#a6d5f2',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        <div
          ref={windowRef}
          data-drag-kind="window"
          role="button"
          tabIndex={0}
          aria-label={t('Move selected time range', {
            ns: 'electrophysiology_browser',
          })}
          onKeyDown={handleWindowKeyDown}
          onFocus={() => setWindowHasFocus(true)}
          onBlur={() => setWindowHasFocus(false)}
          style={{
            position: 'absolute',
            top: 13,
            left: windowHitLeft,
            width: windowHitWidth,
            height: 20,
            cursor: 'grab',
            zIndex: 2,
            outline: 'none',
            background: 'transparent',
          }}
        />
        {ticks.map((tick) => (
          <div
            key={`${tick.value}-${tick.isMajor ? 'major' : 'minor'}`}
            style={{
              position: 'absolute',
              top: 22,
              left: `${tick.percent}%`,
              width: 1,
              height: tick.isMajor ? 9 : 5,
              background: tick.isMajor ? '#064785' : '#87919a',
              pointerEvents: 'none',
            }}
          >
            {tick.isMajor && (
              <span
                style={{
                  position: 'absolute',
                  top: 9,
                  left: 0,
                  transform: 'translateX(-50%)',
                  color: '#064785',
                  fontFamily: 'monospace',
                  fontSize: 10,
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {tick.value}
              </span>
            )}
          </div>
        ))}
        <TimeWindowHandle
          bound={0}
          percent={startPercent}
          recordingTimeRange={recordingTimeRange}
          timeWindow={timeWindow}
          step={keyboardStep}
          onTimeWindowChange={onTimeWindowChange}
        />
        <TimeWindowHandle
          bound={1}
          percent={endPercent}
          recordingTimeRange={recordingTimeRange}
          timeWindow={timeWindow}
          step={keyboardStep}
          onTimeWindowChange={onTimeWindowChange}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 0,
          fontSize: 10,
          color: '#064785',
        }}
      >
        {t('Time (s)', {ns: 'electrophysiology_browser'})}
      </div>
    </div>
  );
}
