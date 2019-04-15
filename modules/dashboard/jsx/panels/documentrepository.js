import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

/**
 * Document Repository Notifications Panel.
 *
 * @description panel for dashboard.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class DocumentRepositoryNotifications extends Component {
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
          title={'Document Repository Notifications'}
          id={'documentRepositoryPanel'}
        >

        </Panel>
      );
    } else {
      return null;
    }
  }
}
DocumentRepositoryNotifications.defaultProps = {
  display: false,
  data: null,
};

DocumentRepositoryNotifications.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
};

export default DocumentRepositoryNotifications;
