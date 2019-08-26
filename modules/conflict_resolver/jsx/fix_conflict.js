import {Component} from 'react';
import PropTypes from 'prop-types';

class FixConflict extends Component {
  constructor(props) {
    super(props);

    this.fix = this.fix.bind(this);
  }

  fix(e) {
    const conflictid = e.target.name;
    const correctanswer = e.target.value;
    fetch(loris.BaseURL.concat('/conflict_resolver/fix_conflict'), {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({conflicid: conflictid, correctanswer: correctanswer}), // body data type must match "Content-Type" header
    })
    .then((resp) => resp.json()) // parses JSON response into native JavaScript objects
    .then((data) => console.log(data));
   }

  render() {
    const options = [
      <option ></option>,
      <option name='1'>{this.props.values[0].value}</option>,
      <option name='2'>{this.props.values[1].value}</option>,
    ];
    return (
      <td>
      <form action={loris.BaseURL.concat('/conflict_resolver/fix_conflict')}>
      <select name={this.props.conflictid} onChange={this.fix}>
        {options}
      </select>
      </form>
      </td>
    );
  }
}

FixConflict.propTypes = {
    conflictid: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape({
     name: PropTypes.string.isRequired,
     value: PropTypes.string.isRequired,
   })).isRequired,
};

export default FixConflict;
