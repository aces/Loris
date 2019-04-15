import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

/**
 * My Tasks Panel.
 *
 * @description panel for dashboard.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class MyTasks extends Component {
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
          title={'My Tasks'}
          id={'tasksPanel'}
        >

        </Panel>
      );
    } else {
      return null;
    }
  }
}
MyTasks.defaultProps = {
  display: false,
  data: null,
};

MyTasks.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
};

export default MyTasks;
