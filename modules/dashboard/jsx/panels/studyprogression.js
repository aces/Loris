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
      console.log(this.props.data);
      let panel = {
        scansLineChart: {
          title: null,
          content: null,
          div: null,
        },
        recruitmentLineChart: {
          content: null,
          div: null,
        },
      };

      if (this.props.data) {
        panel.scansLineChart.div = (
          <div id='scans-line-chart-panel'>

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
