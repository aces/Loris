import {Component} from 'react';
import PropTypes from 'prop-types';
import FilterGroup from './filtergroup';

/**
 * DQT Add fitlers React Component
 */
class AddFiltersTab extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.addFilter = this.addFilter.bind(this);
    // this.addGroup = this.addGroup.bind(this);
  }

  /**
   * Add a filter to the query
   */
  addFilter() {
    console.info('addFilter');
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div>
        <h2>AddFiltersTab</h2>
        <button onClick={this.addFilter}>Add Filter</button>
        <FilterGroup filters={this.props.query.filters}/>
      </div>
    );
  }
}

AddFiltersTab.PropTypes = {
  query: PropTypes.object,
};

AddFiltersTab.defaultProps = {
  query: {
    filters: {
    },
  },
};

export default AddFiltersTab;
