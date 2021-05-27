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

    this.onCategorySelected = this.onCategorySelected.bind(this);
    this.onFieldSelected = this.onFieldSelected.bind(this);
    this.onVisitChange = this.onVisitChange.bind(this);
    this.onOperatorSelected = this.onOperatorSelected.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  }

  /**
   * Sets the category
   *
   * @param {object} e The event
   */
  onCategorySelected(e) {
    console.info(e.target);
    console.info(e.target.value);
    console.info(e.target.link);

    let categoryname = e.target.value;

    this.setState({category: categoryname});
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
    const visits = this.state.visits;
    console.info(JSON.stringify(e.target));
    visits[visit] = activated;
    this.setState({visits: e.target.value});
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
    this.setState({value});
  }

  /**
   * Render
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const categoriesOptions = this.props.categories.map((c) =>{
      return (
        <option value={c.name} link={c.link}>{c.name}</option>
      );
    });

    const selectedVisits = (Object.keys(this.state.visits).filter((k) => {
      return this.state.visits[k];
    }));

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
            <select
              value={this.state.category}
              onChange={this.onCategorySelected}
            >
              {categoriesOptions}
            </select>
            <select
              value={this.state.field}
              onChange={this.onFieldSelected}
            >
            </select>
            <select
              value={this.state.operator}
              onChange={this.onOperatorSelected}
            >
              <option value="equal">Equal</option>
              <option value="notEqual">Not Equal</option>
              <option value="lessThanEqual">Lower Than or Equal</option>
              <option value="greaterThanEqual">Greater Than or Equal</option>
              <option value="startsWith">Starts With</option>
              <option value="contains">Contains</option>
              <option value="isNull">Is Null</option>
              <option value="isNotNull">Is Not Null</option>
            </select>
            <input
              type="text"
              value={this.state.value}
              onChange={this.onValueChange}
            />
            <select
              multiple={true}
              value={selectedVisits}
              onChange={this.onVisitChange}
            >
            </select>
          </form>
        </div>
        <div className="modal-footer">
          <button
           type="button"
            className="btn btn-default"
            data-dismiss="modal"
            onClick={this.props.addFilter}
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
