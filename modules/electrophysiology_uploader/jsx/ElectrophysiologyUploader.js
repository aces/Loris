import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import {TabPane, Tabs} from 'jsx/Tabs';
import UploadForm from './UploadForm';
import UploadViewer from './UploadViewer';
import {createRoot} from 'react-dom/client';

/**
 * UploadViewer
 *
 * @param {array} props
 * @return {JSX}
 */
export default function ElectrophysiologyUploader(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState({});

  /**
   * Called by React when the component has been rendered on the page.
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Retrive data from the provided URL and save it in state
   * Additionaly add hiddenHeaders to global loris vairable
   * for easy access by columnFormatter.
   */
  const fetchData = () => {
    fetch(`${props.DataURL}/?format=json`, {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        console.error(response.status + ': ' + response.statusText);
        return;
      }

      response.json().then((data) => {
        setData(data);
        setIsLoaded(true);
      });
    }).catch((error) => {
      console.error(error);
    });
  };

  if (!isLoaded) {
    return <Loader />;
  }

  const tabList = [
    {id: 'browse', label: 'Browse'},
    {id: 'upload', label: 'Upload'},
  ];

  return (
    <Tabs tabs={tabList} defaultTab='browse' updateURL={true}>
      <TabPane TabId={tabList[0].id}>
        <UploadViewer
          data={data.Data}
          fieldOptions={data.fieldOptions}
        />
      </TabPane>
      <TabPane TabId={tabList[1].id}>
        <UploadForm
          uploadURL={`${props.DataURL}/upload`}
        />
      </TabPane>
    </Tabs>
  );
}

ElectrophysiologyUploader.propTypes = {
  DataURL: PropTypes.string.isRequired,
};

/**
 * Render imaging_uploader on page load
 */
document.addEventListener('DOMContentLoaded', function() {
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <ElectrophysiologyUploader
      Module='imaging_uploader'
      DataURL={loris.BaseURL + '/electrophysiology_uploader'}
    />
  );
});
