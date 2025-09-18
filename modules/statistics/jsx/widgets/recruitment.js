import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from 'Panel';
import {QueryChartForm} from './helpers/queryChartForm';
import {progressBarBuilder} from './helpers/progressbarBuilder';

import {setupCharts} from './helpers/chartBuilder';

/**
 * Recruitment - a widget containing statistics for recruitment data.
 *
 * @param  {object} props
 * @return {JSX.Element}
 */
const Recruitment = (props) => {
  const [loading, setLoading] = useState(true);
  const [showFiltersBreakdown, setShowFiltersBreakdown] = useState(false);

  let json = props.data;

  const [chartDetails, setChartDetails] = useState(
    {
      'generalBreakdown': {
        'agerecruitment_pie': {
          title: 'Total recruitment by Age',
          filters: '',
          chartType: 'pie',
          dataType: 'pie',
          label: 'Age (Years)',
          options: {pie: 'pie', bar: 'bar'},
          legend: 'under',
          chartObject: null,
        },
        'ethnicity_pie': {
          title: 'Ethnicity at Screening',
          filters: '',
          chartType: 'pie',
          dataType: 'pie',
          label: 'Ethnicity',
          options: {pie: 'pie', bar: 'bar'},
          legend: 'under',
          chartObject: null,
        },
      },
      'siteBreakdown': {
        'siterecruitment_pie': {
          title: 'Total Recruitment per Site',
          filters: '',
          chartType: 'pie',
          dataType: 'pie',
          label: 'Participants',
          legend: '',
          options: {pie: 'pie', bar: 'bar'},
          chartObject: null,
        },
        'siterecruitment_bysex': {
          title: 'Biological sex breakdown by site',
          filters: '',
          chartType: 'bar',
          dataType: 'bar',
          legend: 'under',
          options: {bar: 'bar', pie: 'pie'},
          chartObject: null,
        },
      },
      'projectBreakdown': {
        'agedistribution_line': {
          sizing: 11,
          title: 'Candidate Age at Registration',
          filters: '',
          chartType: 'line',
          dataType: 'line',
          legend: '',
          options: {line: 'line'},
          chartObject: null,
        },
      },
    }
  );

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
          {showFiltersBreakdown ? 'Hide Filters' : 'Show Filters'}
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
        setupCharts(false, chartDetails).then(
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

  return loading ? <Panel title ='Recruitment'><Loader/></Panel> : (
    <>
      <Panel
        title ='Recruitment'
        id ='statistics_recruitment'
        onChangeView ={(index) => {
          setupCharts(false, chartDetails);
          setShowFiltersBreakdown(false);
        }}
        views ={[
          {
            content:
            <>
              <div className ='recruitment-panel' id='overall-recruitment'>
                {progressBarBuilder(json['recruitment']['overall'])}
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
            title: 'Recruitment - overall',
            subtitle: `Total participants: `
              + json['recruitment']['overall']['total_recruitment'] || -1,
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
            title: 'Recruitment - site breakdown',
            subtitle: 'Total participants: '
              + json['recruitment']['overall']['total_recruitment'] || -1,
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
                    if (key !== 'overall' && value['total_recruitment'] > 0) {
                      return <div key ={`projectBreakdown_${key}`}>
                        {progressBarBuilder(value)}
                      </div>;
                    }
                  }
                )}
              </div>
              <hr />
              {showFilters('projectBreakdown')}
              {showChart('projectBreakdown', 'agedistribution_line')}
            </>,
            title: 'Recruitment - project breakdown',
            subtitle: `Projects: ${getTotalProjectsCount()}`,
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
                        {progressBarBuilder(value)}
                      </div>;
                    }
                  )}
              </div>,
            title: 'Recruitment - cohort breakdown',
            subtitle: `Cohorts: ${getTotalCohortsCount()}`,
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
