import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import AddPermissionForm from './addPermissionForm';
import swal from 'sweetalert2';
import {
  FormElement,
  SelectElement,
  ButtonElement,
} from 'jsx/Form';

/**
 * Manage File Form
 *
 * Module component rendering the manage file form modal window
 */
class ManageFileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      fieldOptions: {},
      managingFile: this.props.managingFile,
      hasError: {},
      errorMessage: {},
      isLoaded: false,
      loadedData: 0,
      specificReleaseId: null,
      selectedUserToRemove: null,
    };
    this.modifyFileStatus = this.modifyFileStatus.bind(this);
  }

  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {object}
   */
  fetchData() {
    return fetch(this.props.DataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) =>
        this.setState({
          data: data.Data,
          fieldOptions: data.fieldOptions,
          specificReleaseId: this.props.managingFile['dataReleaseID'],
        })
      )
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * A function that encompasses the 3 types of pop-up warnings.
   *
   * @param {string} type - type of pop-up warning
   */
  modifyFileStatus(type) {
    let text = {};
    if (type === 'hide') {
      text.warning
        = 'Only you, and system administrators will be able to see this file!';
      text.confirmation = 'hidden';
    } else if (type === 'unhide') {
      text.warning
        = 'Anyone with permission to this file will be able to see it.';
      text.confirmation = 'unhidden';
    } else if (type === 'delete') {
      text.warning = 'This will permanently delete the file from the system!';
      text.confirmation = 'deleted';
    }

    swal
      .fire({
        title: 'Are you sure?',
        text: text.warning,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Yes, ' + type + ' it!',
      })
      .then((result) => {
        if (result.value) {
          let myFormObj = new FormData();
          myFormObj.append('data_release_id', this.state.specificReleaseId);
          fetch(this.props.manageFileActions + '?action=' + type + 'File', {
            method: 'post',
            body: myFormObj,
          }).then((response) => {
            if (response.ok) {
              swal
                .fire({
                  text: 'File Successfully ' + text.confirmation,
                  title: '',
                  type: 'success',
                })
                .then(() => {
                  window.location.assign('/data_release');
                });
            } else {
              let msg = response.statusText
                ? response.statusText
                : 'Submission Error!';
              swal.fire(msg, '', 'error');
              console.error(msg);
            }
          });
        }
      });
  }

  componentDidMount() {
    this.fetchData().then(() => this.setState({isLoaded: true}));
  }

  /**
   * Render the form in the modal window
   *
   * @return {boolean}
   */
  render() {
    // Data loading error
    if (this.state.error !== undefined) {
      return (
        <div className='alert alert-danger text-center'>
          <strong>{this.state.error}</strong>
        </div>
      );
    }

    // Waiting for data to load
    if (!this.state.isLoaded) {
      return <Loader />;
    }

    return (
      <>
        {loris.userHasPermission('data_release_edit_file_access') && (
          <>
            <h3>Add Permission</h3>
            <AddPermissionForm
              DataURL={this.props.DataURL}
              action={this.props.managePermissionActions + '?action=add'}
              fetchData={this.props.fetchData}
              managingFile={this.state.managingFile}
              specificReleaseId={this.state.specificReleaseId}
              data={this.state.data}
              fieldOptions={this.state.fieldOptions}
            />
            <h3>Remove Permission</h3>
            <FormElement
              name='Remove Permission'
              onSubmit={() => {
                let myFormObj = new FormData();
                myFormObj.append('userid', this.state.selectedUserToRemove);
                myFormObj.append(
                  'data_release_id', this.state.specificReleaseId
                );
                // fetch API to update the permission
                fetch(this.props.managePermissionActions + '?action=remove', {
                  method: 'post',
                  body: myFormObj,
                }).then((response) => {
                  if (response.ok) {
                    swal
                      .fire({
                        text: 'Permission Update Success!',
                        title: '',
                        type: 'success',
                      })
                      .then(function() {
                        window.location.assign('/data_release');
                      });
                  } else {
                    let msg = response.statusText ?
                      response.statusText
                      : 'Submission Error!';
                    swal.fire(msg, '', 'error');
                    console.error(msg);
                  }
                });
              }}
            >
              <SelectElement
                name='userid'
                label='User'
                options={
                  this.state.fieldOptions.usersByFilePermissions[
                    this.state.specificReleaseI
                  ]
                }
                onUserInput={(value) => {
                  this.setState({
                    selectedUserToRemove: value,
                  });
                }}
                ref='userid'
                hasError={this.state.hasError.selectedUserToRemove}
                errorMessage={this.state.errorMessage.selectedUserToRemove}
                required={true}
                value={this.state.selectedUserToRemove}
                sortByValue={true}
              />
              <ButtonElement label='Remove Permission' />
            </FormElement>
          </>
        )}
        {loris.userHasPermission('data_release_hide') && (
          <>
            <h3>Modify Hidden File Status</h3>
            {this.state.managingFile.hiddenById ? (
              <div
                style={{
                  flexDirection: 'row',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <p>
                  This file was hidden by
                  {this.state.fieldOptions.users[
                    this.state.managingFile.hiddenById
                  ]}.
                </p>
                <ButtonElement
                  label='Unhide Release File'
                  onUserInput={() => {
                    this.modifyFileStatus('unhide');
                  }}
                />
              </div>
            ) : (
              <ButtonElement
                label='Hide Release File'
                onUserInput={() => {
                  this.modifyFileStatus('hide');
                }}
              />
            )}
          </>
        )}
        {loris.userHasPermission('data_release_delete') && (
          <>
            <h3>Delete File</h3>
            <ButtonElement
              label='Delete Release File'
              onUserInput={() => {
                this.modifyFileStatus('delete');
              }}
            />
          </>
        )}
      </>
    );
  }
}

ManageFileForm.propTypes = {
  DataURL: PropTypes.string.isRequired,
  managePermissionActions: PropTypes.string.isRequired,
  manageFileActions: PropTypes.string.isRequired,
  managingFile: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
};

export default ManageFileForm;
