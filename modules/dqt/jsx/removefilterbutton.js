import {Component} from 'react';
/**
 * A button to remove a filter
 */
class RemoveFilterButton extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Call the deleteFilter callback from props
   */
  handleClick() {
    this.props.deleteFilter(this.props.index);
  }

  /**
   * Render
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={this.handleClick}
        >
          Remove
        </button>
      </div>
    );
  }
}

export default RemoveFilterButton;
