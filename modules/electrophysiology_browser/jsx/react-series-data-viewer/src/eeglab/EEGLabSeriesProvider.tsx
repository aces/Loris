import React, {Component, createRef} from 'react';
import {tsvParse} from 'd3-dsv';
import {applyMiddleware, createStore, Store} from 'redux';
import {Provider} from 'react-redux';
import {createEpicMiddleware} from 'redux-observable';
import thunk from 'redux-thunk';
import {fetchJSON, fetchText} from '../ajax';
import {rootEpic, rootReducer} from '../series/store';
import {emptyChannels, setChannels} from '../series/store/state/channels';
import {
  DEFAULT_CHANNEL_DELIMITER, DEFAULT_MAX_CHANNELS, DEFAULT_TIME_INTERVAL,
} from '../vector';
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
  setCoordinateSystem, setElectrodes,
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
  datasetTagEndorsements: any,
  events: EventMetadata,
  physioFileID: number,
  limit: number,
  samplingFrequency: string,
  eegMontageName: string,
  recordingHasHED: boolean,
  children: React.ReactNode,
  t: any,
};

const MenuOption = {
  'TAG_MODE': 'View/Edit Tags',
  'ENDORSEMENT_MODE': 'Endorse Tags',
  'JSON_MODE': 'View JSON',
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

    this.state = {
      activeMenuOption: 'TAG_MODE',
      datasetTaggerTabsRef: createRef(),
    };

    epicMiddleware.run(rootEpic);

    const {
      chunksURL,
      epochsURL,
      electrodesURL,
      coordSystemURL,
      hedSchema,
      datasetTags,
      datasetTagEndorsements,
      events,
      physioFileID,
      limit,
      samplingFrequency,
      eegMontageName,
      recordingHasHED,
      t,
    } = props;

    if (!window.EEGLabSeriesProviderStore) {
      window.EEGLabSeriesProviderStore = [];
    }
    window.EEGLabSeriesProviderStore[chunksURL] = this.store;

    /**
     *
     */
    window.onbeforeunload = function() {
      const dataset = window.EEGLabSeriesProviderStore[chunksURL]
        .getState().dataset;
      if ([...dataset.addedTags, ...dataset.deletedTags].length > 0) {
        return t(
          'Are you sure you want to leave unsaved changes behind?',
          {ns: 'electrophysiology_browser'}
        );
      }
    };

    const formattedDatasetTags = {};
    Object.keys(datasetTags).forEach((column) => {
      formattedDatasetTags[column] = {};
      Object.keys(datasetTags[column]).forEach((value) => {
        formattedDatasetTags[column][value]
          = datasetTags[column][value].map((tag) => {
            const hedEndorsements = datasetTagEndorsements
              .filter((endorsement) => {
                return endorsement.HEDRelID === tag.ID;
              }).map((endorsement) => {
                const endorserName =
                  `${endorsement.FirstName.substring(0, 1)}.` +
                  endorsement.LastName;
                return {
                  EndorsedBy: endorserName,
                  EndorsedByID: endorsement.EndorsedByID,
                  EndorsementComment: endorsement.EndorsementComment,
                  EndorsementStatus: endorsement.EndorsementStatus,
                  EndorsementTime: endorsement.LastUpdate,
                };
              });
            return {
              ...tag,
              AdditionalMembers: parseInt(tag.AdditionalMembers),
              TaggerName: tag.TaggerName === 'Origin'
                ? t('Data Authors', {ns: 'electrophysiology_browser'})
                : tag.TaggerName,
              TaggedBy: tag.TaggedBy,
              Endorsements: hedEndorsements,
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
            return Promise.resolve();
          })];
      } else {
        return [Promise.resolve()];
      }
    };

    Promise.race(racers(fetchJSON, chunksURL, '/index.json')).then(
      ({json, url}) => {
        if (json) {
          const {
            channelMetadata, shapes, timeInterval, seriesRange, validSamples,
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
              eegMontageName,
              recordingHasHED,
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
      const channelDelimiter = events['channel_delimiter'].length > 0
        ? events['channel_delimiter']
        : DEFAULT_CHANNEL_DELIMITER;
      this.store.dispatch(
        setDatasetMetadata({channelDelimiter: channelDelimiter})
      );

      events.instances.map((instance) => {
        const epochIndex = epochs.findIndex(
          (e) => e.physiologicalTaskEventID
            === instance.PhysiologicalTaskEventID
        );

        const extraColumns = Array.from(events['extra_columns'])
          .filter((column) => {
            return column['PhysiologicalTaskEventID']
            === instance.PhysiologicalTaskEventID;
          });

        const hedTags = Array.from(events['hed_tags']).filter((column) => {
          return column['PhysiologicalTaskEventID']
            === instance.PhysiologicalTaskEventID;
        }).map((hedTag) => {
          const foundTag = hedSchema.find((tag) => {
            return tag.id === hedTag['HEDTagID'];
          });

          const additionalMembers = parseInt(
            hedTag['AdditionalMembers'] as string
          );

          const hedEndorsements = events['hed_endorsements']
            .filter((endorsement) => {
              return endorsement['HEDRelID'] === hedTag['ID'];
            }).map((endorsement) => {
              const endorserName =
                `${endorsement['FirstName'].substring(0, 1)}.` +
                endorsement['LastName'];
              return {
                EndorsedBy: endorserName,
                EndorsedByID: endorsement['EndorsedByID'],
                EndorsementComment: endorsement['EndorsementComment'],
                EndorsementStatus: endorsement['EndorsementStatus'],
                EndorsementTime: endorsement['LastUpdate'],
              };
            });

          // Currently only supporting schema-defined HED tags
          return {
            schemaElement: foundTag ?? null,
            HEDTagID: foundTag ? foundTag.id : null,
            ID: hedTag['ID'],
            PropertyName: hedTag['PropertyName'],
            PropertyValue: hedTag['PropertyValue'],
            TagValue: hedTag['TagValue'],
            Description: hedTag['Description'],
            HasPairing: hedTag['HasPairing'],
            PairRelID: hedTag['PairRelID'],
            AdditionalMembers: isNaN(additionalMembers)
              ? 0 : additionalMembers,
            TaggerName: hedTag['TaggerName'] === 'Origin'
              ? t('Data Authors', {ns: 'electrophysiology_browser'})
              : hedTag['TaggerName'],
            TaggedBy: hedTag['TaggedBy'],
            Endorsements: hedEndorsements,
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
            channels: ['n/a', null].includes(instance.Channel)
              ? []
              : channelDelimiter.length > 0
                ? instance.Channel.split(channelDelimiter)
                : [instance.Channel],
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
            indices.push(index); // Full-recording events not visible by default
          }
          return indices;
        }, []),
        columnVisibility: [],
        searchVisibility: [],
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
      .then( ({json}) => {
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
    const t = this.props.t;
    const [signalViewer, ...rest] = React.Children.toArray(this.props.children);
    const hedTagLogo = (
      <img
        src="https://images.loris.ca/HED_logo.png"
        style={{height: '46px'}}
      />
    );

    return (
      <Provider store={this.store}>
        <div id='tag-modal-container'>
          <TriggerableModal
            title={
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '440px',
                  }}
                >
                  <div>
                    <a href='https://www.hedtags.org' target='_blank'>
                      {hedTagLogo}
                    </a>
                    <span style={{marginLeft: '15px'}}>
                    {t(
                      'Dataset Tag Manager',
                      {ns: 'electrophysiology_browser'}
                    )}
                    </span>
                  </div>
                  <div style={{fontSize: '12px'}}>
                    {t(
                      'More about HED',
                      {ns: 'electrophysiology_browser'}
                    )}

                    <InfoIcon
                      title={t(
                        'Click to view the HED schema',
                        {ns: 'electrophysiology_browser'}
                      )}
                      url='https://www.hedtags.org/display_hed.html'
                    />
                  </div>
                </div>
                <div
                  ref={this.state.datasetTaggerTabsRef}
                  style={{
                    fontSize: '18px',
                    marginBottom: '-30px',
                    marginLeft: 'auto',
                  }}
                >
                  <ul className="nav nav-tabs" role="tablist">
                    {
                      Object.keys(MenuOption).map((menuOption) => {
                        return (
                          <li
                            key={menuOption}
                            role="presentation"
                            className={
                              this.state.activeMenuOption === menuOption
                                ? 'active'
                                : ''
                            }
                            onClick={() => {
                              this.setState({activeMenuOption: menuOption});
                            }}
                          >
                            <a
                              href={'#'}
                              role="tab"
                              data-toggle="tab"
                              onClick={(event) => {
                                event.preventDefault();
                              }}
                            >
                              {
                                t(
                                  MenuOption[menuOption],
                                  {ns: 'electrophysiology_browser'}
                                )
                              }
                            </a>
                          </li>
                        );
                      })
                    }
                  </ul>
                </div>
              </>
            }
            label={t(
              'Open Dataset Tag Manager',
              {ns: 'electrophysiology_browser'}
            )}
          >
            <DatasetTagger
              tabsRef={this.state.datasetTaggerTabsRef}
              activeMenuTab={this.state.activeMenuOption}
              setActiveMenuTab={(menuOption) => {
                this.setState({activeMenuOption: menuOption});
              }}
              filenamePrefix={this.props.chunksURL[0]
                .split('/').at(-1) // filename
                .split('_').slice(0, -1) // prefix
                .join('_')
              }
            />
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
