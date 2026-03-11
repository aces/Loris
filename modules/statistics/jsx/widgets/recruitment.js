import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import i18n from 'I18nSetup';
import Loader from 'Loader';
import Panel from 'Panel';
import {QueryChartForm} from './helpers/queryChartForm';
import {progressBarBuilder} from './helpers/progressbarBuilder';
import {useTranslation} from 'react-i18next';
import {setupCharts} from './helpers/chartBuilder';
import jaStrings from '../../locale/ja/LC_MESSAGES/statistics.json';
import frStrings from '../../locale/fr/LC_MESSAGES/statistics.json';

/**
 * Recruitment - a widget containing statistics for recruitment data.
 *
 * @param  {object} props
 * @return {JSX.Element}
 */
const Recruitment = (props) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [showFiltersBreakdown, setShowFiltersBreakdown] = useState(false);

  let json = props.data;

  const [chartDetails, setChartDetails] = useState(
    {
      'generalBreakdown': {
        'agerecruitment_pie': {
          title: t('Total recruitment by Age', {ns: 'statistics'}),
          filters: '',
          chartType: 'pie',
          dataType: 'pie',
          label: 'Age (Years)',
          options: {pie: 'pie', bar: 'bar'},
          yLabel: t('Candidates registered', {ns: 'statistics'}),
          legend: 'under',
          chartObject: null,
        },
        'ethnicity_pie': {
          title: t('Ethnicity at Screening', {ns: 'statistics'}),
          filters: '',
          chartType: 'pie',
          dataType: 'pie',
          label: 'Ethnicity',
          options: {pie: 'pie', bar: 'bar'},
          yLabel: t('Candidates registered', {ns: 'statistics'}),
          legend: 'under',
          chartObject: null,
        },
      },
      'siteBreakdown': {
        'siterecruitment_pie': {
          title: t('Total Recruitment per Site', {ns: 'statistics'}),
          filters: '',
          chartType: 'pie',
          dataType: 'pie',
          label: 'Participants',
          legend: '',
          options: {pie: 'pie', bar: 'bar'},
          yLabel: t('Candidates registered', {ns: 'statistics'}),
          chartObject: null,
        },
        'siterecruitment_bysex': {
          title: t('Biological sex breakdown by site', {ns: 'statistics'}),
          filters: '',
          chartType: 'bar',
          dataType: 'bar',
          legend: 'under',
          options: {bar: 'bar', pie: 'pie'},
          yLabel: t('Candidates registered', {ns: 'statistics'}),
          chartObject: null,
        },
      },
      'projectBreakdown': {
        'agedistribution_line': {
          title: t('Candidate Age at Registration', {ns: 'statistics'}),
          filters: '',
          chartType: 'line',
          dataType: 'line',
          legend: '',
          options: {line: 'line'},
          yLabel: t('Candidates registered', {ns: 'statistics'}),
          chartObject: null,
        },
      },
    }
  );

  useEffect( () => {
    i18n.addResourceBundle('ja', 'statistics', jaStrings);
    i18n.addResourceBundle('fr', 'statistics', frStrings);

    // Re-set default state that depended on the translation
    let newdetails = {...chartDetails};
    newdetails['generalBreakdown']['agerecruitment_pie']['title']
      = t('Total recruitment by Age', {ns: 'statistics'});
    newdetails['generalBreakdown']['agerecruitment_pie']['label']
      = t('Age (Years)', {ns: 'statistics'});

    newdetails['generalBreakdown']['ethnicity_pie']['title']
      = t('Ethnicity at Screening', {ns: 'statistics'});
    newdetails['generalBreakdown']['ethnicity_pie']['label']
      = t('Ethnicity', {ns: 'loris'});

    newdetails['siteBreakdown']['siterecruitment_pie']['title']
      = t('Total Recruitment per Site', {ns: 'statistics'});
    newdetails['siteBreakdown']['siterecruitment_pie']['label']
      = t('Participants', {ns: 'statistics'});

    newdetails['siteBreakdown']['siterecruitment_bysex']['title']
      = t('Biological sex breakdown by site', {ns: 'statistics'});

    newdetails['projectBreakdown']['agedistribution_line']['title']
      = t('Candidate Age at Registration', {ns: 'statistics'});
    setChartDetails(newdetails);
  }, []);

  const showChart = (section, chartID) => {
    return props.showChart(section, chartID, chartDetails, setChartDetails);
  };

  const showFilters = (section) => {
    return <>
      <div className="btn-group" style={{marginBottom: '10px'}}>
        <button
          type="button"
          className="btn btn-default btn-xs"
          onClick={() => setShowFiltersBreakdown((prev) => !prev)}
        >
          {showFiltersBreakdown ?
            t('Hide Filters', {ns: 'loris'})
            : t('Show Filters', {ns: 'loris'})}
        </button>
      </div>
      {showFiltersBreakdown && (
        <div style={{marginTop: '15px'}}>
          <QueryChartForm
            Module={'statistics'}
            name={'recruitment'}
            id={'recruitmentForm' + section}
            data={json}
            callback={async (formDataObj) => {
              await updateFilters(formDataObj, section);
            }}
          />
        </div>
      )}
    </>;
  };

  const updateFilters = (formDataObj, section) => {
    props.updateFilters(formDataObj,
      section,
      chartDetails,
      setChartDetails);
  };

  // Helper functions to calculate totals for each view
  const getTotalProjectsCount = () => {
    return Object.keys(json['recruitment'] || {})
      .filter((key) => key !== 'overall').length;
  };

  const getTotalCohortsCount = () => {
    return Object.keys(json['recruitmentcohorts'] || {}).length;
  };

  useEffect(
    () => {
      if (json && Object.keys(json).length !== 0) {
        setupCharts(t, false, chartDetails, t('Total', {ns: 'loris'})).then(
          (data) => {
            setChartDetails(data);
          }
        );
        json = props.data;
        setLoading(false);
      }
    },
    [props.data]
  );

  const title = (subtitle) => t('Recruitment', {ns: 'statistics'})
    + ' — ' + t(subtitle, {ns: 'statistics'});
  return loading ? <Panel title ='Recruitment'><Loader/></Panel> : (
    <>
      <Panel
        title={t('Recruitment', {ns: 'statistics'})}
        id ='statistics_recruitment'
        onChangeView ={(index) => {
          setupCharts(t, false, chartDetails, t('Total', {ns: 'loris'}));
          setShowFiltersBreakdown(false);
        }}
        views ={[
          {
            content:
            <>
              <div className ='recruitment-panel' id='overall-recruitment'>
                {progressBarBuilder(t, json['recruitment']['overall'])}
              </div>
              <hr />
              {showFilters('generalBreakdown')}
              <div className={'charts-grid'}>
                {Object
                  .keys(chartDetails['generalBreakdown'])
                  .map((chartID) => (
                    <React.Fragment key={chartID}>
                      {showChart('generalBreakdown', chartID)}
                    </React.Fragment>
                  ))}
              </div>
            </>,
            title: title('Overall'),
            subtitle: t(
              'Total Participants: {{count}}',
              {
                ns: 'statistics',
                count: json['recruitment']['overall']['total_recruitment'],
              }
            ),
          },
          {
            content:
              json['recruitment']['overall'] &&
              json['recruitment']['overall']['total_recruitment'] > 0 ? (
                  <>
                    {showFilters('siteBreakdown')}
                    <div className={'charts-grid'}
                      id={'charts-one-column'}
                    >
                      {Object
                        .keys(chartDetails['siteBreakdown'])
                        .map((chartID) => (
                          <React.Fragment key={chartID}>
                            {showChart('siteBreakdown', chartID)}
                          </React.Fragment>
                        ))}
                    </div>
                  </>
                ) : (
                  <p>There have been no candidates registered yet.</p>
                ),
            title: title('Site Breakdown'),
            subtitle: t(
              'Total Participants: {{count}}',
              {
                ns: 'statistics',
                count: json['recruitment']['overall']['total_recruitment'],
              }
            ),
          },
          {
            content: <>
              <div
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                {Object.entries(json['recruitment']).map(
                  ([key, value]) => {
                    if (key !== 'overall') {
                      return <div key ={`projectBreakdown_${key}`}>
                        {progressBarBuilder(t, value)}
                      </div>;
                    }
                  }
                )}
              </div>
              <hr />
              {showFilters('projectBreakdown')}
              {showChart('projectBreakdown', 'agedistribution_line')}
            </>,
            title: title('Project Breakdown'),
            subtitle: t(
              'Projects: {{count}}',
              {ns: 'statistics', count: getTotalProjectsCount()}
            ),
          },
          {
            content:
              <div
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                {Object.entries(json['recruitmentcohorts'])
                  .map(
                    ([key, value]) => {
                      return <div key ={`cohortBreakdown_${key}`}>
                        {progressBarBuilder(t, value)}
                      </div>;
                    }
                  )}
              </div>,
            title: title('Cohort Breakdown'),
            subtitle: t(
              'Cohorts: {{count}}',
              {'ns': 'statistics', 'count': getTotalCohortsCount()}
            ),
          },
        ]}
      />
    </>
  );
};

Recruitment.propTypes = {
  data: PropTypes.object,
  baseURL: PropTypes.string,
  updateFilters: PropTypes.func,
  showChart: PropTypes.func,
};
Recruitment.defaultProps = {
  data: {},
};

export default Recruitment;
