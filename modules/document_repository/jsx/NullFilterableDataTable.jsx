import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
NullFilterableDataTable.propTypes = {
  children: PropTypes.node,
};

export default NullFilterableDataTable;
