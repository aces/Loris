import React, {useEffect, useState} from 'react';
import {DEFAULT_TIME_WINDOW} from '../../shared/constants';
import {roundTime} from '../../shared/utils';
import {useTranslation} from 'react-i18next';
import {useTimeWindow} from '../TimeWindowContext';
import {TimeRange} from '../types';
import {normalizeTimeWindow, shiftTimeWindow} from '../timeWindow';
import TimeWindowSlider from './TimeWindowSlider';

type TimeWindowBound = 0 | 1;

/** Control the visible time window shared by the signal viewer. */
export default function TimeWindowControls({
  zoomControls,
  fitToSelectionControl,
}: {
  zoomControls?: React.ReactNode,
  fitToSelectionControl?: React.ReactNode,
}) {
  const {t} = useTranslation();
  const {
    recordingTimeRange,
    timeWindow,
    setTimeWindow,
  } = useTimeWindow();
  const [inputValues, setInputValues] = useState<[string, string]>([
    roundTime(timeWindow[0], 1).toFixed(1),
    roundTime(timeWindow[1], 1).toFixed(1),
  ]);
  const windowDuration = timeWindow[1] - timeWindow[0];

  useEffect(() => {
    setInputValues([
      roundTime(timeWindow[0], 1).toFixed(1),
      roundTime(timeWindow[1], 1).toFixed(1),
    ]);
  }, [timeWindow]);

  /** Move time window by. */
  const moveTimeWindowBy = (offset: number) => {
    setTimeWindow(shiftTimeWindow(
      timeWindow,
      offset,
      recordingTimeRange
    ));
  };

  /** Handle time window change. */
  const handleTimeWindowChange = (
    bound: TimeWindowBound,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value;
    const nextInputValues: [string, string] = [
      inputValues[0],
      inputValues[1],
    ];
    nextInputValues[bound] = inputValue;
    setInputValues(nextInputValues);

    const value = Number(inputValue);
    if (inputValue === '' || !Number.isFinite(value)) {
      return;
    }

    const nextTimeWindow: TimeRange = [timeWindow[0], timeWindow[1]];
    nextTimeWindow[bound] = roundTime(value, 1);
    setTimeWindow(normalizeTimeWindow(
      nextTimeWindow,
      recordingTimeRange
    ));
  };

  /** Handle time window blur. */
  const handleTimeWindowBlur = (
    bound: TimeWindowBound,
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    if (event.target.value === '' || !Number.isFinite(value)) {
      const nextInputValues: [string, string] = [
        inputValues[0],
        inputValues[1],
      ];
      nextInputValues[bound] = roundTime(timeWindow[bound], 1).toFixed(1);
      setInputValues(nextInputValues);
      return;
    }

    setTimeWindow(normalizeTimeWindow(
      bound === 0
        ? [roundTime(value, 1), timeWindow[1]]
        : [timeWindow[0], roundTime(value, 1)],
      recordingTimeRange
    ));
  };

  return (
    <div className='time-window-controls'>
      <div className='time-window-control-row'>
        <div className='btn-group time-window-navigation'>
          <button
            type='button'
            className='btn btn-primary btn-xs'
            onClick={() => moveTimeWindowBy(-windowDuration)}
            title={t('Previous Range', {ns: 'electrophysiology_browser'})}
            aria-label={t('Previous Range', {ns: 'electrophysiology_browser'})}
          >«</button>
          <button
            type='button'
            className='btn btn-primary btn-xs'
            onClick={() => moveTimeWindowBy(-1)}
            title={t('Back One Second', {ns: 'electrophysiology_browser'})}
            aria-label={t('Back One Second', {ns: 'electrophysiology_browser'})}
          >‹</button>
          <input
            className='input-interval-bound'
            type='number'
            aria-label={t('Range Start', {ns: 'electrophysiology_browser'})}
            value={inputValues[0]}
            min={recordingTimeRange[0]}
            max={recordingTimeRange[1]}
            onChange={(event) => handleTimeWindowChange(0, event)}
            onBlur={(event) => handleTimeWindowBlur(0, event)}
            onFocus={(e) => e.target.select()}
            step={0.1}
          />
          <input
            className='input-interval-bound'
            type='number'
            aria-label={t('Range End', {ns: 'electrophysiology_browser'})}
            value={inputValues[1]}
            min={recordingTimeRange[0]}
            max={recordingTimeRange[1]}
            onChange={(event) => handleTimeWindowChange(1, event)}
            onBlur={(event) => handleTimeWindowBlur(1, event)}
            onFocus={(e) => e.target.select()}
            step={0.1}
          />
          <button
            type='button'
            className='btn btn-primary btn-xs'
            onClick={() => moveTimeWindowBy(1)}
            title={t('Forward One Second', {ns: 'electrophysiology_browser'})}
            aria-label={t('Forward One Second', {ns: 'electrophysiology_browser'})}
          >›</button>
          <button
            type='button'
            className='btn btn-primary btn-xs'
            onClick={() => moveTimeWindowBy(windowDuration)}
            title={t('Next Range', {ns: 'electrophysiology_browser'})}
            aria-label={t('Next Range', {ns: 'electrophysiology_browser'})}
          >»</button>
        </div>
        {zoomControls && (
          <div className='time-window-zoom-controls'>
            {zoomControls}
          </div>
        )}
        <div className='time-window-actions'>
          <button
            type='button'
            className='btn btn-primary btn-xs'
            onClick={() => setTimeWindow(normalizeTimeWindow(
              DEFAULT_TIME_WINDOW,
              recordingTimeRange
            ))}
          >{t('Reset Range', {ns: 'electrophysiology_browser'})}</button>
          <button
            type='button'
            className='btn btn-primary btn-xs'
            onClick={() => setTimeWindow([
              recordingTimeRange[0],
              recordingTimeRange[1],
            ])}
          >{t('Full Range', {ns: 'electrophysiology_browser'})}</button>
          {fitToSelectionControl}
        </div>
      </div>
      <TimeWindowSlider
        recordingTimeRange={recordingTimeRange}
        timeWindow={timeWindow}
        onTimeWindowChange={setTimeWindow}
      />
    </div>
  );
}
