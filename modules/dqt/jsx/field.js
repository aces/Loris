import {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * DQT Field item React Component
 */
class Field extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
        visits: {},
    };

    this.handleClick = this.handleClick.bind(this);
    this.toggleVisitCheck = this.toggleVisitCheck.bind(this);
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
   * Toggle selection for this field
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
   * toggleVisitCheck
   *
   * @param {string} visit The field name
   * @param {bool} value The value
   */
  toggleVisitCheck(visit, value) {
    let selected = this.state.visits;
    selected[visit] = value;
    this.setState({
      visits: selected,
    });
  }

  /**
   * Render
   *
   * @return {JSX} - React markup for the component
   */
  render() {
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
      <div onClick={this.handleClick}>
        <h5>{this.props.data.name}</h5>
        <span>{this.props.data.description}</span>
        <span>{this.props.data.datatype}</span>
        {visitsCheckboxes}
      </div>
    );
  }
}

Field.PropTypes = {
  category: PropTypes.string.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    datatype: PropTypes.string.isRequired,
  }).isRequired,
  visits: PropTypes.array,
};

Field.defaultProps = {
  visits: [],
};

export default Field;
