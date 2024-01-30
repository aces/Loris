import React, {Component} from 'react';
import {tsvParse} from 'd3-dsv';
import {applyMiddleware, createStore, Store} from 'redux';
import {Provider} from 'react-redux';
import {createEpicMiddleware} from 'redux-observable';
import thunk from 'redux-thunk';
import {fetchJSON, fetchText} from '../ajax';
import {rootEpic, rootReducer} from '../series/store';
import {emptyChannels, setChannels,} from '../series/store/state/channels';
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
import {EventMetadata, HEDTag, HEDSchemaElement} from '../series/store/types';
import TriggerableModal from 'jsx/TriggerableModal';
import DatasetTagger from "../series/components/DatasetTagger";
import {InfoIcon} from "../series/components/components";

declare global {
  interface Window {
    EEGLabSeriesProviderStore: Store;
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

    window.EEGLabSeriesProviderStore = this.store;

    console.log('thisstore', this.store);

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
    } = props;

    const formattedDatasetTags = {};
    Object.keys(datasetTags).forEach((column) => {
      formattedDatasetTags[column] = {};
      Object.keys(datasetTags[column]).forEach((value) => {
        formattedDatasetTags[column][value] = datasetTags[column][value].map((tag) => {
          return {
            ...tag,
            AdditionalMembers: parseInt(tag.AdditionalMembers),
          }
        });
      });
    })
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
            return new Promise((resolve) => {});
          })];
      } else {
        return [new Promise((resolve) => {})];
      }
    };

    Promise.race(racers(fetchJSON, chunksURL, '/index.json')).then(
      ({json, url}) => {
        if (json) {
          const {channelMetadata, shapes, timeInterval, seriesRange, validSamples} = json;
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
      }
    ).then(() => {
      const epochs = [];
      events.instances.map((instance) => {
        const epochIndex = epochs.findIndex((e) => e.physiologicalTaskEventID === instance.PhysiologicalTaskEventID);

        const extraColumns = Array.from(events.extraColumns).filter((column) => {
          return column.PhysiologicalTaskEventID === instance.PhysiologicalTaskEventID
        });

        const hedTags = Array.from(events.hedTags).filter((column) => {
          return column.PhysiologicalTaskEventID === instance.PhysiologicalTaskEventID
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
          }
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
            value:  instance.EventValue,
            trial_type: instance.TrialType,
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


    // TODO: Replace with image ref
    const hedTagLogo = (
      <img
        src="data:image/png;base64, UklGRiIsAABXRUJQVlA4TBUsAAAvUEE6EAmIbRtJkmB37zxrX/4BV1V/ewFE9H8CiGNtSoco+BSJ5H9FCAoCCGWCin5U36JKQAc6d6HqAAGWa1iAc3USR/hLCiqE+AOtHeCR1nbEJG3LVGkgHTgxEYDrANnkn5Fe1xbbL0lcNtJrldMkXsZq1wPRzlx5fALAZdQexRVJeig6eHwA88KsAFz3TdKeYm+2J2x/yO+C3jHh9MM4d9mtjXx3YNkCcm1by5ODDO3h8Vw8HtzdS8iiegqwf8jIv59PFgXAcW1bdbPM/GT2k6srVwyVlZIz/yFYqX4V5qSAG8m2q6hNNLem0Nok/4g2hDUx+z8BEJb+BwLiA4C/UYKEbVgB/rWcVGZRXgDglAqc9AeIH/ExEhEYoD/Cw8gr4GrwgTGLQxYAUDiNR9gCv5Q3AKA0sQyAUZ4BADIA2AAiFwD3igGADeOYx69ETn7PDgA2bBwJEh8AwIFbCTwBAGwDAHwxsVYA50oRAAAOD8QRGQ4rMwEAFnIQfhl5GQCzgBM/xQBAxUchgO88v+DkPACA0XQeAAAjWAEDnBVwAQACRkCKSmNpAOAjsss2/le1/ubiQTSOF9FKbTQDAECNXGd4sNv2nlPaKRWOI9F5n0rEc43+QX2Qj9DKvLvzYcNFadMrC8BWdnlbah6OvrOLasvAP9PYfUe/B/VTd6fu7i9LbDxfCu1LYR/PaRnVgdBaztFnjdzFYw0V8u6XLV6jSw2nrXKKeu0gMv0auavicPbaWvVWaZ4OikrbWqmNfpCkoabOt8fCKJCs0SCU4TcAjKNnDYSHYTgCvjPggAPg7xcY4f5Fk173/xxZspx/ZFadc/q07tFay57Vep9jX1U+gFajrpYje2bvdM/p7tPnnFKZga2IzIjMqpNZq3/W9Var9mZtVbsU3havSWFxtXlMooEDFGgRvRb1H+AQWg57hcVZrSxq2VhlUZOWJo9NsImkli6BtNhD9/JQWhyAWvV9gMFYqywCcuj19gMQQa39oibdRqMoxqJ8hDWptbwCOKC16CfwHNm2atu2bXkutXVYvNZmZgpu/eXYAnCQ98Tee6vZsm3bqhtJa597n54Mkc4CF3eZmZmZq3qVf1R/wNTiHjMzeRQzkzXCirBkvffuPdsD9n9qGvv/95okBGYI1NfdeurepK6Qt7u7u7u7u7u7+/sISZWE2qnr+m671rPbEmghEyRDi7adIJJ1VAwBeXFqWkKg7Hm/BIR367Q5pe/lIDClj5cc4BQ9okDeyb/BH9/DkHmbxF7WIYjhnn/+suLN/vb+XQbHnMjHXfSA293BIvjABJcZveNGyN/29j88AXMZsztHtUsR1/MhsU84hLJs72XEDgkXPR+SHEIpK6mMZJ2Aq3jDP723o/m6y5P0EHhiDkRMs4Uzhw23c5JdUEE47+tHHtn+o1f8oE0YMoRiZi5HMQUU5RUeY5JYwkPMOy4Pg9v0UqOGoMmjjawdQqFWs4yqqeQV/qreb0os/hYmch2YIcDQOyGBMLFGryKIMgS/A5dxTcmSU1RXFT+1rRsR5QTlSj7cU7VJjCbmhFNIOI8DjuMaojiv8HflwYeJ80K4LMGI4Ah6KyaOESkk0xIOziGKQFYhFgI/NnpUwhXkHv7nkqC3Uo8nLyMoiO2RyRyJrKIKnsBGn/AYHhOCHRYEQA+lGo8n18gpQrJLx2COgZBVVFk4DIG8BPvnJNhnkoBVIdhx9E5IRiSRv0aPgup0SeAM413irKICnlHi8PGBUJlQ2Hi1l1JLjasMXkUgaFm24RiIsgoxwTN4cEQCSGFCwMrgM1/aMyF1hA/wEl5FCMpgxKqIM4oKCwB4IAAYDISBDXqos9TQSymBFbJQILaEWUs88kTteOl/gWdgvROhjv6LAFa0QDWJGfGJrwgx1j3QQx0AREQUYaFQUpxaElVUrT1Abzb3QiCKMNBoOxGEdBQiVdT8uR4MirCimYE65vgLCbaioojozbb/IiqsCIqj1TBm/FQverSNmCiaBsd0QBSqEKrniCr5br0XRFjRMNiAoVFZU4WviqpkSd97r8saJWOQABpshdfq7dUyjyvmndKImiNQsRUevIDDeNx7nYiIorZvU6M6LGmFEF64yMD4v/RWCCkq6rmTNamZKK3wd/gAxYle6zz1+S0PRWIbiVzNdY7gYY5XSz2lEMLXxjmHXovzvugEbeTGhlLHngRSCq+BuX2M0XMxcWl+BSWpM7UFGfa19QCaCeNeS/gv0xpWyIrCwZCRcl8hBO7NIgjwjwFrk62ApooheGZK4e3wKdkBpKMeCzEQLa7toCUcRabtKQQRABFlqCEzoQW1nApWVFznHrQjJZMDR5ythR1B2LMqculb/+uqSq67qASiCCXVasfu8ydJhRiRw4BzkpBlrS3O/yDwVCuI/7rH9rXpsNUDvk7idVZshWF7cx1BgtXRUNevpW89wSEkJayvIU58jaSEIEsiSZQgmZS0NWdakKZUxxEDVkhQp+nikvtt9hQeSMSI7yYlsoEYwwpJBOkgCcMKQdiOP4OOIAgJxdth679eYCPE4xKzoZzda7da4XzHQwgySU0H4xafdn5VG4o8/loJWkNLyOFNsi3E4t8NMbsgRwPLg84QpqNIAmNQBqIkAWDztWIAOe4AfxXh3yF+Omua7Iy9XoQVYdOB07Vs+HbH+tuKAC7f/V+JlZB+Om//545NZUlpA2xKKCQUE9e1XyXA+GNyXPiaDdafWm99Pn0oIooWOY6NKlklFVNLhA8BeT/oJQQFvcnHl6bpeNp4OlHIdGouAZWkYiL2A2MtDit1lO8KQa0VKyVlfoMiLA7AJkEgoZhgAqAnGPYSCkiECIFUoQZWtAJVSezBkENSUQl+wB3qDcKGhLZpp5WpZwJyABiuZEJCUYFfb4gk6gWCCIRjFQwEjrn0kAmiCJu2cX0FECqWwguSduUSeoJNEE9oDR24tJDp6KcpGuQAMBwgthR+8B8Bxod6hR2Sbn1UWvZ5kihaTUc/zHixBKdPt/YIs4NEV9KCAla0CgVMjbLkhMITklK73mF2UIKFfDXNBSsLcCz831bCUviQGK6nWElJZIe4lQ5fq2g891RXxxbRR+IKjyTtsl5iMutrAjyRCpKJYt/jQC3UezNYCo8CwDiD5l4k35X4Q1KI3ZrDVtrWCxIkFwkUf1+iYuIigSIiMR1rCffnXG+ngXYD8x+31KzGnf9Z4goR+aGf1PxFhkA0N2v76S61foPjSmHoFOgU1EEoS8Fc0n+UAtNuCSJ421BxWw4umE3q277+S46q/TbDDY6xKj+Uo4uq1jku99UBT7wxMZJutMAnZ+s3twjaSKQBUxCBARksANgUJABjLCFH44aBkZP4PPF6UsO2efBLkrPxnn5tbtDB4kJCXLHuGCW43F2z4ju4sw5/CfBpicVkkPK+xCdpQdXriBVUUzgYM6AQV6yjAOCQvxfOmCLEk4kQdHqL8xcltrpyCEe+bhZVxSA3lmLqsJ8BdfqAnN0/6u9K2EmM8sX7PyspVRCFDNS8vgKApLiicpQAlpT8McjdIW/Iq0TbCSA6s9n4oqR4AUe+a8KAaRccV1QXEuCW8jmyLZV7goUEJnniLUnxY6ItqXJmHTOVXUUlBLQgQj4HYqU4KqnUHuKaqtPihFAgipCo+QAQUlzhD0GtCvJ5q6BcwGe/Imad6LRHG3eJBI5Z9Ge8jMKOwpsICGbAeOm7fbd83olq7Q2S1J3QXBGwQg6OxfoKIHgVS+EPUiQQ+zH/RVpQDhMYOY/6rRHUnUZcOwAF2JhwIHYVHoKa2p3IadUW62cQqmwReMg3liaDtoi+6I8tVPWJuMKLAwyX43HDPS7/LbFhbdC0sSuFBSutBLUpwexjtaPwEIjGDfOZB0P5FWs8dCXDY6yQ7RRgs/DW/pUcAfgR/qwEwEXihnm877X5u8SljlT8gYog4ajEfCKOA8CWWAKgolwfkNMnyb+1RdCFCWNR8i9E/nsApisZ/ELFRgS0c35/ybTFY9b2VAxlyZOgOBbrKwAQdhXTIwmAS7GKQMl64/l0IBzMUOZsFiUsWwhFSZBJJEAUgaQAzAf+rmIyBNSFwDitDEGpYBaLYRNo2OTsY8nYqL6xy7LEhi0elSR/j0SDqNUBOdpVTEQBLGHsxtkS5iIcEfSBZHj4YJfdo+QxW35iIkSEFc12B9AatalSjQLAONcXo0s2bPnryV970Mzi2EjMVHYUlUUQcEsO+U3DfMc6SV5l4X5NdbXpvxAm4ooKpLxfSNkwxSXnO5BQIYqFdXDs1LTZUfghcAQuv8NcACBgWfJ9E6FdNnu7a9upwxBXiCnBuDBXTiOxk35G5gQ90UYSaznkwRYDNA5PdhU+Avke5gIgaDd9//eit1VCG5JpwCqIUIOl8Digh7mQ3xAnLBGMkzAFon9l1yqP+dGOwhsCgNLk+C5BLHkkyfqKDY8VVpCkcLDI4M3nm9bxNiT8UuGgBhT4XbmNoGJLiNJJDBULf+Qdm1FVLOSXTLDVRgS07ZPRr9RL+Rg3TPUpLWAnwR9j+/UVDNaWqW26VUnTSUYf8wF5nUgUW/IhSagCa5Ot0dpWY96pO1J0mVpOUzH6PtoSYjsJlCAKGVMX1dkwtYZAZJlaXiceimEJ0XYSxBgrJDuWB16oqB6SeAl5fqoaqmwhfdOe3wWxR6wIJ227toDvrpiYKkHJKm6Yz/iiw5YQN5JY6kuiCNnRE5PILOO4onogZVGYi+AkQ9Jul0HUYYs0byaevZagAFslcogrvAxSumGuL5f8lXQQeLugug4j8f+9rl6MxbP5wAKNtgT6zSQISRRBoICdinRL4adK6pAByRj9T6QD4fKs7V/SYZOzH2ZoflJpJXgskdismZJJ+PNaRhugWaiILIWvSkciYa58LqnILlhCcjr5eySkpLaXhVpc4amBqBW5HDdsKoLAS22RmE4ehm3FVNcZd5a6pfCFBLj8jhtu1V9IOGqL1KeTr/P9FMuaWLjvEwqRInGef83Uw7tgiURqxp2lRJDAikBzAIaN0OK4QiQkQCv7XXnMBjxFoNwWQiTRSyT/yy9SNILj9EpGbrv/0FJ4wg9g7HL67OHdsEXyP1NYOB3MQmGZvc3X8lSn2nzbDb0/VgVPqj0Eylsk/d7+BYdzthEkX6NWT7PtagKsvSZuQ879cBjjfx6SQLkrB9rcI9ZIREKkU/idQw1Txs4iBmRJKqadEeR0UCY03RC4A2tC/TdIhihE0bCnAFgrZJuZsSmn/px+M2SNkhKrsObknGstIQSsmMueAmxXUXJSMdFjwoADxnmbkbgIe6T8XiqvjlmwcwCt2AxVCUVljgieVBcewnfLU+qORQ8nYI/k7Z3mPyVEOkUieAGcqmWXjayvMEPJPUXVQPJ43d+0OShxEgkI8Y0JUzYhl3wLP9qQtAG7EQWzrJMK30gA96RDrlJFGdFhJODkbnd/goRMfXJKkqyvACApqb0OPnfX/U0ZD1XxWsGHkACiis2O25GQfzRxH7E2ew0Hy4yIkwpPYK3mk7kpfesqvUPQK4hEJMFXXpvc7snLSPQFK4iqTITYU3gJsgqMZYSwlIs0jJ6tBsVTnyzw6o8GkiCoa8p4MDm+ghWhoA5aYiES9rTpByAnX2S4wa0qQf2Cev+oAElqmkRJ1boCyaFLJdpyAK22zc5hWkrhEUHmXCNQt9H5+1OgafpNzbSdqvXfg1BEXEqihFDyyYRSgjcFUwU4gXakQAVE+xXszlIH0PaeNjmTPStTiY55ysdTwFf+17TMd8T6FBBQUllVJqZiBRVqfSDglMKrsTrQE2ySCj2DhOT8LogFVoRwrNtCkGVfQVMwAxiPx/kPMak4FtOx7v21Zat6YiM2j2VfIYIPGPcEMpHP071IB0+Q6C9xskyanFZ47OsRft3YSkUVkBLfMvIuHlvVc3/olIKCD0BEGeooxxG4F2gJxJFCXPub2K6vAHb4QUaGXBsBwVc5wLlDOV/r6/aJFFLju2pV7C/DzwGAdVd7o79uLL+RlCaeqyKH9JARUYRJB7AcTwAEWzF1TTH668ZyG+K1gEeAFBHAita2rdVMsGBxcvAAcDme/ycSkT3KdaTK10a+fMKwFIipwj8Q9cmsnEYyk/hLgD9UtDxSRWpIBqJoseP0SjZQZCsmGiLrF+eyini0qX183m4xdUtFhRWNmRzYZx9RVBIi8vpNho8Q/z3UfrrPbg5QpK9uuaGRmjaIQBX+wqOPKHIXicuSf1Oz+21T2wU6wE9TNN04CcyS0lFUiggZoTHGyNXpVkmuwHSI/4d4eM6dy50yWcKvWFjXFABrhWyEKKPwhAAAOZp5IfG8xJykuRomWg47HTTbA1bUXVGAbSsSMgofQpv/DxghpC3/XYUp8RkpGvOSjhEilbr1j/xgAfsHS9iEOGGLcEti6+tauFYzXUeHt8cVs8eGAlqxGcavV1CKADg4M3ttX9LJm521fV8CC1O+ua61vtNQ5AMgwWqzzVqvrwBriQcBvdR2zncqQRuSDmA/opDIKjxFANT5xO/qidii+QFgxUXzFnyVwlP4aM1eCJmGJmbAijCm9usrAImcghJCT5XxN0QhBQWiKjNU5xS+4Hsq/AErqEnt11cAP0ZBEd9TUQ3YEORiCyjkFaLBHYEbP7m01BshYmL6d0FYIEvWkHxA78Mvw1/TFqwkOCBiVyGA9LfEnfhu+C+hjnofgQLRX8zhrNuCrJhiIRF7xh5/fRvdEpQlYQs15Skpz2D7RsezznmqKxQmVAZPZb0M4ST60zKJKEG0zOMM1mo5MzTk9ZaClntz0dSMEn3GXsfqXcU9hXpWjm+VFQb3p56CMDD0KorvBFy3/nX4jNsU8seqj15FKJx/q+uczZBXFjfGBCnsJiZqL/Qd79Ge93687RlyQnWFYMdf+lLggd5DMUboiHvd22+aJldX/XHY47qIFcGQeUcYlmd4cOONkIKFWG00tH0vaW/7rzJ34OFTp9AuemBpSRD0DmW47Eet8Nxv1n0TK1VvCH8ygAhh7fxbvdzZNDDX/v9Q/yGlPNmTpwyGhOJBqwzXT2nPfc/IvY++9zAp7NSpl+LEZ/YEinAWBLzmb6mYvhP2JlQR5I83/GO7ayFBKCW42mGVvOl8bI3g+bev0bHujNWeMhUGqlHtb4y3hZANMNUgbeZ9125+z7WHHz5xAmjrl/BgrpdtBr6udE6mP8kbhQWfMBgTJqw6T81UE08blggqYbBktgu1AgwmEIL0b7aGA1dl6NgGZV1o8RE02BPS9dZGm9to9/2r32uB/a7vRgxqEcsDyGdFaEHAdXR8mxaqkurFPQRsMCbApfnIeAFiN+rrhHZCN6Hli0cq75yVhHL0OMH/oi/+t0+Qym9vVJx3X7VOH4M8MZwxGDV14ckXfi9qL/z2IlWOvn3/G+wTh06c0nvHB/NWEwj+9f7wrNZJqJUqLEKVwRYZ2Q1Mz7HxXN28PX2HIAyHKEejsoRzzlkJzrmy5BKONHjqfPGSw/lq2eVB2dKUJyca3ifeKqkyiYVGqj7jRLvp8YgloboHjh+H6iABT2H5SDgdAVeuTck59+1ANVZFGBSh0GBMiFsLCWO3Ztz8j8v1AC0nCV2EsrLk0YjLEho2KmVJWZbMTOAwHBbOTare7UPDWZCnofjhgMG0MGU72H1oXtGeJcZ2vSJ1gBR2/HhOKsIkAl7j9s+a6bWEK9NUQS0UuHhbZJQLyvy+ZeMumM86bhihjdBJaB5yyaW+gQvHmsLiDPBInditrbWFoStw9akzF0DZMFYmNxWGfyS+FE6AiabQXqBoT3uyeeCAplBFXgvLsbJzPmn+yw96qlPVigxTOGIwJtR2GtmZe6YbTwlzs8dccfIhwqmSWdVgldPkIsH/pEDJmgprw7awVmjNnrEpuBotW6FMtbR46ZLBujBxqVn0+RPt5v/V6dqRWUHsmKe6OHUqpxRj4FU+XU5vvNSwH1RPdBqetBIsMK3PZ2Pc11+aN+bDGwWh40MfZ1Z1Sy3RPd5Cx9nBrCVl+7ymhOGwrShcZQd/3fTqc4K8YZpSoZMGAyUSAUYXoN39juHbnuwcOBZtViiQL5p17HmVP9A2calhL1I9XDDNtjfsJmfzb+NZ+Xxshx9Ya0VR8AhlWWoaZoAdO3W0AaxPUAVQ16tDK1J3UODC4fBlUDYFZQq1IhYNrnTQmGtKfeYs2k2vtqY9dHDqBD7mY1Zzwi275ic6cNbXhPyR6g99hKDBmCDcrG+iO3Xzxu4XmusGimFROIcRRlpdZq3MQR3OuchhK0JVdsryYURYG2pPcjc9wttl4xmKvM6g+KHEYKXE7SYN1U5Hbt3VmEX60WPHTwAnVjNf8bvwj17zN6V+/V2qt1AFNYgYxdtCJdMMs/vSjdt3M58z+7tDrUxfwT/iiEbzxpSEhLA+rtCM04qG0WeOVlQ4d03Ozl9gkDfMoFRFuQgo3lQqtBUZddJesFN/5otbH4PIGC6zFb8LuPBbBC/5fvZVDqveEBLhgMGYEE/UpTHjYN5qmpm1ZCPtMkoelaNomWOtPRTQKiRLAETnEjSrmfWHFLQPd1gUhTvbIwuvmBfKWz1Cnspps6cQg6VBYq0FfbbS3sb548KcP3Lg0Ujv6DVYBscAX+WTv5/fNLPqx6oX2p6It4Uqt5lYqSG6I4o9lZOEtocIMsHLun8QbRdg7ZMrlBzRpHd/zECMwKz5eHrv6Fxlj8IN87ras/NIeXrup1SsjpnecduikYVZRe5URu7cq4RQ3Cx2jb8TtmXvvepKx5SuisSTPD5lsEWKZB0Te2E8s3Xq/plOnXyIUB7xIbTrEH1cO4c4PTtO+zZVe9DvQkvXhmsxrvGlec7xiz1N2ezB8sSc1BgCPjKRC+uZhtB3Q7vpdnIp4hpnZFE4MwKuuU9HzrSEqwh7pZeC32BMQFcXRPQ+3bxlzyvNNcOLX/x5zGVUE5mddnD68yWmXaVJG8dAGdus1j3GucYbPdh/naFp20hZ12j1Q5HB0BCbraDNGbQbP7u/2XjNTpxrLARkmyacFfc6D5qnoFagiqHGYMt3aUzOzMF4/sZ83trdV30UR+qWHNHozxfW66JA3AOmA4nTro9cVCgvbhjfO5LKbUf5uanKekWeCOcNtlKdaiXGG6TfK/RnfeTeMb3ZE1hayaq+7xIUXfAa+ydYFVFIhGKDMWF0p0bG7tq8UcwtzJKL9H2RMUOkjKPdXmFqt3MKQFOgBLuiKIZ6UZxr7M7tquTKQd6sKlOlQUTYMM0gebkBfd8D7W3e5Lx66EiJoBRLK5mjefXfqHKa1Goj/AuHBl++hcW5lOjdIfY03Biqrh4O0H4iymjfpztksOj7Oq1gp+3OuTjXOPIg1x46kxCv30P9WVvyeij+xCGDsRL3W9XQQot225tpdMez7p84pLlxbR7MjrLNnwlf/3N1Vw9UPxEW4bjBGIl4Q8b2ZDGeNmVqJ6eHxVC1C1Ztj2LGXzGSVmbrl3X2oePg4l1jrUJM73hly6l/uakok6VqaHDHW4mpi77VitbfsN7h/ySJEdoKLXqLBzNAc8OvOLnlkxLyD1Sfun+TwZgAG/PTjfsczLe/bNbIwg2H+ogBqmw0GhFy+mBW13S+3eSusXZPzKz9FYp8vG64pv/N2pJHBq7tu1q2ziOVaectIiVosDQUV5tT9YWi3fh48GT9MmQePea1uos/ehtOR5h+DsIrffFLefKYwj6rYkqF6eukTUzN2hjP9t3YPecvD3zoQ4RqAvCIOdL3ldD6vtjxF1DEtdutRU57+EQeb1p/ERvAecUNua/qXE+T1+ehSjUnpw2GEidbKeO1XbU7XsPQHW33YwI4i1LxzYArjk3pedd/DfqD6vGACAUGY0LarAVjl2LeUi8sjNyT76f97wKNMIo8rdlxpO+Lbzei6W4FtN4xZgCnRRvixsXne/7ByxVl8yBPoUEEMd5QKm4QLTSh74Z240PLegBHb3aRaV5thrqNm7AXVK80GcLTn95szO9LRO9G7BnhVqxbpo2/Sn0g2pV9H1Ifw5UMYwCnXTS9177rlxvOFPK6oPihzGClLPea0VB9Z+SZH+r4zpB6NG4Mt1gGs2ddqnT1s/dWDKqXCAkcNhgTJh/UuzV3+7vxVB+f2Z2kWm/jUEbaYb3Dd1xY9X2LTNDT0rZ3vLqrsxcMykbIE6WCEpwhgBOEiZrQd31okac92DwWO4bres0r73ZmM6s/2Ks6KBIN4ekg8+pCNsa9+xfmzfPRS8Mi2vdFwtMxQRLYhQYWpwJwrlDbMFK0Fu0dz9il4CqWtxZ5mptFQjLYGdDFoOiztfZWb+u0p+XixnAPdq9m6nYivvKH2+3rEP5VIjpnsEWK/UaY2Avj2T47ucOPE1q7Vm6Z3vl1vO/rKtcYuhenK+KGG8Ohc5UNvz3UnN2Qp4VSjU4YjJVktTBSP9Gf92J4x8e+q/WOL+1OLy6UCLgq7eBZCE80VZHSK0LAtKhhIUTvi2M3nyw21wLaQ1AfMZTl/qhb5mAdGljUokP0DyMyhosONyLTDBfn7MilPVY2zyBPqnUUeQxDogCzjVrfezry9u/6xoEDp069tOtc41fgA17797Vx6opamVRJ1BlCxZIyzfTH52DczrHnzHw3Ov5iZt3HHe3fP4KFW4bs2LQ9plmn/wzDOS6UJUPnpifw9smmbYOyHrIXig2GholbwZY+l7X2tNeZsbfVPnLMa7g4flybY+yOp/X5x6Hgkvt/+ye1sEiERFxmMCak7VrC2NM0bj20VGurP0noIhzlksv40IBj7Q/FKjSQMQo4TaEHGjn6M1NE3LjrhgvnzkreGJQqXTD8nf0dQWU0oO3Imfacx3jnmFDcRyO946DTmlfLTfn6SbWSropBMQQy/0BrtDSXMHYE8+mW1Ic+RGgliDERVS6Th6ezSoESKDVB77lj3DiclaH4apa3kDwVNYsENlgaYvUHze3Q3vp82Kyw5LWVMB1cWBxqCNga+67NdWd1UH2oIpw0TQg3ENubbjxj59SucObkQ4TzellUg2Th6Uwr0hOUenUtIB4zx1iZleeGTe3ZgzydaKvgiMFQGXbGNUSe81yNvEP3SdU7vvSlmiJ9zfafcWzrIvTBXugRTAzGBLg8H0V37SX2tsMKWdCwMIanI6EBi74vA7e46C1Ye+oMo1Gx4ZruGl+aOH4xKf9rcqgR4A2DphbNtHRtJ7RbX/3KAWFw0+8dTyBQ+Nf/Q2uZvITqT4RFqIbBy24kpmaF+by02O2Z7+s/hxbhaTi78HQ27pF6JbSqmmtsnGbYaJCuT2veJuR1odVDocHYMNxoCn3hZe3tnzXWeHTn+DHP4KJdJAFpKMJpCLjkhxRd+HUdrFy76otBCkUGY4LEnTpHZ3YaN2F+YZyPhKeRUng6SxWxzWrjDatphu2Wh84lZcOEUg1nTU5/wNEatLsf6M//kNvHHu6f6r8UoQU9gAeTaV713a560yvDv8obtwwNK8hacuFl91jMp4bN4bCIiwGmF57O3mZZc40tpxlwflR2WULeAnmKG0XkM0wzhMml1il994n2dn/+wiIJRsT6p9C3Hm/8LuC8N5DL7HqqrHohJMIxgzESu/WkuWctxtOvl9M7Z7Ljx1+jcv+oy8LT2eQaa13TqCyjq5H03nEyp+INnl9/5qBMC9mPDpnWa7YSw7WG/sx9PrLrRSpuveYglnCMgO2fTKe2JcN+rHrcaQpPt8R6DdF7U2M353j7iwgdX/QiZs3FLTU/ouyS8HTmuXHMen8P/QEQF8C5MnH6oiJvjJWJqNLw3KA6EygTdSt95ozILfv+N6OT4Q8AXivTQ4DTz0XY/g1t05awB1Ukyg13RCVVF1N7E8bzdovdc3DoJKHzLyDqlakUzEgQns4VBfQFGzHXra0N43rHLYngtaVl66CsKy1eFDBYGiautGJ99ijarZis3ci2pxlkjE61q78UMh1dh9JtawxNrh720E8UNE2XLwzRnQ3zxtUXWl3YsHivkiPh6TLOkehoeDqDe8mIgOHQtF6TVP6Vz155TkOZzqBUccpgpBSJ1misLofuODx0+50dIdxjOI7X6lntRgp9K5HSYBjeUZVpDHPzMO5A7Fnm23FuWfwKMocu6fsi9nImKiKrC6NBsWFs73iheujyE3mTUCZRLxKiYeDaGq3tU+d2tixvSBZsGeomUls9HDRN5tYiY09lPgUzu7NkYtwyzcuNGWJzZCjb+b7PXeotBbf5TDLqzmfgUyfiGjuL9ZraQ2f6xHfdqo1nsryeZS9RlsRqKVjAK/Mw7kmYt2a+rE9IAIg8sGEIDWjXdbzvc+y55wbxt+v+9Z27fTkJzeOEy8DEaW5ckvWa1+LceQl5Q0KZlOU/0u61X/UwuXfP5rNmN32vG6vQfVww86gc7R8ZQwNarhv6Pvd5ICSk/r1Zv/n+Tj9OcKnZ77LRNUbkD70oCv3ymGaVIWeeJ6cvPMv7t1TntwAqAAML27Bnc2fmmH/5zF4arYUL1s0u1abFU/d3Z3jawWlzxaHlh3tc/GDGL+MlkFTIrOhtMYyu19RC4ps9sm2d848JCkIwbPoc2PplwLYvgXV3QCfcwJ43Abv/Z5j5n6D+WIMUIGlvH31/lufK/eVoVOqeRAmw69rwtAOgCYH5x3v8/Ac1lxnHWSpoO/QxHJih0uHakOA505OeM+HsEwKcBBBDfwWYugJbvxK8fNNnAc0XMPM/4Cv2/B8IK0BfKtAnAinyC/jVHowRMgSnHJXtnCu7Ozzt4BAVJjyQJ8tq3YbGCpnabNQzbsvnesYzK86+LZiTDP0VktDOSYL+qhcgLAAAAwwgJODwHH68lwyCPdpfloyRQzeHpx3H3gWR11OqJ51zGSxoe8Qt5mJ4rufUTzp7jFhc6R/t94+eXoFvBZ4BhICjgQ5NM5yWAAEYHBoMBp4Onz5j9el5uUZwsZ9LAF0ennYOyHoBTneNShSbPRhv8/RpSefa1fqnj/ZXT/vW4AkAgFBCww2srvQPkQABWD64LPnuvXhPYHFK1vv8mHa71uvPAQFazZLAXeK1H/eUj6OPdjWs9IUCngK6RS0NAg0GR0kDUmD5M5cPfmZd/nmnH/6X3SgSEOza8LQWzukOwS36z10Xz/eSoimn134PJEEfpwfts1BhWWelZQYMVkIGIUAQfOZnLhPSoTnacJUugRKlYwd23fknxV1TwQEuEypc4vXv95XPQyWD1T76ByOshmYYDBAQHP1MTwKpsLy8xeP6ZvxSB1jt3Twcdd0hXObdo9nxjk0SVbovof1A4DMjidQAg0FfShgcXB4sk3QCy+WvJ5ETlCeRJ3IFuczd3TVbfwJ/JTD9ZLef/TA9QVAPsmXra/Qx0Dna1z/cQ8AAi337K6lVcFlzmMxYAbAMLEJNsmYSP5pd5jghA9PnGls3QwQ4vbfL9C1jBNJW6jZZLdYGl42Z/komCps8xi/01ZrLDDI06SMDN+K90Lw0569LDdtMG+asVGcfUqYabv/+Bb7yvl1+bLYPBveIJZLTdbf/t8uFRhgk9P4b5pJLlFmZ+WPZJtVcRnb55Rihm/C0f8PQo5yZWXw6y6QFG/1+F8aLCeEXcXRYzLDfpRwvJPPEvARPUvgqYm7s4BY5vxMAVq1OK4EEzTOWyEntwWHmxwTyjz3GLMC6moqTcmvpfhfmyQMEzNERmkORoOD5PqqufRKBfPEXE3wEcW3oeJHv8+JhAIPBURvqZgg1wADAgt3CvO1tYnf06cSOpMx/Jc58+kiCdXUc4XL3/cpSut9FjNB24JMiS5gdXIHCOVtiluawK93i7jId7kdEkg1ASFgNBZhp6kA6VI0wAJYlsguuLhMuMEpw19+9s5UIA4+XKPU5bVU2dEncMkb0K2282LNNvl+jf6nkkNShb+RvTjkGQDAcRM1hgXD2Z2DkND+pq3+EXWFGyrQucWTxsDqKwhUJYNZWf0D70BmL+kTYu8/8m5BuK9XBUIfQAj89jqOBGYjhHY/B8gABrHnbDUIdmEf6UXD33rwbGqUF/9F3+Z4eI5XQV4coEiQOiC5EXPxTWj+ekNrgCQc9Qxn6fZKwevpbBIDViNS0QMMMK8DyoD8gzu21ffgXFGUZXXaKrj05diAETe0YJTitRpHovrX8qGTwIpfhCPsvIdiTzo9KCCv9o3/s9B8jHZoEdYY6QV2B/k9/T/VfWwZwUBLb5+7DhGpCGXNZuhJtbdHVh/s9SSWtNYeERFYdL/rEvYRACZmRUEVi1u/3+3+sDxxpEZCE1X5fe5oPliW5++wekZYjhIoSJXMZWQLQ1bf/xdF/+ait5IqIlPTEnAE1HcH5bftLF9jHiff7/0D7/A4dWlEMBst/bCClvded/5A8Q6jVjwIOwy6uwnDs/q0u1Ry0Xa7MFyeWEoq6zIucT99fMoo5f7/Wsl/XrDh48ODplT5Wl9t7Q7s8YztE6CKcYQfm0rErim5PQPAA+Iy66eGdrmKEbkLo33LnJC2XARmMmOGKYt4fd+f53y1lFYPBsmBYPr16+o/h0KAlb866O95wYIQnfR7AJUp9DZbr3hL9MxqCeK+u/22nzfjHEJ7yeOckAJwh64BdUQyd24X5Gf1HNfmPlrgklcyyIFjp9/9KoN1paNf22S/XHe4ROr+x7kmyOgpXdPOZHQPfpsW/uM/msZA7COoXszqspexUMADNr+RyHzbvxV/ukl+4z/yJneKLHvlacKWDXbPEHXPJcJrE+lF0+d8lx7v8oGHO4cRf+D0lNP/ALGXzl1UcsPbEcDh03LJPhVr+iS8mlABgJYGLcoTISr8uXzMXuMkHbtzfwyXrb3/NAQlwALS1/owSKLT2WC9y+gK1RXDb4FLX5oOkYO27aA4la09zFwkhu6JcFGPIuG+1AHCZKKXjORb6BSPDj8HQFczgRXLn5ajUgy92UmZfoMEAEHEqUKhM1x8xOi4dnHP5IDEAnTIyynHRr/8wL5oMl6zfrk2NDG9S8z7BYM2KQv9D5cVy0sercVI+CPqIsYz5XGPCnotlj/bMOfMtX02O2+EW2+MudzSAMzzJHS/GLiRFAAA="
        style={{ height: '46px', }}
      />

    );

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
                    {hedTagLogo}
                  </a>
                  <span style={{ marginLeft: '15px', }}>
                  Dataset Tag Manager
                </span>
                </div>
                <div style={{ fontSize: '12px', }}>
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
