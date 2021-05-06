import {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * DQT Query Panel React Component
 */
class QueryPanel extends Component {
  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
    render() {
        const fields = this.props.selectedfields.map((f) => `<li>${f}</li>`);
        return (
            <div id="querypanel">
              <h2>QueryPanel</h2>
              <div id="selectedfields">
                <ul>
                  {fields}
                </ul>
              </div>
              <div>Selected Filters</div>
            </div>
        );
    }
}

QueryPanel.propTypes = {
  selectedfields: PropTypes.array,
};

QueryPanel.defaultProps = {
  selectedfields: [],
};

export default QueryPanel;
