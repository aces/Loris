import React, {Component} from 'react';

/**
 * Null filterable data table component
 */
class NullFilterableDataTable extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
export default NullFilterableDataTable;
