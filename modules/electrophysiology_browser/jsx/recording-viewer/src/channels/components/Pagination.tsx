import React from 'react';
import {useTranslation} from 'react-i18next';
import {CHANNEL_DISPLAY_OPTIONS} from '../../shared/constants';

/**
 * Pagination component that provides controls for selecting how many channels
 * should be displayed at once, and navigating through the paginated channels.
 */
function Pagination({
  limit,
  selectedChannelsCount,
  offsetIndex,
  updateOffsetIndex,
  displayedChannelsLimit,
  setDisplayedChannelsLimit,
}: {
  limit: number,
  selectedChannelsCount: number,
  offsetIndex: number,
  updateOffsetIndex: (_: number) => void,
  displayedChannelsLimit: number,
  setDisplayedChannelsLimit: (_: number) => void,
}) {
  const {t} = useTranslation();

  const hardLimit = Math.min(offsetIndex + limit - 1, selectedChannelsCount);
  const lastOffset = Math.max(1, selectedChannelsCount - limit + 1);

  return (
    <div className='pagination-nav channel-pagination'>
      <label className='channel-pagination-size'>
        <span className='recording-viewer-control-label'>
          {t('Pagination', {ns: 'electrophysiology_browser'})}
        </span>
        <select
          value={displayedChannelsLimit}
          onChange={(e) => {
            const displayedChannelsLimit = parseInt(e.target.value, 10);
            setDisplayedChannelsLimit(displayedChannelsLimit);
          }}
        >
          {CHANNEL_DISPLAY_OPTIONS.map((numChannels) => (
            <option
              key={numChannels}
              value={numChannels}
            >
              {t('{{numChannels}} channels', {
                ns: 'electrophysiology_browser',
                numChannels: numChannels,
              })}
            </option>
          ))}
        </select>
      </label>
      <div className='channel-pagination-range'>
        <label>
          <span className='sr-only'>
            {t('Showing', {ns: 'electrophysiology_browser'})}
          </span>
          <input
            type='number'
            value={offsetIndex}
            min={1}
            max={lastOffset}
            aria-label={t('Showing', {ns: 'electrophysiology_browser'})}
            onChange={(e) => {
              updateOffsetIndex(parseInt(e.target.value));
            }}
          />
        </label>
        <span>{t('to {{channelsInView}} of {{totalChannels}}', {
          ns: 'electrophysiology_browser',
          channelsInView: hardLimit,
          totalChannels: selectedChannelsCount,
        })}</span>
      </div>
      <div className='btn-group'>
        <button
          type='button'
          className='btn btn-primary btn-xs'
          onClick={() => updateOffsetIndex(Math.max(1, offsetIndex - limit))}
          title={t('Previous Channel Page', {ns: 'electrophysiology_browser'})}
          aria-label={t('Previous Channel Page', {ns: 'electrophysiology_browser'})}
        >«</button>
        <button
          type='button'
          className='btn btn-primary btn-xs'
          onClick={() => updateOffsetIndex(Math.max(1, offsetIndex - 1))}
          title={t('Previous Channel', {ns: 'electrophysiology_browser'})}
          aria-label={t('Previous Channel', {ns: 'electrophysiology_browser'})}
        >‹</button>
        <button
          type='button'
          className='btn btn-primary btn-xs'
          onClick={() => updateOffsetIndex(Math.min(lastOffset, offsetIndex + 1))}
          title={t('Next Channel', {ns: 'electrophysiology_browser'})}
          aria-label={t('Next Channel', {ns: 'electrophysiology_browser'})}
        >›</button>
        <button
          type='button'
          className='btn btn-primary btn-xs'
          onClick={() => updateOffsetIndex(Math.min(
            lastOffset,
            offsetIndex + limit
          ))}
          title={t('Next Channel Page', {ns: 'electrophysiology_browser'})}
          aria-label={t('Next Channel Page', {ns: 'electrophysiology_browser'})}
        >»</button>
      </div>
    </div>
  );
}

export default Pagination;
