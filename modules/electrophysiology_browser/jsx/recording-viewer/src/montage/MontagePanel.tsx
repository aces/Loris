import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import Panel from '../ui/Panel';
import {useRecording} from '../recording/RecordingContext';
import Montage from './Montage';
import {HoveredChannelsContext} from '../recording/RecordingDataProvider';

/** Render the recording sensor-map panel. */
function MontagePanel({id}: {id: string}) {
  const {t} = useTranslation();
  const {eegMontageName: montageName} = useRecording();
  const {hoveredChannels} = useContext(HoveredChannelsContext);

  return (
    <Panel
      collapsing={false}
      id={id}
      title={
        <>
          {t('Sensor Map', {ns: 'electrophysiology_browser'})}
          {montageName && (
            <>
              &nbsp;&nbsp;
              <span
                className='code-mimic'
                style={{backgroundColor: '#eff1f2', color: '#1f2329'}}
              >
                {montageName}
              </span>
            </>
          )}
        </>
      }
    >
      <Montage hoveredChannelIndices={hoveredChannels} />
    </Panel>
  );
}

export default MontagePanel;
