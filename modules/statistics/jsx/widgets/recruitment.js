import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from 'Panel';
import {QueryChartForm} from './helpers/queryChartForm';
import {progressBarBuilder} from './helpers/progressbarBuilder';

import {setupCharts} from './helpers/chartBuilder';

/**
 * Recruitment - a widget containing statistics for recruitment data.
 * @param {object} props
 *
 * @return {JSX.Element}
 */
const Recruitment = (props) => {
  const [loading, setLoading] = useState(true);
  let json = props.data;

  const [chartDetails, setChartDetails] = useState({
    'siteBreakdown': {
      'siterecruitment_pie': {
        sizing: 11,
        title: 'Total Recruitment per Site',
        filters: '',
        chartType: 'pie',
        dataType: 'pie',
        label: 'Participants',
        legend: '',
        options: {pie: 'pie', bar: 'bar'},
      },
      'siterecruitment_bysex': {
        sizing: 11,
        title: 'Biological sex breakdown by site',
        filters: '',
        chartType: 'bar',
        dataType: 'bar',
        legend: 'under',
        options: {bar: 'bar'},
      },
    },
  });

  const showChart = (section, chartID) => {
    return props.showChart(section, chartID, chartDetails, setChartDetails);
  };

  const updateFilters = (formDataObj, section) => {
    props.updateFilters(formDataObj, section, chartDetails, setChartDetails);
  };

  useEffect(() => {
    if (json && Object.keys(json).length !== 0) {
      setupCharts(false, chartDetails).then((data) => {
        setChartDetails(data);
      });
      json = props.data;
      setLoading(false);
    }
  }, [props.data]);

  return loading ? <Panel title='Recruitment'><Loader/></Panel> : (
    <>
      <Panel
        title='Recruitment'
        id='statistics_recruitment'
        onChangeView={() => {
          setupCharts(false, chartDetails);
        }}
        views={[
          {
            content:
            <div className='recruitment-panel' id='overall-recruitment'>
              {progressBarBuilder(json['recruitment']['overall'])}
            </div>,
            title: 'Recruitment - overall',
          },
          {
            content:
              json['recruitment']['overall']
              && json['recruitment']['overall']['total_recruitment'] > 0 ?
              <>
                <QueryChartForm
                  Module={'statistics'}
                  name={'recruitment'}
                  id={'recruitmentSiteBreakdownForm'}
                  data={json}
                  callback={(formDataObj) => {
                    updateFilters(formDataObj, 'siteBreakdown');
                  }}
                />
                {Object.keys(chartDetails['siteBreakdown']).map((chartID) => {
                  return showChart('siteBreakdown', chartID);
                })}
              </> :
              <p>There have been no candidates registered yet.</p>,
            title: 'Recruitment - site breakdown',
          },
          {
            content:
            <>
              {Object.entries(json['recruitment']).map(([key, value]) => {
                if (key !== 'overall') {
                  return <div key={`projectBreakdown_${key}`}>
                    {progressBarBuilder(value)}
                  </div>;
                }
              })}
            </>,
            title: 'Recruitment - project breakdown',
          },
          {
            content:
              <>
                {Object.entries(json['recruitmentcohorts']).map(([key, value]) => {
                  return <div key={`cohortBreakdown_${key}`}>
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
};
Recruitment.defaultProps = {
  data: {},
};

export default Recruitment;
