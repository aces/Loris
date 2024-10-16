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
        onChangeView={() => {
          setupCharts(false, chartDetails);
        }}
        views={[
          {
            content: json['studyprogression']['total_scans'] > 0 ?
            <>
              <QueryChartForm
                Module={'statistics'}
                name={'studyprogression'}
                id={'studyprogressionSiteScansForm'}
                data={props.data}
                callback={(formDataObj) => {
                  updateFilters(formDataObj, 'total_scans');
                }}
              />
              {showChart('total_scans', 'scans_bymonth')}
            </> :
            <p>There have been no scans yet.</p>,
            title: 'Study Progression - site scans',
          },
          {
            content:
            json['studyprogression']['recruitment']
            ['overall']['total_recruitment']
            > 0 ?
            <>
              <QueryChartForm
                Module={'statistics'}
                name={'studyprogression'}
                id={'studyprogressionSiteRecruitmentForm'}
                data={props.data}
                callback={(formDataObj) => {
                  updateFilters(formDataObj, 'total_recruitment');
                }}
              />
              {showChart('total_recruitment', 'siterecruitment_line')}
            </> :
            <p>There have been no candidates registered yet.</p>,
            title: 'Study Progression - site recruitment',
          },
        ]}
      />
    </>
  );
};
StudyProgression.propTypes = {
  data: PropTypes.object,
  baseURL: PropTypes.string,
  updateFilters: PropTypes.function,
  showChart: PropTypes.function,
};
StudyProgression.defaultProps = {
  data: {},
};

export default StudyProgression;
