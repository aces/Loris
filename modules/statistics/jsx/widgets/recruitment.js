import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from 'jsx/Panel';

/**
 * Recruitment - a widget containing statistics for recruitment data.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
const Recruitment = (props) => {
  const [loading, setLoading] = useState(true);
  const [overall, setOverall] = useState({});
  const [siteBreakdown, setSiteBreakdown] = useState({});
  const [projectBreakdown, setProjectBreakdown] = useState({});

  /**
   * useEffect - modified to run when props.data updates.
   */
  useEffect(() => {
    const json = props.data;
    if (json && Object.keys(json).length !== 0) {
      const overallData = (
        <div className='recruitment-panel' id='overall-recruitment'>
          {progressBarBuilder(json['recruitment']['overall'])}
        </div>
      );
      let siteBreakdownData;
      if (json['recruitment']['overall'] &&
        json['recruitment']['overall']['total_recruitment'] > 0
      ) {
        siteBreakdownData = (
          <>
            <div className='col-lg-4 col-md-4 col-sm-4'>
              <h5 className='chart-title'>
                Total recruitment per site
              </h5>
              <div id='recruitmentPieChart'/>
            </div>
            <div className='col-lg-8 col-md-8 col-sm-8'>
              <h5 className='chart-title'>
                Biological sex breakdown by site
              </h5>
              <div id='recruitmentBarChart'/>
            </div>
          </>
        );
      } else {
        siteBreakdownData = (
          <p>There have been no candidates registered yet.</p>
        );
      }
      let projectBreakdownData = [];
      for (const [key, value] of Object.entries(json['recruitment'])) {
        if (key !== 'overall') {
          projectBreakdownData.push(
            <div key={`projectBreakdown_${key}`}>
              {progressBarBuilder(value)}
            </div>
          );
        }
      }
      setProjectBreakdown(projectBreakdownData);
      setOverall(overallData);
      setSiteBreakdown(siteBreakdownData);
      setLoading(false);
    }
  }, [props.data]);

  /**
   * progressBarBuilder - generates the graph content.
   *
   * @param {object} data - data needed to generate the graph content.
   * @return {JSX.Element} the charts to render to the widget panel.
   */
  const progressBarBuilder = (data) => {
    let title;
    let content;
    if (data['recruitment_target']) {
      title = <h5>
        {data['title']}
      </h5>;
      if (data['surpassed_recruitment']) {
        content = (
          <div>
            <p>
              The recruitment target (
              {data['recruitment_target']}
              ) has been passed.
            </p>
            <div className='progress'>
              <div className='progress-bar progress-bar-female'
                   role='progressbar'
                   style={{width: `${data['female_full_percent']}%`}}
                   data-toggle='tooltip'
                   data-placement='bottom'
                   title={`${data['female_full_percent']}%`}>
                <p>
                  {data['female_total']}<br/>Females
                </p>
              </div>
              <div className='progress-bar progress-bar-male'
                   data-toggle='tooltip'
                   data-placement='bottom'
                   role='progressbar'
                   style={{width: `${data['male_full_percent']}%`}}
                   title={`${data['male_full_percent']}%`}>
                <p>
                  {data['male_total']}<br/>Males
                </p>
              </div>
              <p className='pull-right small target'>
                Target: {data['recruitment_target']}
              </p>
            </div>
          </div>
        );
      } else {
        content = (
          <div className='progress'>
            <div className='progress-bar progress-bar-female'
                 role='progressbar'
                 style={{width: `${data['female_percent']}%`}}
                 data-toggle='tooltip'
                 data-placement='bottom'
                 title={`${data['female_percent']}%`}>
              <p>
                {data['female_total']}<br/>Females
              </p>
            </div>
            <div className='progress-bar progress-bar-male'
                 data-toggle='tooltip'
                 data-placement='bottom'
                 role='progressbar'
                 style={{width: `${data['male_percent']}%`}}
                 title={`${data['male_percent']}%`}>
              <p>
                {data['male_total']}<br/>Males
              </p>
            </div>
            <p className='pull-right small target'>
              Target: {data['recruitment_target']}
            </p>
          </div>
        );
      }
    } else {
      content = (
        <div>
          Please add a recruitment target for {data['title']}.
        </div>
      );
    }
    return (
      <>
        {title}
        {content}
      </>
    );
  };

  /**
   * Renders the React component.
   *
   * @return {JSX.Element} - React markup for component.
   */
  return loading ? <Panel title='Recruitment'><Loader/></Panel> : (
    <Panel
      title='Recruitment'
      id='statistics_recruitment'
      views={[
        {
          content:
            <>
              {overall}
            </>,
          title: 'Recruitment - overall',
        },
        {
          content:
            <>
              {siteBreakdown}
            </>,
          title: 'Recruitment - site breakdown',
        },
        {
          content:
            <>
              {projectBreakdown}
            </>,
          title: 'Recruitment - project breakdown',
        },
      ]}
    />
  );
};
Recruitment.propTypes = {
  data: PropTypes.object,
};
Recruitment.defaultProps = {
  data: {},
};

export default Recruitment;
