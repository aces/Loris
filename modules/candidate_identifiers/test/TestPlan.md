# Candidate Identifiers Test Plan

1. Access the "Candidate Identifiers" page and ensure that it renders.
2. Verify that either `data_entry` or `access_all_profiles` permission is required to access the page.
3. Verify that users with only `data_entry` permission can view identifiers belonging to candidates at their assigned study sites.
4. Verify that users with `access_all_profiles` permission can view identifiers across study sites.
5. Test each table filter individually:
   [ ] Identifier Type
   [ ] Identifier Value
   [ ] Date Added
   [ ] Date Edited
6. Verify that the table columns can be sorted.
7. Click "Add Identifier" and verify that the form opens.
8. Add a valid identifier and verify that it appears in the table.
9. Edit an existing identifier and verify that the updated value is displayed.
10. Delete an identifier and verify that a confirmation dialog appears.
11. Confirm deletion and verify that the identifier is removed from the table.
12. Cancel deletion and verify that the identifier remains unchanged.
13. Verify that available identifier types match those configured in the Configuration module.
14. Verify that required and automatically generated identifier types are handled according to their configuration.
15. Verify that invalid identifier values are rejected with an appropriate error message.

## Widgets

1. Access a candidate in the `candidate_profile` module.

### Candidate Identifiers Widget

1. Verify that the "Candidate Identifiers" card appears for users
   with access to the module.
2. Verify that the identifier types and values displayed match
   those stored for the candidate.
3. Verify that identifiers are displayed in a read-only table.
4. Verify that "No identifiers found" is displayed when the
   candidate has no accessible identifiers.
5. Verify that identifiers requiring a specific permission are
   only displayed to users with that permission.
6. Verify that project-restricted identifiers are only displayed
   when the candidate's registration project matches an allowed
   project and the user has access to that project.
7. Verify that the widget labels and empty-state message are
   correctly translated when switching between English and French.