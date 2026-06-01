import React from 'react';
import {useTranslation} from "react-i18next";
import {CHANNEL_DISPLAY_OPTIONS} from "../../vector";
import {RightPanel} from "../store/types";

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
  rightPanel,
}: {
  limit: number,
  selectedChannelsCount: number,
  offsetIndex: number,
  updateOffsetIndex: (_: number) => void,
  displayedChannelsLimit: number,
  setDisplayedChannelsLimit: (_: number) => void,
  rightPanel: RightPanel,
}) {
  const {t} = useTranslation();

  const hardLimit = Math.min(offsetIndex + limit - 1, selectedChannelsCount);

  return (
    <div
      className={
        (rightPanel ? '' : 'pull-right-lg col-lg-5 ') + 'pagination-nav'
      }
      style={{padding: '5px 15px'}}
    >
      <small style={{marginRight: '3px'}}>
        {t('Displaying: ', {ns: 'electrophysiology_browser'})}
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
          ))};
        </select>
        &nbsp;
        {t('Showing:', {ns: 'electrophysiology_browser'})}
        &nbsp;
        <input
          type='number'
          style={{width: '45px'}}
          value={offsetIndex}
          onChange={(e) => {updateOffsetIndex(parseInt(e.target.value))}}
        />
        &nbsp;
        {t('to {{channelsInView}} of {{totalChannels}}', {
          ns: 'electrophysiology_browser',
          channelsInView: hardLimit,
          totalChannels: selectedChannelsCount
        })}
      </small>
      <div
        className='btn-group'
        style={{marginRight: 0}}
      >
        <input
          type='button'
          className='btn btn-primary btn-xs'
          onClick={() => updateOffsetIndex(offsetIndex - limit)}
          value='<<'
        />
        <input
          type='button'
          className='btn btn-primary btn-xs'
          onClick={() => updateOffsetIndex(offsetIndex - 1)}
          value='<'
        />
        <input
          type='button'
          className='btn btn-primary btn-xs'
          onClick={() => updateOffsetIndex(offsetIndex + 1)}
          value='>'
        />
        <input
          type='button'
          className='btn btn-primary btn-xs'
          onClick={() => updateOffsetIndex(offsetIndex + limit)}
          value='>>'
        />
      </div>
    </div>
  );
}

export default Pagination;
