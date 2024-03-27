# Roles Manager

## Purpose

The roles manager module allows to assign permissions to users based on their
roles in a study. Roles are a pre-configured set of permissions automatically
assigned when the user is given a new role.


## Intended Users

Roles manager module is intended for managers/coordinators to attribute and/or
change the pre-defined roles to users in a study.


## Scope

The roles module is intended to view and manage roles and their selected set of
permissions. Depending on the following permission, users can create new roles
or modify existing roles. Managing roles also allows to alter role-permission association, e.g. to add a permission to set of users with the same role.


## Permissions

There are three main permissions for the roles module:

- `role_view`: grants the user access to view the module, roles and their
associated permissions.
- `role_edit`: grants the user access to edit roles and their associated
permissions.
- `role_assign`: grants the user access to assign or unassing a role to another
user. Not used in this module, see `user_accounts` module.


## Interactions with LORIS

> Will be available in a future release. This could change.

- Modifications performed on roles will trigger granting or revoking associated permissions.
- If users are affected to modified roles, these change will be applied to all these users.
- Modifications on users can be seen in `user_accounts` module.
- Assigning/unassigning users to role in `user_accounts` will change the number of counted users in the the main table for this module.