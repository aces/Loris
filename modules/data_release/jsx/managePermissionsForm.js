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
      hasError: {},
      errorMessage: {},
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
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
    return fetch(this.props.DataURL, {credentials: 'same-origin'})
    .then((resp) => resp.json())
    .then((data) => this.setState({data}))
    .catch( (error) => {
      this.setState({
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

    const {data} = this.state;
    const {options} = this.props;
    console.log(data);

    return (
      <FormElement
        name='addPermission'
        onSubmit={this.handleSubmit}
      >
        {Object.entries(data).map(([userId, user]) => 
          <StaticElement
            label={user.name}
            text={Object.values(options.versions).map((version) => 
              <div>
                <CheckboxElement
                  name={version}
                  label={version || 'Unversioned'}
                  value={user.versions.includes(version)}
                  onUserInput={(version, permission) => this.setFormData(userId, version, permission)}
                /><br/>
              </div>
            )}
          />
        )}
        <ButtonElement
          label="Submit"
        />
      </FormElement>
    );
  }

  /**
   * Store the value of the element in this.state.data
   *
   * @param {string} name - name of the form element
   * @param {string} value - value of the form element
   * @param {int} rowID - row number of the form element
   */
  setFormData(userId, version, permission) {
    let {data} = JSON.parse(JSON.stringify(this.state));
    if (permission) {
      data[userId].versions = [...data[userId].versions, version];
    } else {
      data[userId].versions = data[userId].versions
      .filter((e) => e !== version);
    }
    this.setState({data});
  }

  /**
   * Handles submission of the form
   *
   */
  handleSubmit() {
    const {data} = JSON.parse(JSON.stringify(this.state));

    let formObj = new FormData();
    formObj.append('data', JSON.stringify(data));

    // fetch API to update the permission
    fetch(this.props.action, {
      method: 'post',
      body: formObj,
      cache: 'no-cache',
    })
    .then((response) => {
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
