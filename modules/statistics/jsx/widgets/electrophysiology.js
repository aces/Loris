import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from 'Panel';
import {QueryChartForm} from './helpers/queryChartForm';
import {setupCharts} from './helpers/chartBuilder';

/**
 * Electrophysiology - a widget containing statistics for EEG data.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
const Electrophysiology = (props) => {
  const [loading, setLoading] = useState(true);
  const [showFiltersBreakdown, setShowFiltersBreakdown] = useState(false);

  let json = props.data;

  const [chartDetails, setChartDetails] = useState({
    'site_recordings': {
      'eeg_recordings_by_site': {
        sizing: 11,
        title: 'EEG Recordings by site',
        filters: '',
        chartType: 'pie',
        dataType: 'pie',
        label: 'EEG Recordings',
        units: null,
        showPieLabelRatio: true,
        legend: '',
        options: {pie: 'pie', bar: 'bar'},
        chartObject: null,
        yLabel: 'EEG Recordings',
        titlePrefix: 'Site',
      },
    },
    'project_recordings': {
      'eeg_recordings_by_project': {
        sizing: 11,
        title: 'EEG Recordings by project',
        filters: '',
        chartType: 'pie',
        dataType: 'pie',
        label: 'EEG Recordings',
        units: null,
        showPieLabelRatio: true,
        legend: '',
        options: {pie: 'pie', bar: 'bar'},
        chartObject: null,
        yLabel: 'EEG Recordings',
        titlePrefix: 'Project',
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
      setupCharts(false, chartDetails).then((data) => {
        setChartDetails(data);
      });
      json = props.data;
      console.log('eeg_json', json);
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

  return loading ? <Panel title='EEG data'><Loader/></Panel> : (
    <>
      <Panel
        title='EEG data'
        id='eeg_recordings'
        onChangeView={(index) => {
          setupCharts(false, chartDetails);

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
                      {showFiltersBreakdown ? 'Hide Filters' : 'Show Filters'}
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
                <p>There is no data yet.</p>
              ),
            title: 'EEG data - recordings by project',
            subtitle: 'Total recordings: ' + getTotalRecordings(),
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
                  {showFiltersBreakdown ? 'Hide Filters' : 'Show Filters'}
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
                <p>There is no data yet.</p>
              ),
            title: 'EEG data - recordings by site',
            subtitle: 'Total recordings: ' + getTotalRecordings(),
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
