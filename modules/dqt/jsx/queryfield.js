import {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * DQT Field item React Component
 */
class QueryField extends Component {
  /**
   * Render
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const label = Object.values(this.props.data).join('::');
    return (
      <div>
        <span>{label}</span>
      </div>
    );
  }
}

QueryField.PropTypes = {
  data: PropTypes.shape({
    categoryname: PropTypes.string.isRequired,
    fieldname: PropTypes.string.isRequired,
    visitlabel: PropTypes.string.isRequired,
  }).isRequired,
};

export default QueryField;
