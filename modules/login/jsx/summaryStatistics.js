import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {SelectElement} from 'jsx/Form';
import SummaryStatisticsPhone from '../assets/summaryStatisticsPhone.js';

/**
 * Login Summary Statistics
 *
 *
 * @author Saagar Arya
 * @version 1.0.0
 */
class SummaryStatistics extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      selectedProject: 'All Projects',
      data: props.data,
    };
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div className='stats-phone'>
        <SummaryStatisticsPhone />
        {/* Phone screen */}
        <div className='stats-screen'>
          {/* Project Selector */}
          <SelectElement
            name='project'
            options={this.props.data.projects}
            value={this.state.selectedProject}
            onUserInput={(name, value) => {
              this.setState({
                selectedProject: value,
              });
            }}
            emptyOption={false}
          />
          <div>
            <span
              onClick={() => {
                navigator.clipboard.writeText(this.state.data.csv);
              }}
            >
              Data
            </span>
            {' '}in LORIS:
          </div>
          {/* Statistics */}
          {(this.state.data.statistics).map((statistic) => {
            if (
              statistic.Project
                == this.state.data.projects[this.state.selectedProject]
              && statistic.Value > 0
            ) {
              return <div>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: '#104985',
                  }}
                >
                  {statistic.Value.toLocaleString('fr-CA')}{' '}
                </span>
                {statistic.Title}{statistic.Value != 1 ? 's' : ''}
              </div>;
            }
          })}
        </div>
      </div>
    );
  }
}

SummaryStatistics.propTypes = {
  DataURL: PropTypes.string.isRequired,
  data: PropTypes.object,
};

export default SummaryStatistics;
