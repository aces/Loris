import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import Modal from 'Modal';
import swal from 'sweetalert2';

import RolesManagerForm from './rolesManagerForm';

/**
 * Roles Manager
 *
 * Main module component rendering tab pane with Browse and Add tabs
 *
 * @author Regis Ongaro-Carcy
 */
class RolesManagerIndex extends Component {
  /**
   * Constructor
   *
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      roles: {},
      role: {},
      permissions: {},
      add: false,
      edit: false,
      error: false,
      errors: {},
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.postData = this.postData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.saveRole = this.saveRole.bind(this);
    this.setRole = this.setRole.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.validateRole = this.validateRole.bind(this);
  }

  /**
   * Component did mount lifecycle method.
   */
  componentDidMount() {
    // get roles data
    this.fetchData(this.props.roleEndpoint, 'GET', 'roles')
    // get permissions list
    .then(() => this.fetchData(
      this.props.permissionEndpoint,
      'GET',
      'permissions'
      )
    )
    // loaded state
    .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and store it in state
   *
   * @param {string} url
   * @param {string} method
   * @param {string} state
   * @return {object} promise
   */
  fetchData(url, method, state) {
    return new Promise((resolve, reject) => {
      return fetch(url, {credentials: 'same-origin', method: method})
      .then((resp) => resp.json())
      .then((data) => this.setState({[state]: data}, resolve))
      .catch((error) => {
        this.setState({error: true}, reject);
        console.error(error);
      });
    });
  }

  /**
   * Posts data from the provided URL to the server.
   *
   * @param {string} url
   * @param {object} data
   * @param {string} method
   * @return {object} promise
   */
  postData(url, data, method) {
    return new Promise((resolve, reject) => {
      const dataClone = JSON.parse(JSON.stringify(data));
      return fetch(url, {
        credentials: 'same-origin',
        method: method,
        body: JSON.stringify(dataClone),
      })
      .then((response) => response.text()
      .then((body) => {
        body = JSON.parse(body);
        if (response.ok) {
          swal.fire('Submission successful!', body.message, 'success')
          .then((result) => {
            if (result.value) {
              this.closeForm();
              resolve(body.message);
            }
          });
        } else {
          swal.fire(body.error, '', 'error');
          reject(body.error);
        }
      })
      .catch((e) => reject(e)));
    });
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    let result = <td>{cell}</td>;
    const roleCode = row['Code'];
    switch (column) {
      case 'Edit Role':
        const editButton = <CTA label='Edit' onUserInput={() => {
          this.loadRole(roleCode);
          this.setState({edit: true});
        }}/>;
        result = <td>{editButton}</td>;
        break;
    }

    return result;
  }

  /**
   * Set the form data based on state values of child elements/components
   *
   * @param {string} name - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setRole(name, value) {
    const role = this.state.role;
    // in case the value is a permission (nested object)
    let permissionPrefix = 'permission-';
    if (name.startsWith(permissionPrefix)) {
      // search the permission key in the list
      let pkey = Object.keys(role['permissions'])
        .find((k) => {
          let pCode = role['permissions'][k]['permissionCode'];
          let nCode = name.substring(permissionPrefix.length);
          return pCode === nCode;
        });

      // change permission flag
      role['permissions'][pkey]['hasPermission'] = value;
    } else {
      // change other values
      role[name] = value;
    }
    this.setState({role});
  }

  /**
   * Loads a role into the current state based on the roleCode
   *
   * @param {string} roleCode
   */
  loadRole(roleCode) {
    const role = JSON.parse(JSON.stringify(this.state.roles
      .find((role) => role.Code === roleCode)));
    this.setState({role});
  }

  /**
   * Close the form
   */
  closeForm() {
    this.setState({
      add: false,
      edit: false,
      role: {},
      errors: {},
    });
  }

  /**
   * Updates a previously existing Role with an updated Role.
   *
   * @param {object} role
   * @param {string} request
   * @return {object} promise
   */
  saveRole(role, request) {
    return new Promise((resolve, reject) => {
      Object.keys(role).forEach((key) => {
        if (role[key] == '') {
          role[key] = null;
        }
      });
      this.checkDuplicate(role)
      .then((role) => this.validateRole(role))
      .then((role) => this.postData(
          this.props.roleEndpoint+(role.Code || ''),
          role,
          request
      ))
      .then(() => this.fetchData(this.props.roleEndpoint, 'GET', 'roles'))
      .then(() => this.fetchData(
        this.props.permissionEndpoint, 'GET', 'permissions'
      ))
      .then(() => resolve())
      .catch((e) => reject(e));
    });
  }

  /**
   * Render Method
   *
   * @return {*}
   */
  render() {
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    /**
     * XXX: Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in roles_manager.class.inc
     */
    // const {options, role, roles, errors, add, edit} = this.state;
    const {role, roles, errors, add, edit} = this.state;
    const {hasPermission} = this.props;
    const fields = [
      {
        label: 'RoleID',
        show: false,
      },
      {
        label: 'Code',
        show: true,
        filter: {
          name: 'roleCode',
          type: 'text',
        },
      },
      {
        label: 'Name',
        show: true,
        filter: {
          name: 'roleName',
          type: 'text',
        },
      },
      {
        label: 'Description',
        show: true,
        filter: {
          name: 'roleDescription',
          type: 'text',
        },
      },
      {
        label: 'Permissions',
        show: true,
      },
      {
        label: 'Users',
        show: true,
      },
      {
        label: 'Edit Role',
        show: hasPermission('roles_edit'),
      },
    ];

    const actions = [
      {
        label: 'New Role',
        action: () => this.setState({add: true}),
        show: hasPermission('roles_edit'),
      },
    ];

    const rolesArray = roles.map((role) => {
      return [
        role.Roleid,
        role.Code,
        role.Name,
        role.Description,
        // count
        role.permissions.filter((p) => p.hasPermission).length,
        role.nbUsers,
      ];
    });

    // Add permissions in the case the Add button is used
    // no permissions are yet in the new role.
    if (role.permissions == null) {
      role.permissions = this.state.permissions;
    }

    const modalTitle = edit ? 'Edit Role' : 'Add New Role';
    const request = edit ? 'PUT' : 'POST';

    const handleSubmit = () => {
      // no user in this role or new role
      if (role.nbUsers == null || role.nbUsers == 0) {
        // no user in this role, can edit without warning.
        return this.saveRole(role, request);
      }

      // then, at least one user, warn user
      let msgUser = (role.nbUsers == 1 ) ? 'user' : 'users';
      return swal.fire({
        title: 'Confirm role modification.',
        html: 'Modifying a role will apply change to all involved users <br/>'
          + 'Changes will be applied to ' + role.nbUsers + ' '+ msgUser + '.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Go back',
      }).then((result) => {
        // user input
        if (result.value) {
          // proceed with the change
          return this.saveRole(role, request);
        } else if (
          result.dismiss === 'cancel'
          || result.dismiss == 'backdrop'
        ) {
          // cancel or backdrop (clicked outside the confirmation modal)
          return false;
        }
        // another case? Prevent sending anything (acts as cancel)
        return false;
      });
    };

    return (
      <div>
        <FilterableDataTable
          name='roles_manager'
          data={rolesArray}
          fields={fields}
          actions={actions}
          getFormattedCell={this.formatColumn}
        />
        <Modal
          title={modalTitle}
          show={add || edit}
          onClose={this.closeForm}
          // onSubmit={this.handleSubmit}
          throwWarning={Object.keys(role).length !== 0}
          width='800px'
        >
          <RolesManagerForm
            role={role}
            setRole={this.setRole}
            add={add}
            errors={errors}
            handleSubmit={handleSubmit}
            hasPermission={hasPermission}
          />
        </Modal>
      </div>
    );
  }

  /**
   * Checks whether the Role is a duplicate of an existing Role.
   *
   * @param {object} role
   * @return {object} promise
   */
  checkDuplicate(role) {
    return new Promise((resolve, reject) => {
      let duplicate;
      let nbDuplicate = 0;
      this.state.roles.forEach((roleCheck) => {
        if (role.Code == roleCheck.Code) {
          duplicate = roleCheck;
          nbDuplicate += 1;
        }
      });

      if (duplicate && nbDuplicate > 1) {
        swal.fire(
          'Role Duplicate',
          'You cannot duplicate a role',
          'error'
        );
        reject();
      } else {
        resolve(role);
      }
    });
  }


  /**
   * Checks that role fields are valide
   *
   * @param {object} role
   * @return {object} promise
   */
  validateRole(role) {
    return new Promise((resolve, reject) => {
      const errors = {};
      if (role.Name == null) {
        errors.Name = 'This field is required';
      }
      if (role.Description == null) {
        errors.Description = 'This field is required';
      }

      if (Object.entries(errors).length === 0) {
        this.setState({errors}, () => resolve(role));
      } else {
        this.setState({errors}, reject);
      }
    });
  }
}

RolesManagerIndex.propTypes = {
  roleEndpoint: PropTypes.string.isRequired,
  permissionEndpoint: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <RolesManagerIndex
      roleEndpoint={`${loris.BaseURL}/roles_manager/roleendpoint/`}
      permissionEndpoint={
        `${loris.BaseURL}/roles_manager/rolepermissionsendpoint`
      }
      hasPermission={loris.userHasPermission}
    />
  );
});
