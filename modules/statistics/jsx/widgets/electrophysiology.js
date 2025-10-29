import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from 'Panel';
import {QueryChartForm} from './helpers/queryChartForm';
import {setupCharts} from './helpers/chartBuilder';
import {useTranslation} from 'react-i18next';

/**
 * Electrophysiology - a widget containing statistics for EEG data.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
const Electrophysiology = (props) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [showFiltersBreakdown, setShowFiltersBreakdown] = useState(false);

  let json = props.data;

  const [chartDetails, setChartDetails] = useState({
    'project_recordings': {
      'eeg_recordings_by_project': {
        sizing: 11,
        title: t('EEG Recordings by project', {ns: 'statistics'}),
        filters: '',
        chartType: 'pie',
        dataType: 'pie',
        label: t('EEG Recordings', {ns: 'statistics'}),
        units: null,
        showPieLabelRatio: true,
        legend: '',
        options: {pie: 'pie', bar: 'bar'},
        chartObject: null,
        yLabel: t('EEG Recordings', {ns: 'statistics'}),
        titlePrefix: t('Project', {ns: 'loris'}),
      },
    },
    'site_recordings': {
      'eeg_recordings_by_site': {
        sizing: 11,
        title: t('EEG Recordings by site', {ns: 'statistics'}),
        filters: '',
        chartType: 'pie',
        dataType: 'pie',
        label: t('EEG Recordings', {ns: 'statistics'}),
        units: null,
        showPieLabelRatio: true,
        legend: '',
        options: {pie: 'pie', bar: 'bar'},
        chartObject: null,
        yLabel: t('EEG Recordings', {ns: 'statistics'}),
        titlePrefix: t('Site', {ns: 'loris'}),
      },
    },
    'project_events': {
      'eeg_events_by_project': {
        sizing: 11,
        title: t('EEG Events by project', {ns: 'statistics'}),
        filters: '',
        chartType: 'pie',
        dataType: 'pie',
        label: t('EEG Events', {ns: 'statistics'}),
        units: null,
        showPieLabelRatio: true,
        legend: '',
        options: {pie: 'pie', bar: 'bar'},
        chartObject: null,
        yLabel: t('EEG Events', {ns: 'statistics'}),
        titlePrefix: t('Project', {ns: 'loris'}),
      },
    },
  });

  const showChart = ((section, chartID) => {
    return props.showChart(section, chartID,
      chartDetails, setChartDetails);
  });

  /**
   * useEffect - modified to run when props.data updates.
   */
  useEffect(() => {
    if (json && Object.keys(json).length !== 0) {
      setupCharts(
        t,
        false,
        chartDetails,
        t('Total', {ns: 'loris'})
      ).then((data) => {
        setChartDetails(data);
      });
      json = props.data;
      setLoading(false);
    }
  }, [props.data]);

  const updateFilters = (formDataObj, section) => {
    props.updateFilters(formDataObj, section,
      chartDetails, setChartDetails);
  };

  // Helper function to calculate total recruitment
  const getTotalRecordings = () => {
    return json['eeg_data']['total_recordings'] || -1;
  };
  const getTotalEvents = () => {
    return json['eeg_data']['total_events'] || -1;
  };
  const title = (subtitle) => t('EEG data', {ns: 'statistics'})
    + ' — ' + t(subtitle, {ns: 'statistics'});
  const filterLabel = (hide) => hide ?
    t('Hide Filters', {ns: 'loris'})
    : t('Show Filters', {ns: 'loris'});
  return loading ? <Panel title='EEG data'><Loader/></Panel> : (
    <>
      <Panel
        title={t('EEG data', {ns: 'statistics'})}
        id='eeg_recordings'
        onChangeView={(index) => {
          setupCharts(t, false, chartDetails, t('Total', {ns: 'loris'}));

          // reset filters when switching views
          setShowFiltersBreakdown(false);
        }}
        views={[
          {
            content:
              getTotalRecordings() > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div className="btn-group" style={{marginBottom: '10px'}}>
                    <button
                      type="button"
                      className="btn btn-default btn-xs"
                      onClick={() => setShowFiltersBreakdown((prev) => !prev)}
                    >
                      {filterLabel(showFiltersBreakdown)}
                    </button>
                  </div>
                  {showFiltersBreakdown && (
                    <QueryChartForm
                      Module={'statistics'}
                      name={'eeg_data'}
                      id={'eeg_dataProjectRecordingsForm'}
                      data={props.data}
                      callback={(formDataObj) => {
                        updateFilters(formDataObj, 'project_recordings');
                      }}
                    />
                  )}
                  {showChart('project_recordings', 'eeg_recordings_by_project')}
                </div>
              ) : (
                <p>{t('There is no data yet.', {ns: 'statistics'})}</p>
              ),

            title: title('Recordings by Project'),
            subtitle: t(
              'Total Recordings: {{count}}',
              {
                ns: 'statistics',
                count: getTotalRecordings(),
              }
            ),
            onToggleFilters: () => setShowFiltersBreakdown((prev) => !prev),
          },
          {
            content:
              getTotalRecordings() > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div className="btn-group" style={{marginBottom: '10px'}}>
                    <button
                      type="button"
                      className="btn btn-default btn-xs"
                      onClick={() => setShowFiltersBreakdown((prev) => !prev)}
                    >
                      {filterLabel(showFiltersBreakdown)}
                    </button>
                  </div>
                  {showFiltersBreakdown && (
                    <QueryChartForm
                      Module={'statistics'}
                      name={'eeg_data'}
                      id={'eeg_dataSiteRecordingsForm'}
                      data={props.data}
                      callback={(formDataObj) => {
                        updateFilters(formDataObj, 'site_recordings');
                      }}
                    />
                  )}
                  {showChart('site_recordings', 'eeg_recordings_by_site')}
                </div>
              ) : (
                <p>{t('There is no data yet.', {ns: 'statistics'})}</p>
              ),
            title: title('Recordings by Site'),
            subtitle: t(
              'Total Recordings: {{count}}',
              {
                ns: 'statistics',
                count: getTotalRecordings(),
              }
            ),
            onToggleFilters: () => setShowFiltersBreakdown((prev) => !prev),
          },
          {
            content:
              getTotalEvents() > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div className="btn-group" style={{marginBottom: '10px'}}>
                    <button
                      type="button"
                      className="btn btn-default btn-xs"
                      onClick={() => setShowFiltersBreakdown((prev) => !prev)}
                    >
                      {filterLabel(showFiltersBreakdown)}
                    </button>
                  </div>
                  {showFiltersBreakdown && (
                    <QueryChartForm
                      Module={'statistics'}
                      name={'eeg_data'}
                      id={'eeg_dataEventsForm'}
                      data={props.data}
                      callback={(formDataObj) => {
                        updateFilters(formDataObj, 'project_events');
                      }}
                    />
                  )}
                  {showChart('project_events', 'eeg_events_by_project')}
                </div>
              ) : (
                <p>{t('There is no data yet.', {ns: 'statistics'})}</p>
              ),
            title: title('Events by Project'),
            subtitle: t(
              'Total Events: {{count}}',
              {
                ns: 'statistics',
                count: getTotalEvents(),
              }
            ),
            onToggleFilters: () => setShowFiltersBreakdown((prev) => !prev),
          },
        ]}
      />
    </>
  );
};
Electrophysiology.propTypes = {
  data: PropTypes.object,
  baseURL: PropTypes.string,
  updateFilters: PropTypes.func,
  showChart: PropTypes.func,
};
Electrophysiology.defaultProps = {
  data: {},
};

export default Electrophysiology;
