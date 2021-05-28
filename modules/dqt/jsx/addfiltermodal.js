import {Component} from 'react';

/**
 * A modal window to add a filter
 */
class AddFilterModal extends Component {
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
      operator: null,
      value: null,
    };

    this.addFilter = this.addFilter.bind(this);
    this.onCategorySelected = this.onCategorySelected.bind(this);
    this.onFieldSelected = this.onFieldSelected.bind(this);
    this.onVisitChange = this.onVisitChange.bind(this);
    this.onOperatorSelected = this.onOperatorSelected.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
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
   * Add a filter when button is clicked
   */
  addFilter() {
    let visits = Object.keys(this.state.visits).filter(
      (k) => this.state.visits[k]
    );

    // Special case when all visits are selected
    if (visits.length == Object.keys(this.state.visits).length) {
      visits = 'all';
    }

    const filter = {
      type: 'filter',
      category: this.state.category,
      field: this.state.field,
      operator: this.state.operator,
      value: this.state.value,
      visits: visits,
    };
    this.props.addFilter(filter);
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
   * Sets the operator
   *
   * @param {object} e The event
   */
  onOperatorSelected(e) {
    this.setState({operator: e.target.value});
  }

  /**
   * Sets the filter value
   *
   * @param {object} e The event
   */
  onValueChange(e) {
    this.setState({value: e.target.value});
  }

  /**
   * Render
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let categoriesdropdown = null;
    let fieldsdropdown = null;
    let visitsdropdown = null;
    let operatorsdropdown = null;
    let valueinput = null;

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

    // if (Object.keys(this.props.selectedCategory).length > 0) {
    if (this.state.category != null) {
      // Field input
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

      // Operator input
      operatorsdropdown = (
        <select
          value={this.state.operator ?? ''}
          onChange={this.onOperatorSelected}
        >
          <option isDisable={true} value={''}></option>
          <option value="equal">Equal</option>
          <option value="notEqual">Not Equal</option>
          <option value="lessThanEqual">Lower Than or Equal</option>
          <option value="greaterThanEqual">Greater Than or Equal</option>
          <option value="startsWith">Starts With</option>
          <option value="contains">Contains</option>
          <option value="isNull">Is Null</option>
          <option value="isNotNull">Is Not Null</option>
        </select>
      );

      // Value input TODO
      valueinput = (
        <input
          type="text"
          value={this.state.value}
          onChange={this.onValueChange}
        />
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
          <h4 classiName="modal-title">Static Backdrop</h4>
        </div>
        <div className="modal-body">
          <form>
            {categoriesdropdown}
            {fieldsdropdown}
            {operatorsdropdown}
            {valueinput}
            {visitsdropdown}
          </form>
        </div>
        <div className="modal-footer">
          <button
           type="button"
            className="btn btn-default"
            data-dismiss="modal"
            onClick={this.addFilter}
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

export default AddFilterModal;
