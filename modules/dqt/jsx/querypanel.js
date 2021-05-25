import {Component} from 'react';
import PropTypes from 'prop-types';
import QueryField from './queryfield';
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
        const fields = this.props.query.fields.map((f) => {
          return (
            <QueryField
              data={f}
              toggleSelected={this.props.toggleSelectedField}
            />
          );
        });
        return (
            <div id="querypanel">
              <h2>QueryPanel</h2>
              <div id="selectedfields">
                <h3>Selected Fields</h3>
                <ul>
                  {fields}
                </ul>
              </div>
              <div>
                <h3>Selected Filters</h3>
              </div>
              {this.props.children}
            </div>
        );
    }
}

QueryPanel.propTypes = {
  query: PropTypes.object,
  toggleSelectedField: PropTypes.func.isRequired,
};

QueryPanel.defaultProps = {
  query: {
    fields: [],
    filters: {},
  },
};

export default QueryPanel;
