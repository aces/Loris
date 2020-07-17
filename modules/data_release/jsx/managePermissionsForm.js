import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import swal from 'sweetalert2';
import Modal from 'Modal';

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
      this.setState({error: 'An error occurred when loading the form!'});
      console.error(error);
    });
  }

  render() {
    const {data, error, isLoaded} = this.state;
    const {options} = this.props;


    // Data loading error
    if (error !== undefined) {
      return (
        <div className = 'alert alert-danger text-center'>
          <strong>{error}</strong>
        </div>
      );
    }

    // Waiting for data to load
    if (!isLoaded) {
      return <Loader/>;
    }

    return (
      <Modal
        title='Manage Permissions'
        label='Manage Permissions'
        show={this.props.show}
        onClose={this.props.onClose}
        onSubmit={this.handleSubmit}
      >
        <FormElement>
          {Object.entries(data).map(([userId, user]) =>
            <StaticElement
              label={user.name}
              text={Object.values(options.versions).map((version) =>
                <div>
                  <CheckboxElement
                    name={version}
                    label={version || 'Unversioned'}
                    value={user.versions.includes(version)}
                    onUserInput={(version, permission) =>
                      this.setFormData(userId, version, permission)
                    }
                  /><br/>
                </div>
              )}
            />
          )}
        </FormElement>
      </Modal>
    );
  }

  /**
   * Store the value of the element in this.state.data
   *
   * @param {string} userId
   * @param {string} version
   * @param {boulean} permission
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
   * @return {promise}
   */
  handleSubmit() {
    const {data} = JSON.parse(JSON.stringify(this.state));

    let formObj = new FormData();
    formObj.append('data', JSON.stringify(data));

    // fetch API to update the permission
    return fetch(this.props.action, {
      method: 'post',
      body: formObj,
      cache: 'no-cache',
    })
    .then((response) => {
      if (response.ok) {
        swal.fire({
          text: 'Permission Update Success!',
          title: '',
          type: 'success',
        });
        this.props.fetchData();
        return Promise.resolve();
      } else {
        let msg = response.statusText ?
          response.statusText : 'Submission Error!';
        swal.fire(msg, '', 'error');
        console.error(msg);
        return Promise.reject();
      }
    });
  }
}

ManagePermissionsForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};

export default ManagePermissionsForm;
