import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import swal from 'sweetalert2';
import Modal from 'Modal';
import {withTranslation} from 'react-i18next';
import {
  CheckboxElement,
  StaticElement,
  SearchableDropdown,
} from 'jsx/Form';

/**
 * Manage Permissions Form
 *
 * Module component rendering the manage permissions form modal window
 */
class ManagePermissionsForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      originalData: {},
      errorMessage: {},
      isLoaded: false,
      user: null,
      version: null,
    };

    this.setFormData = this.setFormData.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
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
      .then((data) => this.setState({data, originalData: data}))
      .catch( (error) => {
        this.setState({error:
          this.props.t('An error occurred when loading the form!',
            {ns: 'data_release'})});
        console.error(error);
      });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {data, error, isLoaded} = this.state;
    const {options, t} = this.props;

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
        title={t('Manage Permissions', {ns: 'data_release'})}
        label={t('Manage Permissions', {ns: 'data_release'})}
        show={this.props.show}
        onClose={this.props.onClose}
        onSubmit={this.handleSubmit}
      >
        <SearchableDropdown name="user"
          label={t('Manage Versions a User has access to',
            {ns: 'data_release'})}
          placeHolder={t('Search for a User', {ns: 'data_release'})}
          options={options.users}
          strictSearch={true}
          onUserInput={this.setFormData}
          value={this.state.user}
        />
        {this.state.user && <StaticElement
          label={t('Versions', {ns: 'data_release'})}
          text={Object.values(options.versions).map((version) =>
            <div>
              <CheckboxElement
                name={'versionsByUser'}
                label={version}
                value={data[this.state.user].versions.includes(version)}
                onUserInput={(formElement, checked) =>
                  this.setFormData(
                    'versionsByUser', {
                      userId: this.state.user, version, checked,
                    }
                  )
                }
              /><br/>
            </div>
          )}
        />
        }
        <SearchableDropdown
          name="version"
          label={t('Manage Users with access to a Version',
            {ns: 'data_release'})}
          placeHolder={t('Search for a Version', {ns: 'data_release'})}
          options={options.versions}
          strictSearch={true}
          onUserInput={this.setFormData}
          value={this.state.version}
        />
        {this.state.version &&
          <StaticElement
            label={t('Users', {ns: 'data_release'})}
            text={Object.values(this.state.originalData).map((user) => {
              if (user.versions.includes(this.state.version)) {
                return <div>
                  <CheckboxElement
                    name={'usersByVersion'}
                    label={user.name}
                    value={
                      data[user.id].versions.includes(this.state.version)
                    }
                    onUserInput={(_, checked) =>
                      this.setFormData(
                        'usersByVersion',
                        {
                          userId: user.id,
                          checked,
                          version: this.state.version,
                        }
                      )
                    }
                  /><br/>
                </div>;
              }
            }
            )}
          />
        }
      </Modal>
    );
  }

  /**
   * Store the value of the element in this.state.data
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    let {data} = JSON.parse(JSON.stringify(this.state));
    if (formElement === 'versionsByUser' || formElement === 'usersByVersion') {
      let {checked, version, userId} = value;
      if (checked) {
        data[userId].versions = [...data[userId].versions, version];
      } else {
        data[userId].versions = data[userId].versions
          .filter((e) => e !== version);
      }
      this.setState({data});
    } else {
      this.setState({[formElement]: (value === '' ? null : value)});
      if (formElement != 'user') this.setState({user: null});
      if (formElement != 'version') this.setState({version: null});
    }
  }

  /**
   * Handles submission of the form
   *
   * @return {Promise}
   */
  handleSubmit() {
    const {data} = JSON.parse(JSON.stringify(this.state));
    const {t} = this.props;

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
            text: t('Permission Update Success!',
              {ns: 'data_release'}),
            title: '',
            type: 'success',
          });
          return Promise.resolve().then(() => {
            window.location.reload();
          });
        } else {
          let msg = response.statusText ?
            response.statusText : t('Submission Error!',
              {ns: 'data_release'});
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
  options: PropTypes.object,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  fetchData: PropTypes.func,
  t: PropTypes.func.isRequired,
};

export default withTranslation(
  ['data_release', 'loris'])(ManagePermissionsForm);
