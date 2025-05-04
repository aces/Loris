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
  const [activeView, setActiveView] = useState(0);

  let json = props.data;

  const [chartDetails, setChartDetails] = useState(
    {
      'siteBreakdown': {
        'agerecruitment_pie': {
          title: 'Total recruitment by Age',
          filters: '',
          chartType: 'pie',
          dataType: 'pie',
          label: 'Age (Years)',
          options: {pie: 'pie', bar: 'bar'},
          legend: 'under',
        },
        'ethnicity_pie': {
          title: 'Ethnicity at Screening',
          filters: '',
          chartType: 'pie',
          dataType: 'pie',
          label: 'Ethnicity',
          options: {pie: 'pie', bar: 'bar'},
          legend: 'under',
        },
        'siterecruitment_pie': {
          title: 'Total Recruitment per Site',
          filters: '',
          chartType: 'pie',
          dataType: 'pie',
          label: 'Participants',
          legend: '',
          options: {pie: 'pie', bar: 'bar'},
        },
        'siterecruitment_bysex': {
          title: 'Biological sex breakdown by site',
          filters: '',
          chartType: 'bar',
          dataType: 'bar',
          legend: 'under',
          options: {bar: 'bar', pie: 'pie'},
        },
      },
    }
  );

  const showChart = (section, chartID) => {
    return props.showChart(section, chartID, chartDetails, setChartDetails);
  };

  const updateFilters = (formDataObj, section) => {
    props.updateFilters(formDataObj,
      section,
      chartDetails,
      setChartDetails);
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
        activeView ={activeView}
        onChangeView ={(index) => {
          setupCharts(false, chartDetails);
          setActiveView(index);
        }}
        views ={[
          {
            content:
            <div className ='recruitment-panel' id='overall-recruitment'>
              {progressBarBuilder(json['recruitment']['overall'])}
            </div>,
            title: 'Recruitment - overall',
          },
          {
            content:
              json['recruitment']['overall'] &&
              json['recruitment']['overall']['total_recruitment'] > 0 ? (
                  <>
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
                          id={'recruitmentSiteBreakdownForm'}
                          data={json}
                          callback={(formDataObj) => {
                            updateFilters(formDataObj, 'siteBreakdown');
                          }}
                        />
                      </div>
                    )}
                    <div className="site-breakdown-grid">
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
            onToggleFilters: () => {
              setActiveView(1);
              setShowFiltersBreakdown((prev) => !prev);
            },
          },
          {
            content:
              <>
                {Object.entries(json['recruitment']).map(
                  ([key, value]) => {
                    if (key !== 'overall') {
                      return <div key ={`projectBreakdown_${key}`}>
                        {progressBarBuilder(value)}
                      </div>;
                    }
                  }
                )}
              </>,
            title: 'Recruitment - project breakdown',
          },
          {
            content:
              <>
                {Object.entries(json['recruitmentcohorts'])
                  .map(
                    ([key, value]) => {
                      return <div key ={`cohortBreakdown_${key}`}>
                        {progressBarBuilder(value)}
                      </div>;
                    }
                  )}
              </>,
            title: 'Recruitment - cohort breakdown',
          },
        ]}
      />
    </>
  );
};

Recruitment.propTypes = {
  data: PropTypes.object,
  baseURL: PropTypes.string,
  updateFilters: PropTypes.function,
  showChart: PropTypes.function,
};
Recruitment.defaultProps = {
  data: {},
};

export default Recruitment;
