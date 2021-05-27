import {Component} from 'react';
import PropTypes from 'prop-types';
import FilterItem from './filteritem';

/**
 * DQT Add filters React Component
 */
class AddFiltersTab extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.setFilters = this.setFilters.bind(this);
    this.deleteFilters = this.deleteFilters.bind(this);
  }

  /**
   * Set the query filters
   *
   * @param {object} filters The new filters
   */
  setFilters(filters) {
    console.info('AddFiltersTab::setFilters');
    this.props.setFilters(filters);
  }

  /**
   * Delete all the filters
   */
  deleteFilters() {
    console.info('AddFiltersTab::deleteFilters');
    this.props.setFilters({});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const query = {
        filters: {
          type: 'group',
          operator: 'AND',
          items: [
            {
              type: 'filter',
              operator: 'equals',
              category: 'demographics',
              field: 'Sex',
              value: 'Female',
            },
            {
              type: 'group',
              operator: 'OR',
              items: [
                {
                  type: 'filter',
                  operator: 'equals',
                  category: 'demographics',
                  field: 'DoB',
                  value: '1936-09-15',
                },
                {
                  type: 'filter',
                  operator: 'equals',
                  category: 'demographics',
                  field: 'DoB',
                  value: '1936-10-15',
                },
                {
                  type: 'filter',
                  operator: 'equals',
                  category: 'demographics',
                  field: 'DoB',
                  value: '1936-11-15',
                },
              ],
            },
          ],
        },
    };

    if (Object.keys(this.props.filters).length > 0) {
      query.filters = this.props.filters;
    }

    return (
      <div>
        <h2>AddFiltersTab</h2>
        <FilterItem
          filters={query.filters}
          index={0}
          setFilter={this.setFilters}
          deleteFilter={this.deleteFilters}
          categories={this.props.categories}
        />
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
