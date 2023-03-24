import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from 'jsx/Panel';

/**
 * StudyProgression - a widget containing statistics for study data.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
const StudyProgression = (props) => {
  const [loading, setLoading] = useState(true);
  const [siteScans, setSiteScans] = useState({});
  const [siteRecruitments, setSiteRecruitments] = useState({});

  /**
   * useEffect - modified to run when props.data updates.
   */
  useEffect(() => {
    const json = props.data;
    if (json && Object.keys(json).length !== 0) {
      setSiteScans(
        json['studyprogression']['total_scans'] > 0
          ? <div className='row'>
            <h5 className="chart-title col-xs-12">Scan sessions per site</h5>
            <div id='scanChart' className='col-xs-10'/>
            <div className='scanChartLegend legend-container col-xs-2'/>
            <small className='col-xs-12'>
              <i>Note that the Recruitment and Study Progression charts
              &nbsp;include data from ineligible, excluded, and consent
              &nbsp;withdrawn candidates.</i>
            </small>
          </div>
          : <p>There have been no scans yet.</p>
      );
      setSiteRecruitments(
        json['studyprogression']['recruitment']['overall']
          ['total_recruitment'] > 0
          ? <div className='row'>
            <h5 className='chart-title col-xs-12'>Recruitment per site</h5>
            <div id='recruitmentChart' className='col-xs-10'/>
            <div className={
              'recruitmentChartLegend legend-container col-xs-2'
            }/>
            <small>
              <i>Note that the Recruitment and Study Progression charts
              &nbsp;include data from ineligible, excluded, and consent
              &nbsp;withdrawn candidates.</i>
            </small>
          </div>
          : <p>There have been no candidates registered yet.</p>
      );
      setLoading(false);
    }
  }, [props.data]);

  /**
   * Renders the React component.
   *
   * @return {JSX.Element} - React markup for component.
   */
  return loading ? <Panel title='Study Progression'><Loader/></Panel> : (
    <Panel
      title='Study Progression'
      id='statistics_studyprogression'
      views={[
        {
          content: <>
            {siteScans}
          </>,
          title: 'Study Progression - site scans',
        },
        {
          content: <>
            {siteRecruitments}
          </>,
          title: 'Study Progression - site recruitment',
        },
      ]}
    />
  );
};
StudyProgression.propTypes = {
  data: PropTypes.object,
};
StudyProgression.defaultProps = {
  data: {},
};

export default StudyProgression;
