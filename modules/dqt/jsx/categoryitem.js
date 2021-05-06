import {Component} from 'react';

/**
 * DQT Category item React Component
 */
class CategoryItem extends Component {
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
    this.props.onCategorySelected(this.props.name, this.props.link);
  }

  /**
   * Render
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <li onClick={this.handleClick}>
        <h4>{this.props.name}</h4>
        <ul>
          {fields}
        </ul>
      </li>
    );
  }
}

export default CategoryItem;
