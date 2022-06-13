import React, {Component} from 'react';
import {tsvParse} from 'd3-dsv';
import {createStore, applyMiddleware, Store} from 'redux';
import {Provider} from 'react-redux';
import {createEpicMiddleware} from 'redux-observable';
import thunk from 'redux-thunk';
import {fetchJSON, fetchText} from '../ajax';
import {rootReducer, rootEpic} from '../series/store';
import {MAX_CHANNELS} from '../vector';
import {
  setChannels,
  setEpochs,
  setDatasetMetadata,
  emptyChannels,
} from '../series/store/state/dataset';
import {setDomain, setInterval} from '../series/store/state/bounds';
import {updateFilteredEpochs} from '../series/store/logic/filterEpochs';
import {setElectrodes} from '../series/store/state/montage';
import {Channel} from '../series/store/types';

declare global {
  interface Window {
    EEGLabSeriesProviderStore: Store;
  }
}

type CProps = {
  chunksURL: string,
  epochsURL: string,
  electrodesURL: string,
  limit: number,
};

/**
 * EEGLabSeriesProvider component
 */
class EEGLabSeriesProvider extends Component<CProps> {
  private store: Store;
  public state: {
    channels: Channel[]
  };

  /**
   * @constructor
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
      channels: [],
    };

    this.store.subscribe(this.listener.bind(this));

    epicMiddleware.run(rootEpic);

    window.EEGLabSeriesProviderStore = this.store;

    const {
      chunksURL,
      epochsURL,
      electrodesURL,
      limit,
    } = props;

    const racers = (fetcher, url, route = '') => {
      if (url) {
        return [fetcher(`${url}${route}`)
        .then((json) => ({json, url}))
        // if request fails don't resolve
        .catch((error) => {
          console.error(error);
          return new Promise((resolve) => {});
        })];
      } else {
        return [new Promise((resolve) => {})];
      }
    };

    Promise.race(racers(fetchJSON, chunksURL, '/index.json')).then(
      ({json, url}) => {
        if (json) {
          const {channelMetadata, shapes, timeInterval, seriesRange} = json;
          this.store.dispatch(
            setDatasetMetadata({
              chunksURL: url,
              channelMetadata,
              shapes,
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
          this.store.dispatch(setInterval(timeInterval));
        }
      }
    ).then(() => Promise.race(racers(fetchText, epochsURL)).then((text) => {
        if (!(typeof text.json === 'string'
          || text.json instanceof String)) return;
        this.store.dispatch(
          setEpochs(tsvParse(
            text.json.replace('trial_type', 'label'))
              .map(({onset, duration, label}, i) => ({
                onset: parseFloat(onset),
                duration: parseFloat(duration),
                type: 'Event',
                label: label,
                comment: null,
                channels: 'all',
              }))
          )
        );
        this.store.dispatch(updateFilteredEpochs());
      })
    );

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
   * Store update listener
   */
  listener() {
    this.setState({
      channels: this.store.getState().dataset.channels,
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const [signalViewer, ...rest] = this.props.children;
    return (
      <Provider store={this.store}>
        {(this.state.channels.length > 0) && signalViewer}
        {rest}
      </Provider>
    );
  }

  static defaultProps = {
    limit: MAX_CHANNELS,
  };  
}

export default EEGLabSeriesProvider;
