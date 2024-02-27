import React, {Component} from 'react';
import {tsvParse} from 'd3-dsv';
import {createStore, applyMiddleware, Store} from 'redux';
import {Provider} from 'react-redux';
import {createEpicMiddleware} from 'redux-observable';
import thunk from 'redux-thunk';
import {fetchJSON, fetchText} from '../ajax';
import {rootReducer, rootEpic} from '../series/store';
import {DEFAULT_MAX_CHANNELS, DEFAULT_TIME_INTERVAL} from '../vector';
import {
  setChannels,
  emptyChannels,
} from '../series/store/state/channels';
import {
  setEpochs,
  setDatasetMetadata,
  setPhysioFileID,
  setFilteredEpochs,
} from '../series/store/state/dataset';
import {setDomain, setInterval} from '../series/store/state/bounds';
import {
    setCoordinateSystem,
    setElectrodes,
} from '../series/store/state/montage';
import {EventMetadata} from '../series/store/types';

declare global {
  interface Window {
    EEGLabSeriesProviderStore: Store[]; // Store reference per recording
  }
}

type CProps = {
  chunksURL: string,
  electrodesURL: string,
  coordSystemURL: string,
  events: EventMetadata,
  physioFileID: number,
  limit: number,
  samplingFrequency: number,
  children: React.ReactNode,
};

/**
 * EEGLabSeriesProvider component
 */
class EEGLabSeriesProvider extends Component<CProps> {
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
      electrodesURL,
      coordSystemURL,
      events,
      physioFileID,
      limit,
      samplingFrequency,
    } = props;

    if (!window.EEGLabSeriesProviderStore) {
      window.EEGLabSeriesProviderStore = [];
    }

    window.EEGLabSeriesProviderStore[chunksURL] = this.store;

    this.store.dispatch(setPhysioFileID(physioFileID));

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
      }).then(() => {
        const epochs = [];
        events.instances.map((instance) => {
          const epochIndex =
              epochs.findIndex((e) =>
                  e.physiologicalTaskEventID ===
                  instance.PhysiologicalTaskEventID
              );

          const extraColumns = Array.from(
              events.extraColumns
          ).filter((column) => {
            return column.PhysiologicalTaskEventID ===
                instance.PhysiologicalTaskEventID;
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
              hed: null,
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
