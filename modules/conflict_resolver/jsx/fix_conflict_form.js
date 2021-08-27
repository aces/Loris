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
 * Known issue: When sorting the datatable, previously fixed conflicts are
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

    this.state = {
      value: null,
      success: false,
      error: false,
      emptyOption: true,
    };

    this.resolveConflict = this.resolveConflict.bind(this);
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
   * @param {string} name
   * @param {string} value
   */
  resolveConflict(name, value) {
    fetch(loris.BaseURL.concat('/conflict_resolver/unresolved'), {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({conflictid: name, correctanswer: value}),
    })
    .then((resp) => {
      return resp.ok ? {} : resp.json();
    })
    .then((json) => {
      if (json.error) {
        throw json.error;
      }
      this.setState({success: true, error: false, emptyOption: false, value});
    })
    .catch((error) => {
      swal('Error!', error, 'error');
      this.setState({error: true, success: false, emptyOption: true});
    });
  }

  /**
   * Renders select element that enables conflict resolution.
   *
   * @return {jsx}
   */
  render() {
    const {value, success, error, emptyOption} = this.state;
    const color = {
      backgroundColor: success ? '#d1ffcf' : '',
      transition: 'background-color 1s',
    };
    return (
      <td style={color}>
        <SelectElement
          name={this.props.conflictId}
          value={value}
          onUserInput={this.resolveConflict}
          options={this.props.options}
          emptyOption={emptyOption}
          hasError={error}
          errorMessage={''}
          noMargins={true}
        />
      </td>
    );
  }
}

FixConflictForm.propTypes = {
  conflictId: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
};

export default FixConflictForm;
