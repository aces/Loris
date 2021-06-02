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
    let savebutton = null;
    let runbutton = null;

    const loadbutton = (
      <button onClick={this.props.loadQueries}>Load</button>
    );

    if (this.props.query.fields.length > 0) {
      savebutton = <button onClick={this.props.saveQuery}>Save</button>;
      runbutton = <button onClick={this.props.runQuery}>Run</button>;
    }

    return (
      <div id="querypanel">
        <p>
          Load an existing query of build your own.
          Select at least one field and optionnaly add filters.
        </p>
        {loadbutton}
        {savebutton}
        {runbutton}
      </div>
    );
  }
}

QueryPanel.propTypes = {
  queries: PropTypes.arrayOf(PropTypes.object),
  query: PropTypes.object,
  loadQueries: PropTypes.func.isRequired,
  runQuery: PropTypes.func.isRequired,
  savequery: PropTypes.func.isRequired,
};

QueryPanel.defaultProps = {
  queries: [],
  query: {
    fields: [],
    filters: {},
  },
};

export default QueryPanel;
