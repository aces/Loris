'use strict';

var Role = React.createClass({
    displayName: 'Role',

    handleCheck: function handleCheck() {
        this.props.onChange(this.props.id);
    },
    handleMouseOver: function handleMouseOver() {
        this.props.onMouseOver(this.props.id);
    },
    handleMouseOut: function handleMouseOut() {
        this.props.onMouseOut();
    },
    render: function render() {
        var textStyle = {};
        if (this.props.disabled) {
            textStyle = {
                color: '#ccc',
                cursor: 'not-allowed'
            };
        }
        return React.createElement(
            'div',
            {
                className: 'checkbox role',
                onMouseOver: this.handleMouseOver,
                onMouseOut: this.handleMouseOut },
            React.createElement('input', {
                name: "roleID[" + this.props.id + "]",
                type: 'checkbox',
                value: this.props.id,
                id: this.props.id,
                checked: this.props.checked,
                onChange: this.handleCheck,
                disabled: this.props.disabled
            }),
            React.createElement(
                'label',
                { style: textStyle },
                this.props.name
            )
        );
    }
});

var RoleList = React.createClass({
    displayName: 'RoleList',

    render: function render() {
        var roleNodes = this.props.data.map(function (role) {
            return React.createElement(Role, {
                key: role.id,
                name: role.name,
                id: role.id,
                checked: role.checked,
                disabled: role.disabled,
                onChange: this.props.onChange,
                onMouseOver: this.props.onMouseOver,
                onMouseOut: this.props.onMouseOut });
        }, this);
        return React.createElement(
            'div',
            { className: 'roleList' },
            roleNodes
        );
    }
});

var Permission = React.createClass({
    displayName: 'Permission',

    handleCheck: function handleCheck(e) {
        this.props.onChange(this.props.id);
    },
    render: function render() {
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
        return React.createElement(
            'div',
            { className: 'checkbox permission' },
            React.createElement('input', {
                name: "permID[" + this.props.id + "]",
                type: 'checkbox',
                id: this.props.id,
                checked: this.props.checked,
                onChange: this.handleCheck,
                disabled: this.props.disabled
            }),
            React.createElement(
                'label',
                { style: textStyle },
                this.props.name
            )
        );
    }
});

var PermissionList = React.createClass({
    displayName: 'PermissionList',

    render: function render() {
        var half = Math.ceil(this.props.data.length / 2);
        var firstHalf = this.props.data.slice(0, half);
        var secondHalf = this.props.data.slice(half, this.props.data.length);
        var permissionNodesCol1 = firstHalf.map(function (permission) {
            return React.createElement(Permission, {
                key: permission.id,
                name: permission.name,
                id: permission.id,
                highlight: permission.highlight,
                checked: permission.checked,
                onChange: this.props.onChange,
                disabled: permission.disabled });
        }, this);
        var permissionNodesCol2 = secondHalf.map(function (permission) {
            return React.createElement(Permission, {
                key: permission.id,
                name: permission.name,
                id: permission.id,
                highlight: permission.highlight,
                checked: permission.checked,
                onChange: this.props.onChange,
                disabled: permission.disabled });
        }, this);
        return React.createElement(
            'div',
            { className: 'permissionList' },
            React.createElement(
                'div',
                { className: 'col-md-6' },
                permissionNodesCol1
            ),
            React.createElement(
                'div',
                { className: 'col-md-6' },
                permissionNodesCol2
            )
        );
    }
});

var Access = React.createClass({
    displayName: 'Access',

    getInitialState: function getInitialState() {
        return {
            roles: [],
            permissions: [],
            rolesUsed: true
        };
    },
    loadDataFromServer: function loadDataFromServer() {
        $.ajax({
            url: this.props.dataURL,
            data: { identifier: this.props.identifier },
            dataType: 'json',
            cache: false,
            success: function (data) {
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
            error: function (xhr, status, err) {
                console.error(this.props.dataURL, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function componentDidMount() {
        this.loadDataFromServer();
    },
    componentWillUnmount: function componentWillUnmount() {
        this.serverRequest.abort();
    },
    getRoleIndex: function getRoleIndex(roleID) {
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
    getPermissionIndex: function getPermissionIndex(permissionID) {
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
    calculateRoles: function calculateRoles() {
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
    handleRoleChange: function handleRoleChange(roleID) {
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
    handleRoleMouseOver: function handleRoleMouseOver(roleID) {
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
    handleRoleMouseOut: function handleRoleMouseOut() {
        var permissionsUpdate = this.state.permissions;

        for (var i = 0; i < permissionsUpdate.length; i++) {
            permissionsUpdate[i].highlight = false;
        }

        this.setState({
            permissions: permissionsUpdate
        });
    },
    handlePermissionChange: function handlePermissionChange(permissionID) {
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
    render: function render() {
        if (this.state.rolesUsed) {
            return React.createElement(
                'div',
                { className: 'Access' },
                React.createElement(
                    'label',
                    { className: 'col-sm-2' },
                    'Access'
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-2' },
                    React.createElement(
                        'label',
                        null,
                        'Roles'
                    ),
                    React.createElement(RoleList, {
                        data: this.state.roles,
                        onChange: this.handleRoleChange,
                        onMouseOver: this.handleRoleMouseOver,
                        onMouseOut: this.handleRoleMouseOut })
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-8' },
                    React.createElement(
                        'label',
                        null,
                        'Permissions'
                    ),
                    React.createElement(PermissionList, {
                        data: this.state.permissions,
                        onChange: this.handlePermissionChange })
                )
            );
        } else {
            return React.createElement(
                'div',
                { className: 'Access' },
                React.createElement(
                    'label',
                    { className: 'col-sm-2' },
                    'Access'
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-10' },
                    React.createElement(
                        'label',
                        null,
                        'Permissions'
                    ),
                    React.createElement(PermissionList, {
                        data: this.state.permissions,
                        onChange: this.handlePermissionChange })
                )
            );
        }
    }
});

var RAccess = React.createFactory(Access);