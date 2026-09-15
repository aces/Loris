import React, {useEffect} from 'react';
import {CheckboxElement} from '../series/components/Form';
import {ColorMap} from './Montage';
import {Sensor} from '../series/store/types';
import {useTranslation} from 'react-i18next';

/**
 * Side pannels to edit channels.
 */
function ChannelsEditor({
  sensors,
  montageName,
  view3D,
  colorMap,
  channelDelimiter,
  setSelectedSensors,
  selectedSensorsText,
  setSelectedSensorsText,
  eventChannels,
  setEventChannels,
  showChannelIndices,
  setShowChannelIndices,
  setCancelWarning,
}: {
  sensors: Sensor[],
  montageName: string,
  view3D: boolean,
  colorMap?: ColorMap,
  channelDelimiter: string,
  selectedSensorsText: string,
  setSelectedSensorsText: React.Dispatch<React.SetStateAction<string>>,
  selectedSensors: (boolean | undefined)[],
  setSelectedSensors: React.Dispatch<React.SetStateAction<(
    boolean | undefined
  )[]>>,
  eventChannels: string[],
  setEventChannels: React.Dispatch<React.SetStateAction<string[]>>,
  showChannelIndices: boolean,
  setShowChannelIndices: React.Dispatch<React.SetStateAction<boolean>>,
  setCancelWarning?: React.Dispatch<React.SetStateAction<boolean>>,
}) {
  const {t} = useTranslation();

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
      return sensor.name === channelName;
    });
  };

  let infoMessageTimeout: NodeJS.Timeout | null = null;

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
    const allSensors = sensors.map((_) => true);
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
    const allSensors = sensors.map((_) => false);
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
    const initialSensors = sensors.map((e, i) => colorMap?.ids?.includes(i));
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
    return JSON.stringify(eventChannels.sort().join(channelDelimiter)) ===
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
    if (!setCancelWarning) {
      return;
    }

    setCancelWarning(!textSameAsInitial());
  }, [selectedSensorsText, eventChannels]);

  return (
    <>
      <div
        style={{
          top: '0',
          left: '15px',
          width: '100%',
          position: 'absolute',
        }}
      >
        <label
          htmlFor='edit-channels'
          style={{
            position: 'relative',
            bottom: '10px',
          }}
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
            marginLeft: '10px',
            height: '50px',
            resize: 'none',
            padding: '5px',
            width: '86%',
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
      <div
        className="btn-group"
        style={{
          bottom: '30px',
          left: '15px',
          position: 'absolute',
        }}
      >
        {
          !view3D && (
            <CheckboxElement
              name='toggle-channel-indices'
              offset=''
              label={t(
                'Show indices', {
                  ns: 'electrophysiology_browser',
                }
              )}
              value={showChannelIndices}
              onUserInput={() => {
                setShowChannelIndices(!showChannelIndices);
              }}
              outerStyles={{}}
            />
          )
        }
        {
          view3D && (
            <>
              {t(
                'Hold shift to enable electrode selection', {
                  ns: 'electrophysiology_browser',
                }
              )}
            </>
          )
        }
      </div>
      <div
        className=""
        style={{
          bottom: '0',
          left: '15px',
          position: 'absolute',
          zIndex: 1,
        }}
      >
        <div>
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
      <div
        className=""
        style={{
          bottom: '0',
          right: '15px',
          position: 'absolute',
          zIndex: 1,
        }}
      >
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
          className="btn btn-primary float-right"
        >
          {t('Reset', {ns: 'loris'})}
        </button>
        <button
          type="button"
          disabled={textSameAsInitial()}
          onClick={handleSubmit}
          className="btn btn-primary float-right"
        >
          {t('Save', {ns: 'loris'})}
        </button>
      </div>
    </>
  );
}

export default ChannelsEditor;
