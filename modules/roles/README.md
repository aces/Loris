# Roles

## Ongoing module work

1. View
   1. Roles only.
   2. Role-permission association.
   3. Role assigned to users.
2. Edit
   1. Name/Label only.
   2. Role-permission association.
   3. Role assinged to users.
3. Modify

List of tasks:
- [x] Insert Role DB schema (base - no role-permission/user-role relations).
- [x] Print a basic window to see all roles.
- [ ] Create the `edit role` page, show each role information throught it.
- [ ] Add the role-permission and user-role relations in DB.
- [ ] Update the front-end (main table + edit role pages).
- [ ] Add a link into `user_account` module.
- [ ] Update the permission section in `user account`.


Other tasks:
- [ ] Widget
- [ ] Raisinbread
- [ ] Tests

## Purpose

The role module allows to assign permissions to users based on their roles in
a study. Roles are a pre-configured set of permissions automatically assigned
when the user is given a new role.


## Intended Users

Roles module is intended for managers/coordinators to attribute and/or change
the pre-defined roles to users in a study.


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

The roles module creates a foreign key relation between its primary `roles`
table and the `users` table (with a `role` attribute).