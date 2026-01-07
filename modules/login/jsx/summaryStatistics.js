import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {SelectElement} from 'jsx/Form';
import SummaryStatisticsPhone from '../assets/summaryStatisticsPhone.js';
import {useTranslation} from 'react-i18next';

/**
 * Login Summary Statistics
 *
 * @author Saagar Arya
 * @version 1.0.0
 */
const SummaryStatistics = ({data}) => {
  const {t} = useTranslation();
  const [selectedProject, setSelectedProject] = useState(
    data.projects.includes('All Projects')
      ? data.projects.indexOf('All Projects')
      : '0'
  );

  return (
    <div className='stats-phone'>
      <SummaryStatisticsPhone />
      {/* Phone screen */}
      <div className='stats-screen'>
        {/* Project Selector */}
        <SelectElement
          name='project'
          options={data.projects}
          value={selectedProject}
          onUserInput={(name, value) => setSelectedProject(value)}
          emptyOption={false}
        />
        <div>{t('Data in LORIS:', {ns: 'login'})}</div>
        {/* Statistics */}
        {data.statistics.map((statistic, index) => {
          if (
            statistic.Project === data.projects[selectedProject] &&
            statistic.Value > 0
          ) {
            return (
              <div key={index}>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: '#104985',
                  }}
                >
                  {statistic.Value.toLocaleString('fr-CA')}{' '}
                </span>
                {statistic.Title}
              </div>
            );
          }
          return null;
        })}
        {/* Copy to clipboard */}
        <div className='stats-copy'>
          <span
            className='glyphicon glyphicon-copy'
            style={{cursor: 'pointer', opacity: '0.1'}}
            onClick={() => navigator.clipboard.writeText(data.csv)}
          />
        </div>
      </div>
    </div>
  );
};

SummaryStatistics.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SummaryStatistics;
