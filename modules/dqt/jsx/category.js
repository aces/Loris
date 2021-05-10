import {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * DQT Category item React Component
 */
class Category extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Triggers the category selection
   */
  handleClick() {
    this.props.onCategorySelected(
      this.props.name,
      this.props.link
    );
  }

  /**
   * Render
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <li>
        <h4 onClick={this.handleClick}>{this.props.name}</h4>
        {this.props.children}
      </li>
    );
  }
}

Category.PropTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  onCategorySelected: PropTypes.func.isRequired,
};

export default Category;
