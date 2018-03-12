/* global ReactDOM */

var Role = React.createClass({
  handleCheck: function() {
    this.props.onChange(this.props.id);
  },
  handleMouseOver: function() {
    this.props.onMouseOver(this.props.id);
  },
  handleMouseOut: function() {
    this.props.onMouseOut();
  },
  render: function() {
    var textStyle = {};
    if (this.props.disabled) {
      textStyle = {
        color: '#ccc',
        cursor: 'not-allowed'
      };
    }
    return (
      <div
        className="checkbox role"
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}>
        <label style={textStyle}>
          <input
            name={"roleID[" + this.props.id + "]"}
            type="checkbox"
            value={this.props.id}
            id={this.props.id}
            checked={this.props.checked}
            onChange={this.handleCheck}
            disabled={this.props.disabled}
          />
          {this.props.name}
        </label>
      </div>
    );
  }
});

var RoleList = React.createClass({
  render: function() {
    var roleNodes = this.props.data.map(function(role) {
      return (
        <Role
          key={role.id}
          name={role.name}
          id={role.id}
          checked={role.checked}
          disabled={role.disabled}
          onChange={this.props.onChange}
          onMouseOver={this.props.onMouseOver}
          onMouseOut={this.props.onMouseOut} />
      );
    }, this);
    return (
      <div className="roleList">
        {roleNodes}
      </div>
    );
  }
});

var Permission = React.createClass({
  handleCheck: function(e) {
    this.props.onChange(this.props.id);
  },
  render: function() {
    var textStyle = {};
    if (this.props.disabled) {
      textStyle = {
        color: '#ccc',
        cursor: 'not-allowed'
      };
    }
    if (this.props.highlight) {
      textStyle = {
        color: '#3B99FC'
      };
    }
    return (
      <div className="checkbox permission">
        <label style={textStyle}>
          <input
            name={"permID[" + this.props.id + "]"}
            type="checkbox"
            value={this.props.id}
            checked={this.props.checked}
            onChange={this.handleCheck}
            disabled={this.props.disabled}
          />
          {this.props.name}
        </label>
      </div>
    );
  }
});

var PermissionList = React.createClass({
  render: function() {
    var half = Math.ceil(this.props.data.length / 2);
    var firstHalf = this.props.data.slice(0, half);
    var secondHalf = this.props.data.slice(half, this.props.data.length);
    var permissionNodesCol1 = firstHalf.map(function(permission) {
      return (
        <Permission
          key={permission.id}
          id={permission.id}
          name={permission.name}
          highlight={permission.highlight}
          checked={permission.checked}
          onChange={this.props.onChange}
          disabled={permission.disabled} />
      );
    }, this);
    var permissionNodesCol2 = secondHalf.map(function(permission) {
      return (
        <Permission
          key={permission.id}
          id={permission.id}
          name={permission.name}
          highlight={permission.highlight}
          checked={permission.checked}
          onChange={this.props.onChange}
          disabled={permission.disabled} />
      );
    }, this);
    return (
      <div className="row">
        <div className="col-md-6">
          {permissionNodesCol1}
        </div>
        <div className="col-md-6">
          {permissionNodesCol2}
        </div>
      </div>
    );
  }
});

var Access = React.createClass({
  getInitialState: function() {
    return {
      roles: [],
      permissions: [],
      rolesUsed: true
    };
  },
  loadDataFromServer: function() {
    $.ajax({
      url: this.props.dataURL,
      data: {identifier: this.props.identifier},
      dataType: 'json',
      cache: false,
      success: function(data) {
        if (data.roles.length) {
          this.setState({
            roles: data.roles,
            permissions: data.permissions
          });
        } else {
          this.setState({
            roles: data.roles,
            permissions: data.permissions,
            rolesUsed: false
          });
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.dataURL, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  getRoleIndex: function(roleID) {
    var roles = this.state.roles;
    var index = -1;
    for (var i = 0; i < roles.length; i++) {
      if (roles[i].id === roleID) {
        index = i;
        break;
      }
    }
    return index;
  },
  getPermissionIndex: function(permissionID) {
    var permissions = this.state.permissions;
    var index = -1;
    for (var i = 0; i < permissions.length; i++) {
      if (permissions[i].id === permissionID) {
        index = i;
        break;
      }
    }
    return index;
  },
  calculateRoles: function(roles, permissions) {
    var currentRoles = roles;
    var currentPermissions = permissions;

    for (var i = 0; i < currentRoles.length; i++) {
      var roleIndex = this.getRoleIndex(currentRoles[i].id);
      var checked = true;
      for (var j = 0; j < currentRoles[i].permissions.length; j++) {
        var permIndex = this.getPermissionIndex(currentRoles[i].permissions[j].permissionID);
        if (!currentPermissions[permIndex].checked) {
          checked = false;
          break;
        }
      }
      currentRoles[roleIndex].checked = checked;
    }

    return roles;
  },
  handleRoleChange: function(roleID) {
    // get role update
    var index = this.getRoleIndex(roleID);
    var roleUpdate = this.state.roles;
    var currentState = roleUpdate[index].checked;
    roleUpdate[index].checked = !currentState;

    // get permission update
    var permissionsToChange = this.state.roles[index].permissions;
    var permissionUpdate = this.state.permissions;

    for (var i = 0; i < permissionsToChange.length; i++) {
      var permissionIndex = this.getPermissionIndex(permissionsToChange[i].permissionID);
      if (currentState) {
        permissionUpdate[permissionIndex].checked = false;
      } else {
        permissionUpdate[permissionIndex].checked = true;
      }
    }

    // Update roles in case where additional roles were granted with the new permissions
    roleUpdate = this.calculateRoles(roleUpdate, permissionUpdate);

    this.setState({
      roles: roleUpdate,
      permissions: permissionUpdate
    });
  },
  handleRoleMouseOver: function(roleID) {
    var index = this.getRoleIndex(roleID);
    var permissionsToHighlight = this.state.roles[index].permissions;
    var permissionsUpdate = this.state.permissions;

    for (var i = 0; i < permissionsToHighlight.length; i++) {
      var permissionIndex = this.getPermissionIndex(permissionsToHighlight[i].permissionID);
      permissionsUpdate[permissionIndex].highlight = true;
    }

    this.setState({
      permissions: permissionsUpdate
    });
  },
  handleRoleMouseOut: function() {
    var permissionsUpdate = this.state.permissions;

    for (var i = 0; i < permissionsUpdate.length; i++) {
      permissionsUpdate[i].highlight = false;
    }

    this.setState({
      permissions: permissionsUpdate
    });
  },
  handlePermissionChange: function(permissionID) {
    // Set permission state
    var index = this.getPermissionIndex(permissionID);
    var permissionUpdate = this.state.permissions;
    var currentState = permissionUpdate[index].checked;
    permissionUpdate[index].checked = !currentState;

    // Update roles if needed
    if (this.state.rolesUsed) {
      var roleUpdate = this.calculateRoles(this.state.roles, permissionUpdate);
      this.setState({
        roles: roleUpdate,
        permissions: permissionUpdate
      });
    } else {
      this.setState({
        permissions: permissionUpdate
      });
    }
  },
  render: function() {
    if (this.state.rolesUsed) {
      return (
        <div className="Access">
          <label className="col-sm-2">Access</label>
          <div className="col-sm-2">
            <label>Roles</label>
            <RoleList
              data={this.state.roles}
              onChange={this.handleRoleChange}
              onMouseOver={this.handleRoleMouseOver}
              onMouseOut={this.handleRoleMouseOut} />
          </div>
          <div className="col-sm-8">
            <label>Permissions</label>
            <PermissionList
              data={this.state.permissions}
              onChange={this.handlePermissionChange} />
          </div>
        </div>
      );
    }
    return (
      <div className="Access">
        <label className="col-sm-2">Access</label>
        <div className="col-sm-10">
          <label>Permissions</label>
          <PermissionList
            data={this.state.permissions}
            onChange={this.handlePermissionChange} />
        </div>
      </div>
    );
  }
});

window.onload = function() {
  var userID = QueryString.get().identifier;
  if (typeof userID === 'undefined') {
    userID = '';
  }
  var access = <Access
    dataURL={`${loris.BaseURL}/user_accounts/ajax/getRolePermissionData.php`}
    identifier={userID}
  />;

  ReactDOM.render(access, document.getElementById("access"));
};