import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import i18n from 'I18nSetup';
import Loader from 'Loader';
import Panel from 'Panel';
import {QueryChartForm} from './helpers/queryChartForm';
import {setupCharts} from './helpers/chartBuilder';
import {useTranslation} from 'react-i18next';
import jaStrings from '../../locale/ja/LC_MESSAGES/statistics.json';
import frStrings from '../../locale/fr/LC_MESSAGES/statistics.json';

/**
 * StudyProgression - a widget containing statistics for study data.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
const StudyProgression = (props) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [showFiltersScans, setShowFiltersScans] = useState(false);
  const [showFiltersBreakdown, setShowFiltersBreakdown] = useState(false);
  useEffect( () => {
    i18n.addResourceBundle('ja', 'statistics', jaStrings);
    i18n.addResourceBundle('fr', 'statistics', frStrings);

    // Re-set default state that depended on the translation
    let newdetails = {...chartDetails};
    newdetails['total_scans']['scans_bymonth']['title']
      = t('Scan sessions per site', {ns: 'statistics'});
    newdetails['total_recruitment']['siterecruitment_bymonth']['title']
      = t('Recruitment per site', {ns: 'statistics'});
    setChartDetails(newdetails);
  }, []);

  let json = props.data;

  const [chartDetails, setChartDetails] = useState({
    'total_scans': {
      'scans_bymonth': {
        sizing: 11,
        title: t('Scan sessions per site', {ns: 'statistics'}),
        filters: '',
        chartType: 'line',
        dataType: 'line',
        label: t('Scans', {ns: 'loris'}),
        legend: 'under',
        options: {line: 'line'},
        chartObject: null,
        titlePrefix: 'Month',
      },
    },
    'total_recruitment': {
      'siterecruitment_bymonth': {
        sizing: 11,
        title: t('Recruitment per site', {ns: 'statistics'}),
        filters: '',
        chartType: 'line',
        dataType: 'line',
        legend: '',
        options: {line: 'line'},
        chartObject: null,
        titlePrefix: 'Month',
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
  }, [props.data, t]);

  const updateFilters = (formDataObj, section) => {
    props.updateFilters(formDataObj, section,
      chartDetails, setChartDetails);
  };

  const title = (subtitle) => t('Study Progression', {ns: 'statistics'})
    + ' — ' + t(subtitle, {ns: 'statistics'});
  const filterLabel = (hide) => hide ?
    t('Hide Filters', {ns: 'loris'})
    : t('Show Filters', {ns: 'loris'});
  return loading ? <Panel title='Study Progression'><Loader/></Panel> : (
    <>
      <Panel
        title={t('Study Progression', {ns: 'statistics'})}
        id='statistics_studyprogression'
        onChangeView={(index) => {
          setupCharts(t, false, chartDetails, t('Total', {ns: 'loris'}));
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
                                <div>{data['title']}</div>
                              </a>
                            );
                          })}
                        </div>
                      </div>;
                    }
                  }
                )}
              </div>,
            title: title('Summary'),
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
                    {filterLabel(showFiltersScans)}
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
            title: title('Site Scans'),
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
                      onClick={() => setShowFiltersBreakdown((prev) => !prev)}
                    >
                      {filterLabel(showFiltersBreakdown)}
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
            title: title('Site Recruitment'),
            onToggleFilters: () => showFiltersBreakdown((prev) => !prev),
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
