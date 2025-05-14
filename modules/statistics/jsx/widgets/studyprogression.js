import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from 'Panel';
import {QueryChartForm} from './helpers/queryChartForm';
import {setupCharts} from './helpers/chartBuilder';

/**
 * StudyProgression - a widget containing statistics for study data.
 * @param {object} props
 * @return {JSX.Element}
 */
const StudyProgression = (props) => {
  const [loading, setLoading] = useState(true);
  const [showFiltersScans, setShowFiltersScans] = useState(false);
  const [showFiltersRecruitment, setShowFiltersRecruitment] = useState(false);
  const [activeView, setActiveView] = useState(0);

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
      },
    },
    'total_recruitment': {
      'siterecruitment_line': {
        sizing: 11,
        title: 'Recruitment per site',
        filters: '',
        chartType: 'line',
        dataType: 'line',
        legend: '',
        options: {line: 'line'},
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
      setLoading(false);
    }
  }, [props.data]);

  const updateFilters = (formDataObj, section) => {
    props.updateFilters(formDataObj, section,
      chartDetails, setChartDetails);
  };

  return loading ? <Panel title='Study Progression'><Loader/></Panel> : (
    <>
      <Panel
        title='Study Progression'
        id='statistics_studyprogression'
        activeView={activeView}
        onChangeView={(index) => {
          setActiveView(index);
          setupCharts(false, chartDetails);

          // reset filters when switching views
          if (index === 0) {
            setShowFiltersScans(false);
          } else if (index === 1) {
            setShowFiltersRecruitment(false);
          }
        }}
        views={[
          {
            content:
              // ############ CBIGR OVERRIDE START ############
              <div
                style={{
                  maxHeight: '400px',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                }}
              >
                {Object.entries(json['studyprogression']
                  ['progressionData']).map(
                  ([projectName, projectData]) => {
                    if (projectData.length > 0) {
                      return <div key={`progress_${projectName}`}>
                        <h3 style={{marginTop: 0}}>{projectName}</h3>
                        <div
                          className='study-progression-container'
                        >
                          {projectData.map((data) => {
                            return <a
                              className='study-progression-button'
                              href={data['url']}
                              style={{
                                backgroundColor: data['colour'],
                                color: 'black',
                                textDecoration: 'none',
                              }}
                              key={`progress_${projectName}_${data['title']}`}
                            >
                              <h4>
                                {data['count']}
                              </h4>
                              <div>
                                {data['title'].replace('_', ' ')}
                                {data['count'] != 1 && 's'}
                              </div>
                            </a>;
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
                    onClick={() => setShowFiltersScans((prev) => !prev)}
                  >
                    {showFiltersScans ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>
                {showFiltersScans && (
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
            onToggleFilters: () => setShowFiltersScans((prev) => !prev),
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
                      onClick={() => setShowFiltersRecruitment((prev) => !prev)}
                    >
                      {showFiltersRecruitment ? 'Hide Filters' : 'Show Filters'}
                    </button>
                  </div>
                  {showFiltersRecruitment && (
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
                  {showChart('total_recruitment', 'siterecruitment_line')}
                </div>
              ) : (
                <p>There have been no candidates registered yet.</p>
              ),
            title: 'Study Progression - site recruitment',
            onToggleFilters: () => setShowFiltersRecruitment((prev) => !prev),
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
