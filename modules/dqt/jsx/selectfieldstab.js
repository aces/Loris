import {Component} from 'react';
import PropTypes from 'prop-types';
import Category from './category';
import Field from './field';

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
    // Generate a list of categories to display
    const categories = this.props.categories.map((c) => {
      const selected = this.props.selectedCategory;
      let fields = null;

      // Add fields for the selected category
      if (selected.name == c.name) {
        fields = selected.fields.map((f) => {
           return (
             <Field
               data={f}
               category={selected.name}
               toggleSelected={this.props.toggleSelectedField}
               visits={selected.visits}
             />
           );
        });
      }

      return (
        <Category
          name={c.name}
          link={c.link}
          onCategorySelected={this.props.getCategoryFields}
          visits={selected.visits}
        >
        {fields}
        </Category>
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
  toggleSelectedField: PropTypes.func.isRequired,
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
  selectedCategory: {
    name: '',
    visits: [],
    fields: [],
  },
};

export default SelectFieldsTab;
