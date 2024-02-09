import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CheckboxElement} from 'jsx/Form';
import Loader from 'Loader';
import Collapsible from 'jsx/Collapsible';


/**
 * User Account Roles Table
 *
 * Module component rendering the "Role selection" modal.
 *
 * @author Regis Ongaro-Carcy
 */
class UserAccountRolesTable extends Component {
  /**
   * Constructor
   *
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      isLoaded: false,
    };
  }

  /**
   * Close the form
   */
  closeForm() {
    this.setState({
      error: false,
      isLoaded: false,
    });
  }

  /**
   * Component did mount lifecycle method.
   */
  componentDidMount() {
    this.setState({isLoaded: true});
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

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader />;
    }

    const {roles, hasPermission, toggleRoleAssignment} = this.props;

    return (
      <div className='panel panel-default'>
        <table
          className='table table-hover table-primary table-bordered'
          id='roleTable'
        >
          <thead className="info">
            <tr>
              <th>Assigned</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {
              roles.filter(
                (r) => (hasPermission('roles_assign') ? true : r.hasRole)
              ).map(function(r, i) {
                let checkboxCellStyle = {
                  // vertical cell align middle
                  'display': 'table-cell',
                  'verticalAlign': 'middle',
                  // fixed width
                  'margin': '0',
                  'minWidth': '180px',
                  'maxWidth': '180px',
                  'width': '180px',
                };
                return (
                  <tr key={'tr-' + i}>
                    <td style={checkboxCellStyle}>
                      <CheckboxElement
                        key={'check-role-' + i}
                        name={r.Code}
                        label={(
                          hasPermission('roles_assign')
                          ? 'Click to toggle'
                          : 'Locked'
                        )}
                        onUserInput={toggleRoleAssignment}
                        required={false}
                        disabled={!hasPermission('roles_assign')}
                        value={((r.hasRole == null) ? false : r.hasRole)}
                        // errorMessage={errors.permissionCode}
                        // hasError={errors.permissionCode}
                        offset=''
                      />
                    </td>
                    <td>
                      <Collapsible
                        key={'collapsible-role-' + i}
                        title={r.Name}
                        open={false}
                      >
                        {
                          r.permissions.map(function(p) {
                            if (p.hasPermission) {
                              let divStyle = {
                                'paddingLeft': '10px',
                              };
                              return (
                                <div key={
                                  'role-' + i
                                  + '-p-' + p.permissionCode
                                  } style={divStyle}>
                                  {p.permissionCode}
                                </div>
                              );
                            }
                          })
                        }
                      </Collapsible>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

UserAccountRolesTable.propTypes = {
  roles: PropTypes.array.isRequired,
  hasPermission: PropTypes.func.isRequired,
  toggleRoleAssignment: PropTypes.func.isRequired,
};

export default UserAccountRolesTable;
