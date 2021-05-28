import {Component} from 'react';
import AddFilterModal from './addfiltermodal';
/**
 * DQT Add filter button React Component
 */
class AddFilterButton extends Component {
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
    this.addFilter = this.addFilter.bind(this);
  }

  /**
   * Show or hide modal
   */
  toggleModal() {
    this.setState(
      {showModal: !this.state.showModal}
    );
  }

  /**
   * Add a filter to the query
   *
   * @param {object} filter The new filter
   */
  addFilter(filter) {
    this.props.addFilter(filter, this.props.index ?? null);
    this.setState(
      {showModal: false}
    );
  }

  /**
   * Render
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let modal = null;
    if (this.state.showModal) {
      modal = (
        <AddFilterModal
          categories={this.props.categories}
          getCategoryFields={this.props.getCategoryFields}
          selectedCategory={this.props.selectedCategory}
          addFilter={this.addFilter}
          onClose={this.toggleModal}
        />
      );
    }
    return (
      <div style={{display: 'inline'}}>
      <button
        type="button"
        className="btn btn-primary"
        onClick={this.toggleModal}
      >
        Add
      </button>
      {modal}
      </div>
    );
  }
}

export default AddFilterButton;
