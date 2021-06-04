import {Component} from 'react';
import PropTypes from 'prop-types';
import QueryField from './queryfield';
import SelectFieldsModal from './selectfieldsmodal';

/**
 * DQT Select fields React Component
 */
class SelectFieldsTab extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.addFields = this.addFields.bind(this);
    this.removeField = this.removeField.bind(this);
  }

  /**
   * Ask the parent to populate the categories
   */
  componentDidMount() {
    this.props.getCategories();
  }

  /**
   * Show or hide modal
   */
  toggleModal() {
    console.info('SelectFieldsTab::toggleModal');
    this.setState(
      {showModal: !this.state.showModal}
    );
  }

  /**
   * Add fields to the query
   *
   * @param {array} fields The fields to add
   */
  addFields(fields) {
    console.info('SelectFieldsTab::addFields');
    console.info(fields);

    // Add the new fields and remove duplicates if any
    const uniqueSet = this.props.selectedFields
      .concat(fields)
      .reduce((carry, item) => {
        const key = Object.values(item).join(',');
        carry[key] = item;
        return carry;
      }, []);

    this.setState({
      showModal: false,
    }, this.props.setQueryFields(Object.values(uniqueSet)));
  }

  /**
   * Remove a specific field
   *
   * @param {string} category The category name
   * @param {string} field The field name
   * @param {string} visit The visit label
   */
  removeField(category, field, visit) {
    const newfields = this.props.selectedFields.filter((f, i, a) => {
      return (
        f.categoryname != category ||
        f.fieldname != field ||
        f.visitlabel != visit
      );
    });
    this.props.setQueryFields(newfields);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const selectedFields = this.props.selectedFields.map((f) => {
      return (
        <>
        <QueryField data={f}/>
        <button onClick={() => {
          this.removeField(
            f.categoryname,
            f.fieldname,
            f.visitlabel
          );
        }}>
          ×
        </button>
        </>
      );
    });

    let modal = null;
    if (this.state.showModal) {
      modal = (
        <SelectFieldsModal
          categories={this.props.categories}
          getCategoryFields={this.props.getCategoryFields}
          selectedCategory={this.props.selectedCategory}
          addFields={this.addFields}
          onClose={this.toggleModal}
        />
      );
    }

    return (
      <div>
        <fieldset>
          <legend>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.toggleModal}
            >
              Add Field(s)
            </button>
          </legend>
          {selectedFields}
        </fieldset>
        {modal}
      </div>
    );
  }
}

SelectFieldsTab.PropTypes = {
  getCategories: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  })),
  getCategoryFields: PropTypes.func.isRequired,
  selectedCategory: PropTypes.shape({
    name: PropTypes.string.isRequired,
    visits: PropTypes.arrayOf(PropTypes.string),
    fields: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      datatype: PropTypes.string.isRequired,
    })),
  }),
  selectedFields: PropTypes.arrayOf(PropTypes.shape({
  category: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  visit: PropTypes.string.isRequired,
  })),
  setQueryFields: PropTypes.func.isRequired,
};

SelectFieldsTab.defaultProps = {
  categories: [],
  selectedFields: [],
};

export default SelectFieldsTab;
