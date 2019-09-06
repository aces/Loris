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
    const icon = e.target.parentElement.getElementsByTagName('span')[0];

    icon.style.display = 'none';

    try {
      // Remove the empty option from the options to prevent sending an empty value.
      e.target.querySelector('option[name="0"]').remove();
    } catch (e) {
      // Do nothing, already removed
    }

    fetch(loris.BaseURL.concat('/conflict_resolver/unresolved'), {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({conflicid: conflictid, correctanswer: correctanswer}),
    })
    .then((resp) => {
      if (resp.status == 200) {
        icon.className = 'glyphicon glyphicon-ok-circle';
        icon.style.color = 'green';
      } else {
        resp.text().then((text) => {
          console.error(text);
        });
        icon.className = 'glyphicon glyphicon-remove-sign';
        icon.style.color = 'red';
      }
    })
    .catch((error) => {
      console.error(error);
      icon.className = 'glyphicon glyphicon-remove-sign';
      icon.style.color = 'red';
    })
    .finally(() => {
      setTimeout(() => {
        icon.style.display = 'inline';
      }, 200);
    });
   }

  render() {
    const options = [
      <option key='option0' name='0'></option>,
      <option key='option1' name='1'>{this.props.values[0].value}</option>,
      <option key='option2' name='2'>{this.props.values[1].value}</option>,
    ];
    return (
      <td>
        <form action={loris.BaseURL.concat('/conflict_resolver/fix_conflict')}>
            <span />
            <select style={{width: '85%', marginLeft: '10px'}} name={this.props.conflictid} onChange={this.fix}>
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
