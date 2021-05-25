import {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Fitler
 */
class Filter extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
        visits: {},
        operator: 'AND',
    };

    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * componentDidMount adds the visits to its state for the checkboxes
   */
  componentDidMount() {
    const visits = this.props.visits.reduce((carry, item) => {
      carry[item] = true;
      return carry;
    }, {});
    this.setState({visits});
  }

  /**
   * Add filter
   */
  handleClick() {
    const state = this.state.visits;
    const visits = Object.keys(state).filter((k) => state[k]);
    this.props.toggleSelected(
      this.props.category,
      this.props.data.name,
      visits
    );
  }

  /**
   * Render
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // const groupoperator = ['AND', 'OR'];
    // const valueoperator = ['=', '!=', '<=', '>=', 'starts with', 'contains', 'is null', 'is not null'];

    const operatorDropdown = (
        <select>
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
    );
    const visitsCheckboxes = Object.keys(this.state.visits).map((v) => {
      return (
        <CheckboxElement
          name={v}
          label={v}
          value={this.state.visits[v]}
          onUserInput={this.toggleVisitCheck}
        />
      );
    });

    return (
      <div>
        <h5 onClick={this.handleClick}>{this.props.data.name}</h5>
        <span>{this.props.data.description}</span>
        <span>{this.props.data.datatype}</span>
        {operatorDropdown}
        {visitsCheckboxes}
      </div>
    );
  }
}

Filter.PropTypes = {
  category: PropTypes.string.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    datatype: PropTypes.string.isRequired,
  }).isRequired,
  visits: PropTypes.array,
};

Filter.defaultProps = {
  visits: [],
};

export default Filter;

