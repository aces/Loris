import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import PieChart from './piechart';
import BarChart from './barchart';

const StatisticsReport = (props) => {
  const [loaded, setLoaded] = useState(false);

  const [statistics, setStatistics] = useState({
    participants: '',
    gender: [],
  });

  async function fetchStatistics() {
    let resp = await fetch(props.loris.BaseURL
      + '/AjaxHelper.php?Module=dqt&script=statistics.php', {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'same-origin',
    });
    if (resp.ok && resp.status === 200) {
      let data = await resp.json();
      data.report = [];
      for (const property in data.statistics) {
        if (data.statistics.hasOwnProperty(property)) {
          const illness = property;
          const females = data.statistics[property].Female;
          const males = data.statistics[property].Male;
          data.report.push([
            <tr className='statsReport' key={'stats_report_' + property}>
              <td className='statsReport'>{illness}</td>
              <td className='statsReport'>{females}</td>
              <td className='statsReport'>{males}</td>
            </tr>,
          ]);
        }
      }
      data.report = [
        <table className='statsReport' key={'statsReport'}>
          <thead>
            <tr className='statsReport'>
              <th className='statsReport'>Disease</th>
              <th className='statsReport'>Females</th>
              <th className='statsReport'>Males</th>
            </tr>
          </thead>
          <tbody>
            {data.report}
          </tbody>
        </table>,
      ];
      data.sources = [];
      for (const property in data.sites) {
        if (data.sites.hasOwnProperty(property)) {
          const site = data.sites[property];
          data.sources.push(
            site + ' | '
          );
        }
      }
      setStatistics(data);
      return true;
    }
    console.error('fetchStatistics failed');
    return false;
  }

  useEffect(() => {
    fetchStatistics().then((status) => {
      setLoaded(status);
    });
  }, []);

  return (loaded) ? (
    <div className={'container-fluid'}
         style={{margin: '0 auto', maxWidth: '900px'}}>
      <div style={{
        width: '100%',
        color: '#fff',
        padding: '18px',
        outline: 'none',
        fontSize: '1.2em',
        textAlign: 'center',
        backgroundColor: '#913887',
      }}>
        Statistics Report
      </div>
      <div style={{
        display: 'block',
        margin: '0 0 10px',
        overflow: 'hidden',
        padding: '20px 18px',
        backgroundColor: '#fff',
        border: '1px solid #913887',
      }}>
        <p align={'center'}><b style={{color: '#0d346e'}}>
          Number of participants:</b> {statistics.participants}
        </p>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <BarChart
            id={'barChartDisease'}
            data={statistics.disease}
            style={{flex: 1}}
          />
          <PieChart
            id={'pieChartGender'}
            data={statistics.gender}
            style={{flex: 0.5}}
          />
        </div>
        <div>
          <label id='diseases_label' htmlFor='all_diseases'>
            Show/Hide other diseases
          </label>
          <input type='checkbox'
                 id='all_diseases'
                 style={{display: 'none'}}
          />
          <div id='hidden_diseases'>
            {statistics.report}
          </div>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <b>Sources: </b>{statistics.sources}
        </div>
      </div>
    </div>
  ) : (
    <>
    </>
  );
};
StatisticsReport.propTypes = {
  loris: PropTypes.object,
};

export default StatisticsReport;
