import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ButtonElement} from 'jsx/Form';
import Modal from 'jsx/Modal';
import Collapsible from 'jsx/Collapsible';
import UserAccountRolesTable from './userAccountRolesTable';
import swal from 'sweetalert2';

/**
 * User Account Roles Form
 *
 * Module component rendering the "Role selection" modal.
 *
 * @author Regis Ongaro-Carcy
 */
class UserAccountRolesForm extends Component {
  /**
   * Constructor
   *
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      targetUser: '',
      allowedChanges: {}, // object of authorized role action (add/remove)
      roles: [], // array of roles from db
      originalRoles: [], // copy of 'roles', must not be modified
      error: false,
      isLoaded: false,
      isModalOpen: false,
      rolesToAdd: [], // array of roles to add to user
      rolesToRemove: [], // array of roles to remove from user
      roleCodesToAdd: [], // array of role codes to add to user
      roleCodesToRemove: [], // array of role codes to remove from user
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.toggleRoleAssignment = this.toggleRoleAssignment.bind(this);
    this.reset = this.reset.bind(this);
  }

  /**
   * Close the form
   */
  closeForm() {
    this.setState({
      error: false,
      isLoaded: false,
      isModalOpen: false,
    });
    return true;
  }

  handleSubmit() {
    // load changes from original roles
    const originalRoles = this.state.originalRoles;
    const updatedRoles = this.state.roles;

    // get the role taht changed assignation
    let getOriginalRole = (rCode) => {
      return originalRoles.find((r) => (r.Code === rCode));
    };
    const changedRoles = updatedRoles.filter((r) => {
      const ori = getOriginalRole(r.Code);
      if (ori == null) {
        // should not happen, but just in case.
        return false;
      }
      return (ori.hasRole !== r.hasRole);
    });

    // allowed changes
    const allowedChanges = this.state.allowedChanges;
    const rolesToAdd = [];
    const rolesToRemove = [];

    // from changed role: which to add/remove?
    changedRoles.forEach((role) => {
      // to be added: did not have it, but has it now with the change.
      if (role.hasRole) {
        // check if it is allowed
        if (allowedChanges[role.Code] === 'add') {
          rolesToAdd.push(role);
        }
      } else {
        // to be removed: had it but not present anymore.
        // check if it is allowed
        if (allowedChanges[role.Code] === 'remove') {
          rolesToRemove.push(role);
        }
      }
    });

    // assign
    this.state.rolesToAdd = rolesToAdd;
    this.state.rolesToRemove = rolesToRemove;
    this.state.roleCodesToAdd = rolesToAdd.map((r) => r.Code);
    this.state.roleCodesToRemove = rolesToRemove.map((r) => r.Code);

    // nothing to change, no warning
    if (rolesToAdd.length === 0 && rolesToRemove.length === 0) {
      return new Promise((resolve, reject) => resolve(true));
    }

    let message = 'You changed roles assigned to this user.<br/>';
    message += 'This will also modify associated <b>permissions</b>.<br/>';
    message += 'Please review it carefully!<br/><br/>';

    // format message for role to add/remove
    const addRemoveRoleMessage = function(roleArray, type) {
      let msg = '';
      const mType = (type === 'add') ? 'added' : 'removed';
      const mRole = roleArray.length === 1 ? 'Role' : 'Roles';
      msg += mRole + ' to be ' + mType + ': <b>';
      msg += roleArray.map((r) => r.Name).join(', ');
      msg += '</b><br/><br/>';
      return msg;
    };

    // add/remove, use function defined just before.
    if (rolesToAdd.length !== 0) {
      message += addRemoveRoleMessage(rolesToAdd, 'add');
    }
    if (rolesToRemove.length !== 0) {
      message += addRemoveRoleMessage(rolesToRemove, 'remove');
    }

    // if at least one change, warn user
    return swal.fire({
      title: 'Confirm Role Changes.',
      html: message,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Proceed',
      cancelButtonText: 'Go back',
    }).then((result) => {
      // user input
      if (result.value) {
        // proceed with the change
        return true;
      } else if (
        result.dismiss === 'cancel'
        || result.dismiss == 'backdrop'
      ) {
        // cancel or backdrop (clicked outside the confirmation modal)
        return false;
      } else {
        // another case? Prevent sending anything (acts as cancel)
        return false;
      }
    });
  }

  /**
   * A sink to get data from js outside this component.
   */
  dataSink() {
    return {
      roles: this.state.roles,
      rolesToAdd: this.state.roleCodesToAdd,
      rolesToRemove: this.state.roleCodesToRemove,
    };
  }

  /**
   * Component did mount lifecycle method.
   */
  componentDidMount() {
    // get roles data
    this.fetchData(this.props.userRoleEndpoint, 'POST', 'roles')
    // make a copy by value
    .then(() => {
      // deep value copy. Using JSON as a middleware to cut references between
      // 'roles' and 'originalRoles'.
      const newOriginal = JSON.parse(JSON.stringify(this.state.roles));
      this.state.originalRoles = newOriginal;
    })
    // fix authorized actions for each role
    .then(() => {
      const allowedChanges = {};
      this.state.originalRoles.forEach((role) => {
        // the only action possible on role will be to:
        //  - be removed for user havng that role.
        //  - be added for user not having that role.
        allowedChanges[role.Code] = (role.hasRole ? 'remove' : 'add');
      });
      this.state.allowedChanges = allowedChanges;
    })
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
      // body to include targeted user
      let body = JSON.stringify({
        'user': this.props.user,
        'target': this.props.targetUser,
      });
      // req options
      let opts = {
        credentials: 'same-origin',
        method: method,
        body: body,
      };
      // fetch
      return fetch(url, opts)
        .then((resp) => resp.json())
        // .then((data) => this.setState({[state]: data}, resolve))
        .then((data) => {
          console.log(data);
          this.setState({[state]: data}, resolve);
        })
        .catch((error) => {
          this.setState({error: true}, reject);
          console.error(error);
        });
    });
  }

  /**
   * Trigger the calling of fresh roles from server and reset roles.
   *
   * @param {event} e event that triggered this call.
   */
  reset(e) {
    e.preventDefault(); // loop into calls else.
    this.fetchData(this.props.userRoleEndpoint, 'POST', 'roles');
  }

  /**
   * Toggle the role assignment.
   *
   * @param {string} roleCode the role code.
   * @param {boolean} newValue does that user needs this role?
   */
  toggleRoleAssignment(roleCode, newValue) {
    // get roles
    const roles = this.state.roles;

    // find the right role to change assignment
    for (let i=0; i < roles.length; i++) {
      const role = roles[i];
      // when found
      if (role.Code === roleCode) {
        // update role with new value
        role['hasRole'] = newValue;
        break;
      }
    }
    // update state
    this.setState({roles});
  }

  /**
   * Render function
   *
   * @return {*}
   */
  render() {
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    const {hasPermission} = this.props;
    const {
      roles,
      originalRoles,
      rolesToAdd,
      rolesToRemove,
      isModalOpen,
    } = this.state;

    // did role changed?
    const hasRoleChanged = (
      rolesToAdd.length === 0 && rolesToRemove.length === 0
    );

    // style
    const proceedButtonStyle = {
      marginLeft: 'auto',
      marginRight: '20px',
    };
    const resetButtonStyle = {
      ...proceedButtonStyle,
      display: (hasPermission('roles_assign') ? 'inline-block' : 'none'),
    };
    const permissionActionsStyle = {
      marginTop: '20px',
      display: (hasRoleChanged ? 'none' : 'block'),
    };

    // functions
    const submit = () => this.handleSubmit().then((res) => {
      // only close form if handleSubmit returns true.
      if (res) {
        this.closeForm();
      }
    });

    // sub-component that prints out permission changes once the role
    // assignation has been changed.
    const permissionActions = () => {
      // all actions
      let actions = [];
      const actionsAdd = [];
      const actionsRemove = [];

      // raw complete list of remove actions
      if (rolesToRemove.length !== 0) {
        rolesToRemove.forEach((role) => {
          role.permissions.forEach((permission) => {
            if (permission.hasPermission) {
              actionsRemove.push({
                roleName: role.Name,
                permissionCode: permission.permissionCode,
                permissionName: permission.permissionName,
                actionType: 'remove',
                message: 'To be removed',
              });
            }
          });
        });
      }

      // raw complete list of add actions
      if (rolesToAdd.length !== 0) {
        rolesToAdd.forEach((role) => {
          role.permissions.forEach((permission) => {
            // if this role has this permission
            if (permission.hasPermission) {
              // check if user already has this permission by another role
              actionsAdd.push({
                roleName: role.Name,
                permissionCode: permission.permissionCode,
                permissionName: permission.permissionName,
                actionType: 'add',
                message: 'To be added',
              });
            }
          });
        });
      }

      // Which roles have that permissionCode from a list?
      const getRolesHavingPermission = (roleList, permissionCode) => {
        return roleList
        // user has role
        .filter((r) => r.hasRole)
        // filter out roles that do not have that permission
        .filter((r) => {
          return r.permissions.some(
            (p) => p.hasPermission && (p.permissionCode === permissionCode)
          );
        })
        // get role code
        .map((r) => r.Code);
      };

      // For a user to completely revoke that permission, ALL roles having that
      // permission should be removed from its list.
      const getOriginalRolesHavingPermission = (permissionCode) => {
        return getRolesHavingPermission(originalRoles, permissionCode);
      };

      // unique array elements.
      const uniq = (array) => [...new Set(array)];

      // revoke a permission => make sure the following is < 1
      //    the number of roles that had this permission originally
      //  + the number of 'add' actions for that permission
      //  - the number of 'remove' actions for that permission
      const mustRevoke = (pCode) => {
        // get the list of roles that have that permission
        const originals = getOriginalRolesHavingPermission(pCode);
        let t = originals;

        // add actions
        let addedRoles = uniq(actionsAdd
          .filter((a) => a.permissionCode === pCode)
          .map((a) => a.roleName));
        t = t.concat(addedRoles);

        // remove actions
        let removedRoles = uniq(actionsRemove
          .filter((a) => a.permissionCode === pCode)
          .map((a) => a.roleName));
        removedRoles.forEach((rCode) => {
          const i = t.indexOf(rCode);
          if (i > -1) {
            t.splice(i, 1);
          }
        });

        // data originally == data at the end
        // even if actions, they cancelled out each others.
        if (originals.length == t.length) {
          // do nothing
          return 0;
        } else {
          // revoke permission?
          if (t.length > 0) {
            // do not revoke
            return -1;
          } else {
            // revoke
            return 1;
          }
        }
      };

      // create the list of actions add/remove per permission
      let finalActions = {};
      actions = actionsAdd.concat(actionsRemove);
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const pCode = action.permissionCode;

        // no other actions registered
        if (finalActions[pCode] == null) {
          finalActions[pCode] = action;
          continue;
        }

        // another action is registered, does it have the same type?
        if (action.actionType === finalActions[pCode].actionType) {
          // yes => does not change, do not duplicate.
          continue;
        } else {
          // no => remove the previously registered one.
          finalActions[pCode] = null;
        }
      }

      // render actions
      return Object.values(finalActions)
        // filter out empty actions
        .filter((e) => (e != null))
        // filter out 'do nothing' and 'do not revoke' cases
        .filter((a) => (
          a.actionType === 'add' || mustRevoke(a.permissionCode) === 1
        ))
        // map render.
        .map((e, i) => {
          return (
            <tr key={'action-'+i}>
              <td>{e.permissionCode}</td>
              <td>{e.roleName}</td>
              <td>{e.message}</td>
            </tr>
          );
        });
    };

    // global render
    return (
      <div>
        <ButtonElement
          name='roles-modal-button'
          label='Modify Role Assignments'
          type='button'
          columnSize='col-sm-9'
          onUserInput={() => this.setState({isModalOpen: true})}
        />
        <Modal
          title='Role Assignments'
          show={isModalOpen}
          // assuming changes anyway if clicks outside the modal
          onClose={submit}
          width='800px'
        >
          <UserAccountRolesTable
            roles={roles}
            hasPermission={hasPermission}
            toggleRoleAssignment={this.toggleRoleAssignment}
          />
          <span style={proceedButtonStyle}>
            <ButtonElement
              name="proceed"
              label={(hasPermission('roles_assign') ? 'Proceed' : 'Close')}
              type="button"
              onUserInput={submit}
            />
          </span>
          <span style={resetButtonStyle}>
            <ButtonElement
              name="reset"
              label="Reset"
              type="button"
              onUserInput={(e) => this.reset(e)}
            />
          </span>
        </Modal>

        {/* permissions actions */}
        <div style={permissionActionsStyle}>
          <Collapsible
            title={
              'Roles attribution changed for this user. '
              + 'Click to see upcoming permission changes.'
            }
            open={false}
            colorInactive='#FBE4DD'
          >
            <div className='panel panel-default'>
              <table
                className='table table-hover table-primary table-bordered'
                id='permissionChangesTable'
              >
                <thead className="info">
                  <tr>
                    <th>Permission</th>
                    <th>Granted by Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionActions()}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </div>

        {/* end */}
      </div>
    );
  }
}

UserAccountRolesForm.propTypes = {
  userRoleEndpoint: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
  user: PropTypes.object,
  targetUser: PropTypes.string,
};

export default UserAccountRolesForm;


// forcing it in the specific DOM ID.
window.addEventListener('load', () => {
  createRoot(
    document.getElementById('role-modal-container')
  ).render(
    <UserAccountRolesForm
      userRoleEndpoint={`${loris.BaseURL}/user_accounts/userroleendpoint/`}
      hasPermission={loris.userHasPermission}
      user={loris.user}
      targetUser={window.location.href.split('/edit_user/')[1]}
      ref={(roleForm) => {
        window.roleForm = roleForm;
      }}
    />
  );

  // capture submit
  document
    .getElementById('edit_user_form')
    .addEventListener('submit', function(e) {
      // capture the submit event to add role elements
      // get data from React Component
      const dataSink = window.roleForm.dataSink();

      // attach React component values to hidden form fields
      let addElem = document.getElementById('roles_to_add');
      addElem.value = JSON.stringify(dataSink.rolesToAdd);
      let delElem = document.getElementById('roles_to_remove');
      delElem.value = JSON.stringify(dataSink.rolesToRemove);
      // resume sending
      return true;
    });
});
