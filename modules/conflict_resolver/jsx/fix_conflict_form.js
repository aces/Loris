import {Component} from 'react';
import PropTypes from 'prop-types';

class FixConflictForm extends Component {
  constructor(props) {
    super(props);

    this.fix = this.fix.bind(this);
  }

  fix(e) {
    const conflictid = e.target.name;
    const correctanswer = e.target.value;
    fetch(loris.BaseURL.concat('/conflict_resolver/unresolved'), {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({conflicid: conflictid, correctanswer: correctanswer}),
    })
    .then((resp) => {
      // TODO::Add feedback.
      console.info('value saved');
    })
    .catch((error) => {
      // TODO::Add feedback.
      console.error(error);
    });
   }

  render() {
    const options = [
      <option ></option>,
      <option key='option1' name='1'>{this.props.values[0].value}</option>,
      <option key='option2' name='2'>{this.props.values[1].value}</option>,
    ];
    return (
      <td>
        <form action={loris.BaseURL.concat('/conflict_resolver/fix_conflict')}>
          <select className='form-control input-sm' name={this.props.conflictid} onChange={this.fix}>
            {options}
          </select>
        </form>
      </td>
    );
  }
}

FixConflictForm.propTypes = {
    conflictid: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape({
     name: PropTypes.string.isRequired,
     value: PropTypes.string.isRequired,
   })).isRequired,
};

export default FixConflictForm;
