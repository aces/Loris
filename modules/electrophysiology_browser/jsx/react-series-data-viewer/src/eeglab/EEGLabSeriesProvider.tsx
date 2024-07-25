import React, {Component} from 'react';
import {tsvParse} from 'd3-dsv';
import {applyMiddleware, createStore, Store} from 'redux';
import {Provider} from 'react-redux';
import {createEpicMiddleware} from 'redux-observable';
import thunk from 'redux-thunk';
import {fetchJSON, fetchText} from '../ajax';
import {rootEpic, rootReducer} from '../series/store';
import {emptyChannels, setChannels} from '../series/store/state/channels';
import {DEFAULT_MAX_CHANNELS, DEFAULT_TIME_INTERVAL} from '../vector';
import {
  setDatasetMetadata,
  setDatasetTags,
  setEpochs,
  setFilteredEpochs,
  setHedSchemaDocument,
  setPhysioFileID,
} from '../series/store/state/dataset';
import {setDomain, setInterval} from '../series/store/state/bounds';
import {
    setCoordinateSystem,
    setElectrodes,
} from '../series/store/state/montage';
import {EventMetadata, HEDSchemaElement} from '../series/store/types';
import TriggerableModal from 'jsx/TriggerableModal';
import DatasetTagger from '../series/components/DatasetTagger';
import {InfoIcon} from '../series/components/components';

declare global {
  interface Window {
    EEGLabSeriesProviderStore: Store[]; // Store reference per recording
  }
}

type CProps = {
  chunksURL: string,
  epochsURL: string,
  electrodesURL: string,
  coordSystemURL: string,
  hedSchema: HEDSchemaElement[],
  datasetTags: any,
  events: EventMetadata,
  physioFileID: number,
  limit: number,
  samplingFrequency: number,
  children: React.ReactNode,
};

/**
 * EEGLabSeriesProvider component
 */
class EEGLabSeriesProvider extends Component<CProps, any> {
  private store: Store;

  /**
   * @class
   * @param {object} props - React Component properties
   */
  constructor(props: CProps) {
    super(props);
    const epicMiddleware = createEpicMiddleware();

    this.store = createStore(
      rootReducer,
      applyMiddleware(thunk, epicMiddleware)
    );

    epicMiddleware.run(rootEpic);

    const {
      chunksURL,
      epochsURL,
      electrodesURL,
      coordSystemURL,
      hedSchema,
      datasetTags,
      events,
      physioFileID,
      limit,
      samplingFrequency,
    } = props;
    if (!window.EEGLabSeriesProviderStore) {
      window.EEGLabSeriesProviderStore = [];
    }
    window.EEGLabSeriesProviderStore[chunksURL] = this.store;
    /**
     *
     * @returns {void} - Confirmation dialog to prevent accidental page leave
     */
    window.onbeforeunload = function() {
      const dataset =
          window.EEGLabSeriesProviderStore[chunksURL].getState().dataset;
      if ([...dataset.addedTags, ...dataset.deletedTags].length > 0) {
        return 'Are you sure you want to leave unsaved changes behind?';
      }
    };

    const formattedDatasetTags = {};
    Object.keys(datasetTags).forEach((column) => {
      formattedDatasetTags[column] = {};
      Object.keys(datasetTags[column]).forEach((value) => {
        formattedDatasetTags[column][value] =
          datasetTags[column][value].map((tag) => {
            return {
              ...tag,
              AdditionalMembers: parseInt(tag.AdditionalMembers),
            };
          });
      });
    });

    this.store.dispatch(setPhysioFileID(physioFileID));
    this.store.dispatch(setHedSchemaDocument(hedSchema));
    this.store.dispatch(setDatasetTags(formattedDatasetTags));

    /**
     *
     * @param {Function} fetcher The fn to collect the type of data
     * @param {string} url - The url
     * @param {string} route - The route
     * @returns {Promise} - The data
     */
    const racers = (fetcher, url, route = '') => {
      if (url) {
        return [fetcher(`${url}${route}`)
          .then((json) => ({json, url}))
          // if request fails don't resolve
          .catch((error) => {
            console.error(error);
            return new Promise(null);
          })];
      } else {
        return [new Promise(null)];
      }
    };

    Promise.race(racers(fetchJSON, chunksURL, '/index.json')).then(
      ({json, url}) => {
        if (json) {
          const {
            channelMetadata,
            shapes,
            timeInterval,
            seriesRange,
            validSamples,
          } = json;
          this.store.dispatch(
            setDatasetMetadata({
              chunksURL: url,
              channelMetadata,
              shapes,
              validSamples,
              timeInterval,
              seriesRange,
              limit,
              samplingFrequency,
            })
          );
          this.store.dispatch(setChannels(emptyChannels(
            Math.min(this.props.limit, channelMetadata.length),
            1
          )));
          this.store.dispatch(setDomain(timeInterval));
          this.store.dispatch(setInterval(DEFAULT_TIME_INTERVAL));
        }
      }
    ).then(() => {
      const epochs = [];
      events.instances.map((instance) => {
        const epochIndex =
          epochs.findIndex(
            (e) => e.physiologicalTaskEventID
              === instance.PhysiologicalTaskEventID
          );

        const extraColumns = Array.from(
          events.extraColumns
        ).filter((column) => {
          return column.PhysiologicalTaskEventID
            === instance.PhysiologicalTaskEventID;
        });

        const hedTags = Array.from(events.hedTags).filter((column) => {
          return column.PhysiologicalTaskEventID
            === instance.PhysiologicalTaskEventID;
        }).map((hedTag) => {
          const foundTag = hedSchema.find((tag) => {
            return tag.id === hedTag.HEDTagID;
          });
          const additionalMembers = parseInt(hedTag.AdditionalMembers);

          // Currently only supporting schema-defined HED tags
          return {
            schemaElement: foundTag ?? null,
            HEDTagID: foundTag ? foundTag.id : null,
            ID: hedTag.ID,
            PropertyName: hedTag.PropertyName,
            PropertyValue: hedTag.PropertyValue,
            TagValue: hedTag.TagValue,
            Description: hedTag.Description,
            HasPairing: hedTag.HasPairing,
            PairRelID: hedTag.PairRelID,
            AdditionalMembers: isNaN(additionalMembers) ? 0 : additionalMembers,
          };
        });

        if (epochIndex === -1) {
          const epochLabel = [null, 'n/a'].includes(instance.TrialType)
            ? null
            : instance.TrialType;
          epochs.push({
            onset: parseFloat(instance.Onset),
            duration: parseFloat(instance.Duration),
            type: 'Event',
            label: epochLabel ?? instance.EventValue,
            value: instance.EventValue,
            trialType: instance.TrialType,
            properties: extraColumns,
            hed: hedTags,
            channels: 'all',
            physiologicalTaskEventID: instance.PhysiologicalTaskEventID,
          });
        } else {
          console.error('ERROR: EPOCH EXISTS');
        }
      });
        return epochs;
    }).then((epochs) => {
        const sortedEpochs = epochs
        .flat()
        .sort(function(a, b) {
          return a.onset - b.onset;
        });

      const timeInterval = this.store.getState().dataset.timeInterval;
      this.store.dispatch(setEpochs(sortedEpochs));
      this.store.dispatch(setFilteredEpochs({
        plotVisibility: sortedEpochs.reduce((indices, epoch, index) => {
          if (!(epoch.onset < 1 && epoch.duration >= timeInterval[1])) {
            // Full-recording events not visible by default
            indices.push(index);
          }
          return indices;
        }, []),
        columnVisibility: [],
      }));
    });

    Promise.race(racers(fetchText, electrodesURL))
      .then((text) => {
        if (!(typeof text.json === 'string'
          || text.json instanceof String)) return;
        this.store.dispatch(
          setElectrodes(
            tsvParse(text.json).map(({name, x, y, z}) => ({
              name: name,
              channelIndex: null,
              position: [parseFloat(x), parseFloat(y), parseFloat(z)],
            }))
          )
        );
      })
      .catch((error) => {
        console.error(error);
      });

    Promise.race(racers(fetchJSON, coordSystemURL))
      .then( ({json, _}) => {
        if (json) {
          const {
            EEGCoordinateSystem,
            EEGCoordinateUnits,
            EEGCoordinateSystemDescription,
          } = json;
          this.store.dispatch(
            setCoordinateSystem({
              name: EEGCoordinateSystem ?? 'Other',
              units: EEGCoordinateUnits ?? 'm',
              description: EEGCoordinateSystemDescription ?? 'n/a',
            })
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Renders the React component.
   *
   * @returns {JSX} - React markup for the component
   */
  render() {
    const [signalViewer, ...rest] = React.Children.toArray(this.props.children);

    return (
      <Provider store={this.store}>
        <div id='tag-modal-container'>
          <TriggerableModal
            title={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '420px',
                }}
              >
                <div>
                  <a href='https://www.hedtags.org' target='_blank'>
                    <img
                      src="https://images.loris.ca/HED_logo.png"
                      style={{height: '46px'}}
                    />
                  </a>
                  <span style={{marginLeft: '15px'}}>
                  Dataset Tag Manager
                </span>
                </div>
                <div style={{fontSize: '12px'}}>
                  More about HED
                  <InfoIcon
                    title='Click to view the HED schema'
                    url='https://www.hedtags.org/display_hed.html'
                  />
                </div>
              </div>
            }
            label="Open Dataset Tag Manager"
          >
            <DatasetTagger/>
          </TriggerableModal>
        </div>
        {signalViewer}
        {rest}
      </Provider>
    );
  }

  static defaultProps = {
    limit: DEFAULT_MAX_CHANNELS,
  };
}

export default EEGLabSeriesProvider;
