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
                <input
                    name={"roleID[" + this.props.id + "]"}
                    type="checkbox"
                    value={this.props.id}
                    id={this.props.id}
                    checked={this.props.checked}
                    onChange={this.handleCheck}
                    disabled={this.props.disabled}
                />
                <label style={textStyle}>
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
                color: 'lightblue'
            };
        }
        return (
            <div className="checkbox permission">
                <input
                    name={"permID[" + this.props.id + "]"}
                    type="checkbox"
                    id={this.props.id}
                    checked={this.props.checked}
                    onChange={this.handleCheck}
                    disabled={this.props.disabled}
                />
                <label style={textStyle}>
                    {this.props.name}
                </label>
            </div>
        );
    }
});

var PermissionList = React.createClass({
    render: function() {
        var half = Math.ceil(this.props.data.length / 2);
        var firstHalf = this.props.data.slice(0,half);
        var secondHalf = this.props.data.slice(half, this.props.data.length);
        var permissionNodesCol1 = firstHalf.map(function(permission) {
            return (
                <Permission
                    key={permission.id}
                    name={permission.name}
                    id={permission.id}
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
                    name={permission.name}
                    id={permission.id}
                    highlight={permission.highlight}
                    checked={permission.checked}
                    onChange={this.props.onChange}
                    disabled={permission.disabled} />
            );
        }, this);
        return (
            <div className="permissionList">
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
                this.setState({
                    roles: data.roles,
                    permissions: data.permissions
                });
                if (!this.state.roles.length) {
                    this.setState({
                        rolesUsed: false
                    });
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.dataURL, status, err.toString());
            }.bind(this)
        })
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
            if (roles[i].id == roleID) {
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
            if (permissions[i].id == permissionID) {
                index = i;
                break;
            }
        }
        return index;
    },
    calculateRoles: function() {
        var roles = this.state.roles;
        var permissions = this.state.permissions;

        for (var i = 0; i < roles.length; i++) {
            var roleIndex = this.getRoleIndex(roles[i].id);
            var checked = true;
            for (var j = 0; j < roles[i].permissions.length; j++) {
                var permIndex = this.getPermissionIndex(roles[i].permissions[j].permissionID);
                if (!permissions[permIndex].checked) {
                    checked = false;
                    break;
                }
            }
            roles[roleIndex].checked = checked;
        }

        this.setState({
            roles: roles
        });
    },
    handleRoleChange: function(roleID) {
        //update role state
        var index = this.getRoleIndex(roleID);
        var roleUpdate = this.state.roles;
        var currentState = roleUpdate[index].checked;
        roleUpdate[index].checked = !currentState;

        this.setState({
            roles: roleUpdate
        });

        //update permission state
        var permissionsToChange = this.state.roles[index].permissions;
        var permissionsUpdate = this.state.permissions;

        for (var i = 0; i < permissionsToChange.length; i++) {
            var permissionIndex = this.getPermissionIndex(permissionsToChange[i].permissionID);
            if (currentState) {
                permissionsUpdate[permissionIndex].checked = false;
            } else {
                permissionsUpdate[permissionIndex].checked = true;
            }
        }

        this.setState({
            permissions: permissionsUpdate
        });

        //update role state
        this.calculateRoles();
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
        var permissionsUpdate = this.state.permissions;
        var currentState = permissionsUpdate[index].checked;
        permissionsUpdate[index].checked = !currentState;

        this.setState({
            permissions: permissionsUpdate
        });

        // Update roles if needed
        if (this.state.rolesUsed) {
            this.calculateRoles();
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
        } else {
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
    }
});

var RAccess = React.createFactory(Access);