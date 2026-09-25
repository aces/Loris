import React, {useContext, useEffect, useMemo, useState} from 'react';
import {CheckboxElement} from '../ui/Form';
import type {ColorMap} from './Montage2D';
import {useTranslation} from 'react-i18next';
import {
  ChannelMetadataContext,
  SensorsContext,
} from '../recording/RecordingDataProvider';
import {useRecording} from '../recording/RecordingContext';
import {checkSensorPosition} from './utils';
import Montage from './Montage';

/**
 * Side pannels to edit channels.
 */
function ChannelsEditor({
  colorMap,
  eventChannels,
  setEventChannels,
  setCancelWarning,
  contentHeight = '75vh',
  cssClass = '',
}: {
  colorMap?: ColorMap,
  eventChannels: string[],
  setEventChannels: React.Dispatch<React.SetStateAction<string[]>>,
  setCancelWarning?: React.Dispatch<React.SetStateAction<boolean>>,
  contentHeight?: string,
  cssClass?: string,
}) {
  const {t} = useTranslation();
  const {channelDelimiter, eegMontageName: montageName} = useRecording();
  const contextSensors = useContext(SensorsContext);
  const channelMetadata = useContext(ChannelMetadataContext);
  const sensors = useMemo(
    () => contextSensors.filter(checkSensorPosition),
    [contextSensors]
  );
  /** Build the selected-sensor state from the event channels. */
  const initialSelection = () => sensors.map(
    (sensor) => eventChannels.includes(sensor.name)
  );
  const [selectedSensors, setSelectedSensors] = useState(initialSelection);
  const [selectedSensorsText, setSelectedSensorsText] = useState(
    eventChannels.join(channelDelimiter)
  );
  const [showChannelIndices, setShowChannelIndices] = useState(false);
  const [view3D, setView3D] = useState(false);
  /** Check whether a sensor maps to selectable channel metadata. */
  const isSensorSelectable = (sensor: (typeof sensors)[number]) => (
    sensor.channelIndex !== undefined
    && channelMetadata[sensor.channelIndex]?.name === sensor.name
  );

  /**
   * Get the name of a channel from its index.
   */
  const getChannelName = (channelIndex: number) => {
    return sensors[channelIndex].name;
  };

  /**
   * Get the index of a channel from its name.
   */
  const getChannelIndex = (channelName: string) => {
    return sensors.findIndex((sensor) => {
      return isSensorSelectable(sensor) && sensor.name === channelName;
    });
  };

  let infoMessageTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Set the information message displayed in the footer.
   */
  const setInfoMessage = (message: string, success: boolean) => {
    const footerRef = document.querySelector<HTMLElement>(
      '#channel-selector-montage #info-message'
    );

    if (footerRef === null) {
      return;
    }

    footerRef.classList.remove(success ? 'alert-danger' : 'alert-success');
    footerRef.classList.add(success ? 'alert-success' : 'alert-danger');

    if (infoMessageTimeout !== null) {
      clearTimeout(infoMessageTimeout);
    }

    footerRef.style.display = 'block';
    footerRef.innerHTML = message;

    infoMessageTimeout = setTimeout(() => {
      footerRef.style.display = 'none';
      footerRef.innerHTML = '';
    }, 3000);
  };

  /**
   * Select all channels.
   */
  const handleSelectAll = () => {
    const allSensors = sensors.map(isSensorSelectable);
    setSelectedSensors(allSensors);
    setSelectedSensorsText(
      allSensors.map((sensor, index) => {
        return sensor ? index : undefined;
      }).filter((s) => s !== undefined)
        .map(getChannelName)
        .join(channelDelimiter)
    );
  };

  /**
   * Select no channels.
   */
  const handleSelectNone = () => {
    const allSensors = sensors.map(() => false);
    setSelectedSensors(allSensors);
    setSelectedSensorsText(
      allSensors.map((sensor, index) => {
        return sensor ? index : undefined;
      }).filter((s) => s !== undefined)
        .map(getChannelName)
        .join(channelDelimiter)
    );
  };

  /**
   * Reset the selection.
   */
  const handleReset = () => {
    const initialSensors = sensors.map(
      (_, index) => Boolean(colorMap?.ids?.includes(index))
    );
    setSelectedSensors(initialSensors);
    setSelectedSensorsText(
      initialSensors.map((sensor, index) => {
        return sensor ? index : undefined;
      }).filter((s) => s !== undefined)
        .map(getChannelName)
        .join(channelDelimiter)
    );
  };

  /**
   * Submit the selection.
   */
  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const validChannels = validateChannels(selectedSensorsText, true);
    if (validChannels.success) {
      setEventChannels(
        selectedSensorsText.length > 0
          ? selectedSensorsText.split(channelDelimiter)
          : []
      );
      setInfoMessage(validChannels.message, validChannels.success);
    } else {
      setInfoMessage(validChannels.message, validChannels.success);
    }
  };

  /**
   * Same text as initial.
   */
  const textSameAsInitial = () => {
    return JSON.stringify([...eventChannels].sort().join(channelDelimiter)) ===
      JSON.stringify(selectedSensorsText
        .split(channelDelimiter)
        .sort()
        .join(channelDelimiter)
      );
  };

  /**
   * Validate the selected channels.
   */
  const validateChannels = (
    channelString: string,
    validatingForSave = false,
  ) => {
    const trimmedString = channelString.trim();
    const parsedChannels = trimmedString
      .split(channelDelimiter)
      .map((c) => c.trim());

    const result = {
      success: true,
      message: t(
        'Saved successfully', {
          ns: 'electrophysiology_browser',
        }
      ),
    };

    if (validatingForSave) {
      if (textSameAsInitial()) {
        result.success = false;
        result.message = t(
          'No electrode changes', {
            ns: 'electrophysiology_browser',
          }
        );
        return result;
      }

      if (
        (new Set(parsedChannels.filter((pc) => pc.length > 0))).size !==
        parsedChannels.filter((pc) => pc.length > 0).length
      ) {
        result.success = false;
        result.message = t(
          'Duplicates are not allowed', {
            ns: 'electrophysiology_browser',
          }
        );
        return result;
      }
    }

    const validPattern =
      new RegExp(`^\\s*(\\w+)?(${channelDelimiter}\\s*\\w+)*\\s*$`);
      // /^\s*(\w+)?(,\s*\w+)*\s*$/;

    if (!validPattern.test(trimmedString)) {
      result.success = false;
      result.message = t(
        'Invalid string format. ' +
        'Expected channel names delimited by "{{channelDelimiter}}"', {
          ns: 'electrophysiology_browser',
          channelDelimiter: channelDelimiter,
        }
      );
      return result;
    }

    if (
      !parsedChannels
        .filter((channel) => channel.length > 0)
        .every((channel) => getChannelIndex(channel) !== -1)
    ) {
      result.success = false;
      result.message = t(
        'String contains one or more unrecognized channels', {
          ns: 'electrophysiology_browser',
        }
      );
      return result;
    }

    return result;
  };

  useEffect(() => {
    setSelectedSensors(initialSelection());
    setSelectedSensorsText(eventChannels.join(channelDelimiter));
  }, [eventChannels, sensors, channelDelimiter]);

  useEffect(() => {
    if (!setCancelWarning) {
      return;
    }

    setCancelWarning(!textSameAsInitial());
  }, [selectedSensorsText, eventChannels]);

  /** Toggle selection for one sensor. */
  const toggleSensorSelection = (index: number) => {
    if (!isSensorSelectable(sensors[index])) return;

    const newSelection = selectedSensors.map(
      (selected, sensorIndex) => sensorIndex === index ? !selected : selected
    );
    setSelectedSensors(newSelection);
    setSelectedSensorsText(
      newSelection
        .map((selected, sensorIndex) => selected
          ? getChannelName(sensorIndex)
          : null
        )
        .filter((name): name is string => name !== null)
        .join(channelDelimiter)
    );
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: 'auto minmax(0, 1fr) auto',
      height: contentHeight,
      minHeight: 0,
    }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 15px',
        }}
      >
        <label
          htmlFor='edit-channels'
        >
          {t(
            'Channel', {
              ns: 'electrophysiology_browser',
              count: 99,
            }
          ).toString().toLowerCase()}
        </label>
        <textarea
          id='edit-channels'
          value={selectedSensorsText}
          onChange={(event) => {
            setSelectedSensorsText(event.target.value);
            // Improves responsiveness on sensor deletion
            const channelString = event.target.value.endsWith(',')
              ? event.target.value.slice(0, -1) : event.target.value;
            if (validateChannels(channelString).success) {
              const parsedChannels = event.target.value.trim()
                .split(channelDelimiter)
                .map((c) => c.trim());
              const inferredIndices = parsedChannels.map(getChannelIndex);
              setSelectedSensors(
                sensors.map((e, i) => inferredIndices.includes(i))
              );
            }
          }}
          style={{
            height: '50px',
            resize: 'none',
            padding: '5px',
            flex: 1,
            minWidth: 0,
          }}
        />
        {
          montageName && (
            <>
              <label htmlFor='channel-montage-name'>
                {t(
                  'Montage', {
                    ns: 'electrophysiology_browser',
                  }
                )}
              </label>
              &nbsp;
              <span
                id={'channel-montage-name'}
                className='code-mimic'
                style={{
                  backgroundColor: '#eff1f2',
                  color: '#1f2329',
                  marginLeft: '5px',
                }}
              >
                {montageName}
              </span>
            </>
          )
        }
      </div>
      <div style={{minHeight: 0}}>
        <Montage
          colorMap={colorMap}
          contentHeight='100%'
          cssClass={cssClass}
          selectedSensors={selectedSensors}
          onSensorClick={toggleSensorSelection}
          isSensorSelectable={isSensorSelectable}
          showChannelIndices={showChannelIndices}
          view3D={view3D}
          onView3DChange={setView3D}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          padding: '5px 15px 0',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '5px',
        }}>
          {!view3D ? (
            <CheckboxElement
              name='toggle-channel-indices'
              offset=''
              label={t('Show indices', {ns: 'electrophysiology_browser'})}
              value={showChannelIndices}
              onUserInput={() => {
                setShowChannelIndices(!showChannelIndices);
              }}
              outerStyles={{}}
            />
          ) : t(
            'Hold shift to enable electrode selection', {
              ns: 'electrophysiology_browser',
            }
          )}
          <div className='btn-group'>
            <button
              className={'btn btn-xs btn-default'}
              onClick={handleSelectNone}
            >
              {t(
                'Select None', {
                  ns: 'electrophysiology_browser',
                }
              )}
            </button>
            <button
              className={'btn btn-xs btn-default'}
              onClick={handleSelectAll}
            >
              {t(
                'Select All', {
                  ns: 'electrophysiology_browser',
                }
              )}
            </button>
          </div>
        </div>
        <div>
          <div
            id="info-message"
            className="alert text-center"
            role="alert"
            style={{display: 'none'}}
          ></div>
          <button
            type="reset"
            disabled={textSameAsInitial()}
            onClick={handleReset}
            className="btn btn-primary"
          >
            {t('Reset', {ns: 'loris'})}
          </button>
          <button
            type="button"
            disabled={textSameAsInitial()}
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            {t('Save', {ns: 'loris'})}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChannelsEditor;
