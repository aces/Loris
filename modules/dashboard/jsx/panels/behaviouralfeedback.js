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
      let panel = {
        behaviouralFeedback: {
          content: [],
          div: null,
        },
      };
      if (this.props.data) {
        if (this.props.data.notifications) {
          let notifications = [];
          for (let notification in this.props.data.notifications) {
            if (this.props.data.notifications.hasOwnProperty(notification)) {
              notifications.push(
                (
                  <a key={'behavioural_feedback_notification_' + notification}
                    href={
                    window.location.origin +
                    this.props.data.notifications[notification].URL
                  }
                     className={'list-group-item'}
                  >
                    {parseInt(this.props.data.notifications[notification].new) === 1 ? (
                      <span className={'pull-left new-flag'}>NEW</span>
                    ) : null}
                    <span className={'pull-right text-muted small'}>
                      Updated:&nbsp;
                      {this.props.data.notifications[notification].Testdate}
                    </span>
                    <br/>
                    {
                      this.props.data.notifications[notification].Name}:&nbsp;
                    {this.props.data.notifications[notification].Comment
                    }
                  </a>
                )
              );
            }
          }
          panel.behaviouralFeedback.content.push(notifications);

          panel.behaviouralFeedback.div = (
            <div className='list-group bvl-feedback-item'>
              {panel.behaviouralFeedback.content.length > 0 ?
                panel.behaviouralFeedback.content :
                'There have been no notifications yet.'}
            </div>
          );
        }
      }
      return (
        <Panel
          title={'Behavioural Feedback Notifications'}
          id={'behaviouralFeedbackPanel'}
        >
          {panel.behaviouralFeedback.div}
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
