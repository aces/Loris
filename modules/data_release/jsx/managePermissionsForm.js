import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import DataTable from 'jsx/DataTable.js';
import swal from 'sweetalert2';

/**
 * Manage Permissions Form
 *
 * Module component rendering the manage permissions form modal window
 */
class ManagePermissionsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      formData: {},
      hasError: {},
      errorMessage: {},
      isLoaded: false,
      headers: ['Index', 'User Name', 'Data Release Version', 'Permissions'],
      hide: {
        downloadCSV: true,
        rowsPerPage: true,
      },
    };

    this.formatColumn = this.formatColumn.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {boolean}
   */
  fetchData() {
    let self = this;

    return $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        const formData = data.reduce((result, row) => {
          result[row[0]] = {};
          result[row[0]].index = row[0];
          result[row[0]].username = row[1];
          result[row[0]].version = row[2];
          result[row[0]].permission = row[3];
          return result;
        }, {});
        self.setState({
          data: data,
          formData: formData,
        });
      },
      error: function(data, errorCode, errorMsg) {
        self.setState({
          error: 'An error occurred when loading the form!',
        });
      },
    });
  }

  render() {
    // Data loading error
    if (this.state.error !== undefined) {
      return (
        <div className = 'alert alert-danger text-center'>
          <strong>
          {this.state.error}
          </strong>
        </div>
      );
    }

    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (<Loader/>);
    }

    const fields = [
      {label: 'Index', show: false},
      {label: 'User Name', show: true},
      {label: 'Data Release Version', show: true},
      {label: 'Permissions', show: false},
    ];

    return (
        <FormElement
          name='addPermission'
          onSubmit={this.handleSubmit}
        >
          <DataTable
            headers={this.state.headers}
            data={this.state.data}
            fields={fields}
            getFormattedCell={this.formatColumn}
            hide={this.state.hide}
          />
          <ButtonElement
            label="Submit"
          />
        < /FormElement>
    );
  }

  /**
   * Store the value of the element in this.state.formData
   *
   * @param {string} name - name of the form element
   * @param {string} value - value of the form element
   * @param {int} rowID - row number of the form element
   */
  setFormData(name, value, rowID) {
    let formData = this.state.formData;
    formData[rowID][name] = value;
    this.setState({
      formData: formData,
    });
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row row content indexed by column
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    let rowID = row.Index;

    if (column === 'Data Release Version') {
      // if admin, checkbox should not be editable
      const handleClick = (name, value) => this.setFormData(name, value, rowID);
      return (
          <td>
            <CheckboxElement
              name={'permission'}
              label={row['Data Release Version']}
              key={rowID}
              value={this.state.formData[rowID].permission}
              onUserInput={handleClick}
            />
          </td>
      );
    }

    return (<td>{cell}</td>);
  }

  /**
   * Handles submission of the form
   *
   */
  handleSubmit() {
    let myFormData = JSON.parse(JSON.stringify(this.state.formData));
    let formObj = new FormData();
    for (let key in myFormData) {
      if (myFormData[key] !== '') {
        formObj.append(key, JSON.stringify(myFormData[key]));
      }
    }

    // ajax call to update the permission
    $.ajax({
      type: 'POST',
      url: this.props.action,
      data: formObj,
      cache: false,
      contentType: false,
      processData: false,
      success: (data) => {
        swal('Permission Update Success!', '', 'success');
        this.props.fetchData();
      },
      error: function(err) {
        let msg = err.responseJSON ? err.responseJSON.message : 'Submission Error!';
        swal(msg, '', 'error');
        console.error(err);
      },
    });
  }
}

ManagePermissionsForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};

export default ManagePermissionsForm;
