import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'PanelTabs';

/**
 * Study Progression Panel.
 *
 * @description panel for dashboard.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class StudyProgression extends Component {
  /**
   * Constructor of component
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);
  }

  /**
   * @return {DOMRect}
   */
  render() {
    if (this.props.display) {
      let panel = {
        scansLineChart: {
          content: null,
          div: null,
        },
        recruitmentLineChart: {
          content: null,
          div: null,
        },
      };

      if (this.props.data) {
        if (parseInt(this.props.data.total_scans) > 0) {
          panel.scansLineChart.content = (
            <div id='scanChart'/>
          );
        } else {
          panel.scansLineChart.content = (
            <p>There have been no scans yet.</p>
          );
        }
        panel.scansLineChart.div = (
          <div id='scans-line-chart-panel'>
            {panel.scansLineChart.content}
          </div>
        );

        if (this.props.data.id === 'overall' &&
          parseInt(this.props.data.total_recruitment) > 0) {
          panel.recruitmentLineChart.content = (
            <div id='recruitmentChart'/>
          );
        } else if (this.props.data.id === 'overall') {
          panel.recruitmentLineChart.content = (
            <p>There have been no candidates registered yet.</p>
          );
        }
        panel.recruitmentLineChart.div = (
          <div id='recruitment-line-chart-panel' className='hidden'>
            <h5 className='chart-title'>Recruitment per site</h5>
            {panel.recruitmentLineChart.content}
          </div>
        );
      }

      return (
        <Panel
          title={'Study Progression'}
          id={'studyProgressionPanel'}
          class={'panel panel-default'}
          menu={
            [
              {
                dataTarget: 'scans-line-chart-panel',
                text: 'View scans per site',
              },
              {
                dataTarget: 'recruitment-line-chart-panel',
                text: 'View recruitment per site',
              },
            ]
          }
        >
          {panel.scansLineChart.div}
          {panel.recruitmentLineChart.div}
        </Panel>
      );
    } else {
      return null;
    }
  }
}
StudyProgression.defaultProps = {
  display: false,
  data: null,
};

StudyProgression.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
};

export default StudyProgression;
