/**
 * This file contains the React component for the fix conflict form
 * to be rendered in the cells of the conflict_resolver datatable.
 */
import {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * The fix FixConflictForm renders a <form> within a <td>. The form as a select
 * dropdown with the two possible answers as values; plus an empty value (default).
 * On change events triggers a POST request to /conflict_resolver/unresolved with
 * the conflict_id and the selected value as payload.
 *
 * It is possible to change the value multiple time, each time sending a new POST
 * request to the same endpoint. After the first request, the empty option of the
 * dropdown is removed to prevent the user from sending a POST request with an empty
 * value.
 *
 * Knowned issue: When sorting the datatable, previouly fixed conflicts are
 * considered unresolved; there is no green checkmark beside the dropdown anymore.
 */
class FixConflictForm extends Component {
  /**
   * Constructor
   *
   * @param {object} props - The provided properties.
   */
  constructor(props) {
    super(props);

    this.fix = this.fix.bind(this);
  }

  /**
   * Callback for the select dropdown onChange event.
   *
   * Sends a POST request to /conflict_resolver/unresolved containing the
   * conflict_id and the selected value name.
   *
   * If the request is successful, a green checkmark is displayed in a <span>
   * beside the dropdown. On error, a red cross will be displayed as well as a
   * sweetalert (swal) with the error message.
   *
   * @param {Event} e - The onChange event.
   */
  fix(e) {
    const conflictid = e.target.name;
    const correctanswer = e.target.value;

    const feedbackicon = e.target.parentElement.getElementsByTagName('span')[0];
    // Hide any previously displayed icon.
    feedbackicon.style.display = 'none';

    try {
      // Remove the empty option from the options to prevent sending an empty value.
      e.target.querySelector('option[name="0"]').remove();
    } catch (error) {
      // TypeError when already removed. Do nothing.
    }

    fetch(loris.BaseURL.concat('/conflict_resolver/unresolved'), {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({conflictid: conflictid, correctanswer: correctanswer}),
    })
    .then((resp) => {
      return resp.ok ? {} : resp.json();
    })
    .then((json) => {
        if (json.error) {
          throw json.error;
        }
        // Set feedback icon to green checkmark
        setTimeout(() => {
          feedbackicon.className = 'glyphicon glyphicon-ok-circle';
          feedbackicon.style.color = 'green';
          feedbackicon.style.display = 'inline';
        }, 200);
    })
    .catch((error) => {
      swal('Error!', error, 'error');
      // Set feedback icon to red cross
      setTimeout(() => {
        feedbackicon.className = 'glyphicon glyphicon-remove-sign';
        feedbackicon.style.color = 'red';
        feedbackicon.style.display = 'inline';
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
        <form>
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
