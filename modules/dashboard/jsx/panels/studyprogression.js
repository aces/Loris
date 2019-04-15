import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

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
      return (
        <Panel
          title={'Study Progression'}
          id={'studyProgressionPanel'}
        >

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
