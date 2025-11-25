import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import {TabPane, Tabs} from 'jsx/Tabs';
import UploadForm from './UploadForm';
import UploadViewer from './UploadViewer';
import {createRoot} from 'react-dom/client';
import i18n from 'I18nSetup';
import {useTranslation} from 'react-i18next';

import hiStrings from
  '../locale/hi/LC_MESSAGES/electrophysiology_uploader.json';

/**
 * UploadViewer
 *
 * @param {array} props
 * @return {JSX}
 */
function ElectrophysiologyUploader(props) {
  const {DataURL} = props;
  const {t} = useTranslation(['electrophysiology_uploader', 'loris']);
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
    fetch(`${DataURL}/?format=json`, {
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

  const refreshForm = () => {
    setData({});
    fetchData();
  };

  if (!isLoaded) {
    return <Loader />;
  }

  const tabList = [
    {id: 'browse', label: t('Browse', {ns: 'loris'})},
    {id: 'upload', label: t('Upload', {ns: 'loris'})},
  ];

  return (
    <>
      <div className="alert alert-warning" role="alert">
        <strong>{t('LORIS 26 Beta Note:',
          {ns: 'electrophysiology_uploader'})}</strong>
        {t('Files uploaded in this module will not be viewable'+
          ' in the Electrophysiology Browser module. ' +
           'This feature is under construction for the next release. ' +
           'Please get in touch with the LORIS team ' +
           'to configure this for your project.',
        {ns: 'electrophysiology_uploader'})}
      </div>
      <Tabs tabs={tabList} defaultTab='browse' updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <UploadViewer
            data={data.Data}
            fieldOptions={data.fieldOptions}
            t={t}
          />
        </TabPane>
        <TabPane TabId={tabList[1].id}>
          <UploadForm
            uploadURL={`${DataURL}/upload`}
            refreshPage={refreshForm}
            t={t}
          />
        </TabPane>
      </Tabs>
    </>
  );
}

ElectrophysiologyUploader.propTypes = {
  DataURL: PropTypes.string.isRequired,
  t: PropTypes.func,
};

/**
 * Render imaging_uploader on page load
 */
export default ElectrophysiologyUploader;

document.addEventListener('DOMContentLoaded', function() {
  i18n.addResourceBundle('hi', 'electrophysiology_uploader', hiStrings);

  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <ElectrophysiologyUploader
      Module='imaging_uploader'
      DataURL={loris.BaseURL + '/electrophysiology_uploader'}
    />
  );
});