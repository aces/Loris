import {Component} from 'react';
import PropTypes from 'prop-types';
import CategoryItem from './categoryitem';

/**
 * DQT Select fields React Component
 */
class SelectFieldsTab extends Component {
  /**
   * Load categories when this gets mounted
   */
  componentDidMount() {
    this.props.getCategories();
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const categories = this.props.categories.map((c) => {
      const selected = this.props.selectedCategory.name ?? '';
      let fields = null;
      let visits = null;
      if (c.name == selected) {
          fields = this.props.selectedCategory.fields.map((x) => 'bob');
          visits = this.props.selectedCategory.visits;
      }
      return (
        <CategoryItem
          name={c.name}
          link={c.link}
          onCategorySelected={this.props.getCategoryFields}
          fields={fields}
          visits={visits}
        />
      );
    });
    return (
      <div>
        <h2>Select fields tab</h2>
        <ul>{categories}</ul>
      </div>
    );
  }
}

SelectFieldsTab.PropTypes = {
  getCategories: PropTypes.func.isRequired,
  getCategoryFields: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  })),
  selectedCategory: PropTypes.shape({
    name: PropTypes.string.isRequired,
    visits: PropTypes.arrayOf(PropTypes.string),
    fields: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      datatype: PropTypes.string.isRequired,
    })),
  }),
};

SelectFieldsTab.defaultProps = {
  categories: [],
};

export default SelectFieldsTab;
