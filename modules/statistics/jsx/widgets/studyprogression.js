import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from 'Panel';
import {QueryChartForm} from './helpers/queryChartForm';
import {setupCharts} from './helpers/chartBuilder';

/**
 * StudyProgression - a widget containing statistics for study data.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
const StudyProgression = (props) => {
  const [loading, setLoading] = useState(true);
  const [showFiltersBreakdown, setShowFiltersBreakdown] = useState(false);

  let json = props.data;

  const [chartDetails, setChartDetails] = useState({
    'total_scans': {
      'scans_bymonth': {
        sizing: 11,
        title: 'Scan sessions per site',
        filters: '',
        chartType: 'line',
        dataType: 'line',
        label: 'Scans',
        legend: 'under',
        options: {line: 'line'},
        chartObject: null,
        yLabel: 'Candidates registered',
        titlePrefix: 'Month',
      },
    },
    'total_recruitment': {
      'siterecruitment_bymonth': {
        sizing: 11,
        title: 'Recruitment per site',
        filters: '',
        chartType: 'line',
        dataType: 'line',
        legend: '',
        options: {line: 'line'},
        chartObject: null,
        yLabel: 'Candidates registered',
        titlePrefix: 'Month',
      },
    },
    'project_sizes': {    // This should be a class
      'size_byproject': {
        sizing: 11,
        title: 'Dataset size breakdown by project',
        filters: '',
        chartType: 'pie',
        dataType: 'pie',
        label: 'Size (GB)',
        units: 'GB',
        showPieLabelRatio: false,
        legend: '',
        options: {pie: 'pie', bar: 'bar'},
        chartObject: null,
        yLabel: 'Size (GB)',
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
      console.log('thejson', json);
      setLoading(false);
    }
  }, [props.data]);

  const updateFilters = (formDataObj, section) => {
    props.updateFilters(formDataObj, section,
      chartDetails, setChartDetails);
  };

  // Helper function to calculate total recruitment
  const getTotalRecruitment = () => {
    return json['studyprogression']['recruitment']
      ['overall']['total_recruitment'] || -1;
  };

  return loading ? <Panel title='Study Progression'><Loader/></Panel> : (
    <>
      <Panel
        title='Study Progression'
        id='statistics_studyprogression'
        onChangeView={(index) => {
          setupCharts(false, chartDetails);

          // reset filters when switching views
          setShowFiltersBreakdown(false);
        }}
        views={[
          {
            content:
              <div className='study-progression-container'>
                {Object.entries(json['studyprogression']
                  ['progressionData']).map(
                  ([projectName, projectData]) => {
                    if (projectData.length > 0) {
                      return <div key={`progress_${projectName}`}>
                        <h3 style={{marginTop: 0}}>{projectName}</h3>
                        <div className='study-progression-project'>
                          {projectData.map((data) => {
                            const commonProps = {
                              className: 'study-progression-button',
                              style: {
                                backgroundColor: data['colour'],
                              },
                              key: `progress_${projectName}_${data['title']}`,
                            };

                            return (
                              <a {...commonProps} href={data['url']}>
                                <h4>{data['count']}</h4>
                                <div>
                                  {data['title']}
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>;
                    }
                  }
                )}
              </div>,
            title: 'Study Progression - summary',
          },
          {
            content: json['studyprogression']['total_scans'] > 0 ? (
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
                    name={'studyprogression'}
                    id={'studyprogressionSiteScansForm'}
                    data={props.data}
                    callback={(formDataObj) => {
                      updateFilters(formDataObj, 'total_scans');
                    }}
                  />
                )}
                {showChart('total_scans', 'scans_bymonth')}
              </div>
            ) : (
              <p>There have been no scans yet.</p>
            ),
            title: 'Study Progression - site scans',
            subtitle: 'Total scans: '
              + json['studyprogression']['total_scans'] || -1,
          },
          {
            content: json['studyprogression']['recruitment']['overall'][
              'total_recruitment'
            ] > 0 ? (
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
                      name={'studyprogression'}
                      id={'studyprogressionSiteRecruitmentForm'}
                      data={props.data}
                      callback={(formDataObj) => {
                        updateFilters(formDataObj, 'total_recruitment');
                      }}
                    />
                  )}
                  {showChart('total_recruitment', 'siterecruitment_bymonth')}
                </div>
              ) : (
                <p>There have been no candidates registered yet.</p>
              ),
            title: 'Study Progression - site recruitment',
            subtitle: `Total recruitment: ${getTotalRecruitment()}`,
          },
          {
            content:
              Object.keys(json['options']['projects']).length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div className="btn-group" style={{marginBottom: '10px
                  </div>
                  {showFiltersBreakdown && (
                    <QueryChartForm
                      Module={'statistics'}
                      name={'studyprogression'}
                      id={'studyprogressionProjectSizesForm'}
                      data={props.data}
                      callback={(formDataObj) => {
                        updateFilters(formDataObj, 'project_sizes');
                      }}
                    />
                  )}
                  {showChart('project_sizes', 'size_byproject')}
                </div>
              ) : (
                <p>There is no data yet.</p>
              ),
            title: 'Study Progression - project dataset sizes',
            subtitle: 'Total size: '
              + (json['studyprogression']['total_size'] ?? -1)
              + ' GB',
          },
        ]}
      />
    </>
  );
};
StudyProgression.propTypes = {
  data: PropTypes.object,
  baseURL: PropTypes.string,
  updateFilters: PropTypes.func,
  showChart: PropTypes.func,
};
StudyProgression.defaultProps = {
  data: {},
};

export default StudyProgression;
