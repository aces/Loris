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
   * Load categories when this gets mounted
   */
  componentDidMount() {
    this.props.getCategories();
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
    return (
      <div>
        <fieldset>
          <FilterItem
            filters={this.props.filters}
            index={0}
            setFilter={this.setFilters}
            deleteFilter={this.deleteFilters}
            categories={this.props.categories}
            getCategoryFields={this.props.getCategoryFields}
            selectedCategory={this.props.selectedCategory}
          />
       </fieldset>
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
