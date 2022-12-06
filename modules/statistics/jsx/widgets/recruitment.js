import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from '../Panel';
// import * as chartBuilder from './chartBuilder';

/**
 * Recruitment - a widget containing statistics for recruitment data.
 * @param {object} props
 * @return {JSX.Element}
 */
const Recruitment = (props) => {
  const [loading, setLoading] = useState(true);
  const [overall, setOverall] = useState({});
  const [siteBreakdown, setSiteBreakdown] = useState({});

  /**
   * Similar to componentDidMount and componentDidUpdate.
   */
  useEffect(() => {
    // Fetch data from backend.
    fetchData();
  }, []);

  /**
   * Retrieve data from the provided URL and save it in state.
   */
  const fetchData = () => {
    fetch(`${props.baseURL}/Recruitment`,
      {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => {
          console.log('json is ');
          console.log(json);
          const overallData = (
            <div className='recruitment-panel' id='overall-recruitment'>
              {progressBarBuilder(json)}
            </div>
          );
          let siteBreakdownData;
          if (json['recruitment']['progress']['overall'] &&
            json['recruitment']['progress']['overall']['total_recruitment'] > 0
          ) {
            siteBreakdownData = (
              <>
                <div className='col-lg-12 col-md-12 col-sm-12'>
                  <div>
                    <h5 className='chart-title'>
                      Total recruitment per site
                    </h5>
                    <div id='recruitmentPieChart'/>
                  </div>
                </div>
                <div className='col-lg-12 col-md-12 col-sm-12'>
                  <div>
                    <h5 className='chart-title'>
                      Biological sex breakdown by site
                    </h5>
                    <div id='recruitmentBarChart'
                         style={{position: 'relative'}}
                    />
                  </div>
                </div>
              </>
            );
          } else {
            siteBreakdownData = (
              <p>There have been no candidates registered yet.</p>
            );
          }
          setOverall(overallData);
          setSiteBreakdown(siteBreakdownData);
          setLoading(false);
          // Process statistics for c3.js
          // todo chartBuilder code should be replaced with npmjs version.
          // chartBuilder.process();
        });
      } else {
        // set error
        console.error(resp.statusText);
      }
    }).catch((error) => {
      // set error
      console.error(error);
    });
  };

  /**
   * progressBarBuilder - generates the graph content.
   * @param {object} data - data needed to generate the graph content.
   * @return {JSX.Element} the charts to render to the widget panel.
   */
  const progressBarBuilder = (data) => {
    let title;
    let content;
    if (data['recruitment']['progress']['overall']['recruitment_target']) {
      title = <h5>
        {data['recruitment']['progress']['overall']['title']}
      </h5>;
      if (data['recruitment']['progress']['overall']['surpassed_recruitment']) {
        content = (
          <div>
            <p>
              The recruitment target (
              {data['recruitment']['progress']['overall']['recruitment_target']}
              ) has been passed.
            </p>
            <div className='progress'>
              <div className='progress-bar progress-bar-female'
                   role='progressbar'
                   style={
                     {
                       width: data['recruitment']['progress']['overall']
                         ['female_full_percent'] + '%',
                     }
                   }
                   data-toggle='tooltip'
                   data-placement='bottom'
                   title={
                     data['recruitment']['progress']['overall']
                       ['female_full_percent'] + '%'
                   }
              >
                <p>
                  {data['recruitment']['progress']['overall']['female_total']}
                  <br/>
                  Females
                </p>
              </div>
              <div className='progress-bar progress-bar-male'
                   data-toggle='tooltip'
                   data-placement='bottom'
                   role='progressbar'
                   style={
                     {
                       width: data['recruitment']['progress']['overall']
                         ['male_full_percent'] + '%',
                     }
                   }
                   title={
                     data['recruitment']['progress']['overall']
                       ['male_full_percent'] + '%'
                   }
              >
                <p>
                  {data['recruitment']['progress']['overall']['male_total']}
                  <br/>
                  Males
                </p>
              </div>
              <p className='pull-right small target'>
                Target: {data['recruitment']['progress']['overall']
                ['recruitment_target']}
              </p>
            </div>
          </div>
        );
      } else {
        content = (
          <div className='progress'>
            <div className='progress-bar progress-bar-female'
                 role='progressbar'
                 style={
                   {
                     width: data['recruitment']['progress']['overall']
                       ['female_percent'] + '%',
                   }
                 }
                 data-toggle='tooltip'
                 data-placement='bottom'
                 title={data['recruitment']['progress']['overall']
                   ['female_percent'] + '%'}
            >
              <p>
                {data['recruitment']['progress']['overall']['female_total']}
                <br/>
                Females
              </p>
            </div>
            <div className='progress-bar progress-bar-male'
                 data-toggle='tooltip'
                 data-placement='bottom'
                 role='progressbar'
                 style={
                   {
                     width: data['recruitment']['progress']['overall']
                       ['male_percent'] + '%',
                   }
                 }
                 title={
              data['recruitment']['progress']['overall']['male_percent'] + '%'}
            >
              <p>
                {data['recruitment']['progress']['overall']['male_total']}
                <br/>
                Males
              </p>
            </div>
            <p className='pull-right small target'>
              Target: {
              data['recruitment']['progress']['overall']['recruitment_target']}
            </p>
          </div>
        );
      }
    } else {
      content = (
        <div>
          Please add a recruitment target for {
          data['recruitment']['progress']['overall']['title']
        }.
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
   * @return {JSX.Element} - React markup for component.
   */
  return loading ? <Panel title='Recruitment'><Loader/></Panel> : (
    <Panel
      title='Recruitment'
      id='statistics_recruitment'
      views={[
        {visible: true,
          content:
            <div className='recruitment-panel' id='overall-recruitment'>
              {overall}
            </div>,
          title: 'Recruitment'},
        {visible: true,
          content:
            <div className='recruitment-panel'
                 id='recruitment-site-breakdown'>
              {siteBreakdown}
            </div>,
          title: 'Site Breakdown',
        },
      ]}
    />
  );
};
Recruitment.propTypes = {
  baseURL: PropTypes.string,
};
Recruitment.defaultProps = {
  baseURL: false,
};

export default Recruitment;
