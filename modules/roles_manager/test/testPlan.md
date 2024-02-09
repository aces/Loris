Roles Manager module - Test plan
===============================

### Access

1. Main page: the page should only load if a user has the `roles_edit` or `roles_view` permission.
2. Main page: users having `roles_view` should NOT see the "Edit" button at the end of each lines.
3. Edit modal: for any role, users having `roles_edit` should be able to interact with checkboxes in the edit modal.

### Interaction

1. Main page: Play with table filters to check they are working.
2. Main page: Click the `Clear Filters` button and verify it resets all filters.
3. Main page: Click the `New Role` button triggers a blank "Edit Role" modal. Click any `Edit` button in table triggers a modal with the data for each roles.
4. Edit page: clicking outside the modal should trigger the same behaviour as clicking the "close" (x) button.
5. Edit page: when clicking on the submit button:
   1. If no users are affected to this role (user count == 0), then a validation modal should pop.
   2. If users are affected to this role (user count > 0), then a confirmation modal should pop.
      1. Exiting this modal should make you fallback to the Edit page.
      2. Accepting change in this modal should validate the changes.
6. Applied changes to a role should be displayed immediatly in the table. Once created, a code should be unique and never change. Other parts: Name, Description, Permissions and Users count can change.

### Data Consistency

1. Ensure data displayed in the table and edit role page are correct:
   1. Main page: Check role-permission count in `role_permission_rel` table.
   2. Edit page: Check the permission list in `permissions` table.
   3. Main page: Check role description in `role` table.
   4. Main page: Check user-role count in `user_role_rel` table.
2. Ensure adding a new role with the same code as an existing one fails (code are created based on the given role name, with basic transformation applied: lowercase + trim + change space to underscores).