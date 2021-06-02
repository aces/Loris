import {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * A modal window to add a fields
 */
class SelectFieldsModal extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      category: null,
      field: null,
      visits: {},
    };

    this.addFields = this.addFields.bind(this);
    this.onCategorySelected = this.onCategorySelected.bind(this);
    this.onFieldSelected = this.onFieldSelected.bind(this);
    this.onVisitChange = this.onVisitChange.bind(this);
  }

  /**
   * componentDidUpdate;
   *
   * @param {object} prevProps The previous properties
   */
  componentDidUpdate(prevProps) {
    // Update state when a different category is selected
    const oldCategory = (prevProps.selectedCategory ?? {}).name ?? '';
    const newCategory = (this.props.selectedCategory ?? {}).name ?? '';

    if (oldCategory !== newCategory) {
      const visits = this.props.selectedCategory.visits.reduce((c, i) => {
        c[i] = true;
        return c;
      }, {});
      this.setState({
        category: this.props.selectedCategory.name,
        visits: visits,
      });
    }
  }

  /**
   * Add a fields
   */
  addFields() {
    console.info('SelectFieldsModal::addFields');
    const newfields = Object.keys(this.state.visits)
      .filter((key) => this.state.visits[key])
      .map((key) => {
        return {
          categoryname: this.state.category,
          fieldname: this.state.field,
          visitlabel: key,
        };
      });
    this.props.addFields(newfields);
  }

  /**
   * Sets the category
   *
   * @param {object} e The event
   */
  onCategorySelected(e) {
    const category = this.props.categories.find(
      (c) => c.name == e.target.value
    );
    this.props.getCategoryFields(category.name, category.link);
  }

  /**
   * Sets the field
   *
   * @param {object} e The event
   */
  onFieldSelected(e) {
    this.setState({field: e.target.value});
  }

  /**
   * Sets the visits
   *
   * @param {object} e The event
   */
  onVisitChange(e) {
    const selectedVisits = Array.from(e.target.selectedOptions, (o) => o.value);
    const visits = this.state.visits;

    const newVisits = Object.keys(visits).reduce((c, i) => {
      c[i] = selectedVisits.includes(i);
      return c;
    }, {});

    this.setState({visits: newVisits});
  }

  /**
   * Render
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    console.info('SelectFieldsModal::render');
    let categoriesdropdown = null;
    let fieldsdropdown = null;
    let visitsdropdown = null;
    // Category input
    const categoriesOptions = this.props.categories.map((c) =>{
      return (
        <option value={c.name}>{c.name}</option>
      );
    });

    categoriesdropdown = (
      <select
        value={this.state.category ?? ''}
        onChange={this.onCategorySelected}
      >
        <option isDisable={true} value={''}></option>
        {categoriesOptions}
      </select>
    );

    if (this.state.category != null) {
      // Field input
      console.info('render');
      console.info(this.props.selectedCategory);
      const fieldsOptions = this.props.selectedCategory.fields.map((f) => {
        return (
          <option value={f.name}>{f.name}</option>
        );
      });
      fieldsdropdown = (
        <select
          value={this.state.field ?? ''}
          onChange={this.onFieldSelected}
        >
          <option isDisable={true} value={''}></option>
          {fieldsOptions}
        </select>
      );

      // Visits input
      const visitsOptions = this.props.selectedCategory.visits.map((v) => {
        return (
          <option value={v}>{v}</option>
        );
      });

      const selectedVisits = (Object.keys(this.state.visits).filter((k) => {
        return this.state.visits[k];
      }));

      visitsdropdown = (
        <>
        <label htmlFor="visitsdropdown">
          Mutiple select list (hold shift to select more than one):
        </label>
        <select
          className="form-control"
          id="visitsdropdown"
          multiple={true}
          value={selectedVisits}
          onChange={this.onVisitChange}
        >
          <option isDisable={true}></option>
          {visitsOptions}
        </select>
        </>
      );
    }

    return (
      <div
        className="modal fade in"
        role="dialog"
        style={{
          display: 'block',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        data-backdrop="static"
        data-keyboard="false"
      >
      <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            onClick={this.props.onClose}
          >
            ×
          </button>
          <h4 classiName="modal-title">Fields Selection</h4>
        </div>
        <div className="modal-body">
          <form>
            {categoriesdropdown}
            {fieldsdropdown}
            {visitsdropdown}
          </form>
        </div>
        <div className="modal-footer">
          <button
           type="button"
            className="btn btn-default"
            data-dismiss="modal"
            onClick={this.addFields}
          >
            Add
          </button>
          <button
            type="button"
            className="btn btn-default"
            data-dismiss="modal"
            onClick={this.props.onClose}
          >
            Close
          </button>
        </div>
      </div>
      </div>
      </div>
    );
  }
}

SelectFieldsModal.PropTypes = {
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
  addFields: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

SelectFieldsModal.defaultProps = {
  categories: [],
};

export default SelectFieldsModal;
