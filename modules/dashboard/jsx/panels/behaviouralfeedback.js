import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

/**
 * Behavioural Feedback Notifications Panel.
 *
 * @description panel for dashboard.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class BehaviouralFeedbackNotifications extends Component {
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
          title={'Behavioural Feedback Notifications'}
          id={'behaviouralFeedbackPanel'}
        >

        </Panel>
      );
    } else {
      return null;
    }
  }
}
BehaviouralFeedbackNotifications.defaultProps = {
  display: false,
  data: null,
};

BehaviouralFeedbackNotifications.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
};

export default BehaviouralFeedbackNotifications;
