# Roles Manager

## Ongoing module work

List of tasks:
- [x] Insert Role DB schema (base - no role-permission/user-role relations).
- [x] Print a basic window to see all roles.
- [x] Create the `edit role` page, show each role information throught it.
- [x] Add the role-permission and user-role relations in DB.
- [x] Update the front-end (main table + edit role pages).
- [ ] Add role section in `user account`.

Other tasks:
- [ ] Widget?
- [ ] Documentation
- [ ] Raisinbread
- [ ] Tests

## Purpose

The roles manager module allows to assign permissions to users based on their
roles in a study. Roles are a pre-configured set of permissions automatically
assigned when the user is given a new role.


## Intended Users

Roles manager module is intended for managers/coordinators to attribute and/or
change the pre-defined roles to users in a study.


## Scope

The roles module is intended to view and manage roles and their selected set of
permissions. Depending on the following permission, users can create new roles,
modify or delete existing roles. Managing roles also allows to alter 
role-permission association, for instance to add a permission to set of users
with the same role. 


## Permissions

There are three main permissions for the roles module:

- `role_view`: grants the user access to view the module, roles and their 
associated permissions.
- `role_edit`: grants the user access to edit roles and their associated
permissions.
- `role_assign`: grants the user access to assign or unassing a role to another
user.


## Interactions with LORIS
 
TBD