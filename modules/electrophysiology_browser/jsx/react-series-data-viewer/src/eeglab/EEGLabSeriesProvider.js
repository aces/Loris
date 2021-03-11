import {tsvParse} from 'd3-dsv';
import {Component} from 'react';
import {createStore, applyMiddleware} from 'redux';
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

/**
 * EEGLabSeriesProvider component
 */
class EEGLabSeriesProvider extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props: Props) {
    super(props);
    const epicMiddleware = createEpicMiddleware();

    this.store = createStore(
      rootReducer,
      applyMiddleware(thunk, epicMiddleware)
    );

    epicMiddleware.run(rootEpic);

    window.EEGLabSeriesProviderStore = this.store;

    const {
      chunkDirectoryURLs,
      epochsTableURLs,
      electrodesTableUrls,
      limit,
    } = props;

    const chunkUrls =
      chunkDirectoryURLs instanceof Array
        ? chunkDirectoryURLs
        : [chunkDirectoryURLs];

    const epochUrls =
      epochsTableURLs instanceof Array ? epochsTableURLs : [epochsTableURLs];

    const electrodeUrls =
      electrodesTableUrls instanceof Array
        ? electrodesTableUrls
        : [electrodesTableUrls];

    const racers = (fetcher, urls, route = '') =>
      urls.map((url) =>
        fetcher(`${url}${route}`)
          .then((json) => ({json, url}))
          // if request fails don't resolve
          .catch((error) => {
            console.error(error);
            return new Promise((resolve) => {});
          })
      );

    Promise.race(racers(fetchJSON, chunkUrls, '/index.json')).then(
      ({json, url}) => {
        const {channelMetadata, shapes, timeInterval, seriesRange} = json;
        this.store.dispatch(
          setDatasetMetadata({
            chunkDirectoryURL: url,
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
    ).then(() => Promise.race(racers(fetchText, epochUrls)).then((text) => {
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

    Promise.race(racers(fetchText, electrodeUrls))
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
   * @return {JSX} - React markup for the component
   */
  render() {
    return <Provider store={this.store}>{this.props.children}</Provider>;
  }
}

EEGLabSeriesProvider.defaultProps = {
  limit: MAX_CHANNELS,
};

export default EEGLabSeriesProvider;
