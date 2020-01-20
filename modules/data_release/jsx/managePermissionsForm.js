import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import DataTable from 'jsx/DataTable.js';

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

    return fetch(this.props.DataURL, {credentials: 'same-origin'})
      .then( (resp) => resp.json())
      .then( function(data) {
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
      })
      .catch( (error) => {
        self.setState({
          error: 'An error occurred when loading the form!',
        });
        console.error(error);
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

    // fetch API to update the permission
    fetch(this.props.action, {
      method: 'post',
      body: formObj,
      cache: 'no-cache',
    }).then( (response) => {
      if (response.ok) {
        swal({
          text: 'Permission Update Success!',
          title: '',
          type: 'success',
        }, function() {
          window.location.assign('/data_release');
        });
        this.props.fetchData();
      } else {
        let msg = response.statusText ? response.statusText : 'Submission Error!';
        swal(msg, '', 'error');
        console.error(msg);
      }
    });
  }
}

ManagePermissionsForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};

export default ManagePermissionsForm;
