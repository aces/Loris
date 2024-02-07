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
import {setElectrodes} from '../series/store/state/montage';
import {AnnotationMetadata, EventMetadata} from '../series/store/types';

declare global {
  interface Window {
    EEGLabSeriesProviderStore: Store;
  }
}

type CProps = {
  chunksURL: string,
  electrodesURL: string,
  events: EventMetadata,
  annotations: AnnotationMetadata,
  physioFileID: number,
  limit: number,
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

    window.EEGLabSeriesProviderStore = this.store;

    const {
      chunksURL,
      electrodesURL,
      events,
      annotations,
      physioFileID,
      limit,
    } = props;

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
        return events.instances.map((instance) => {
          const onset = parseFloat(instance.Onset);
          const duration = parseFloat(instance.Duration);
          const label = instance.TrialType && instance.TrialType !== 'n/a' ?
            instance.TrialType : instance.EventValue;
          const hed = instance.AssembledHED;
          return {
            onset: onset,
            duration: duration,
            type: 'Event',
            label: label,
            comment: null,
            hed: hed,
            channels: 'all',
            annotationInstanceID: null,
          };
        });
      }).then((events) => {
        const epochs = events;
        annotations.instances.map((instance) => {
          const label = annotations.labels
            .find((label) =>
              label.AnnotationLabelID == instance.AnnotationLabelID
            ).LabelName;
          epochs.push({
            onset: parseFloat(instance.Onset),
            duration: parseFloat(instance.Duration),
            type: 'Annotation',
            label: label,
            comment: instance.Description,
            hed: null,
            channels: 'all',
            annotationInstanceID: instance.AnnotationInstanceID,
          });
        });
        return epochs;
      }).then((epochs) => {
        this.store.dispatch(
          setEpochs(
            epochs
            .flat()
            .sort(function(a, b) {
              return a.onset - b.onset;
            })
          )
        );
        this.store.dispatch(setFilteredEpochs(epochs.map((_, index) => index)));
      })
    ;

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
