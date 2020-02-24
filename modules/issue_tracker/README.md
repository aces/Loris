# Issue Tracker

## Purpose
The Issues Module allows users to track issues they have with data, or with their LORIS instance itself. A form with pre-defined fields is provided for users to submit issues, upload attachments and a filter-form gives a sortable and filterable table view of issues viewable by the user.

## Permissions
- `issue_tracker_reporter` permission allows adding an issue, editing issues created by the user, download issue attachments and commenting on all issues for the site.
- `issue_tracker_developer` permission allows to do the same, as well as closing an issue or editing any field of a submitted issue for the site.
- Permissions are in accordance with the data permissions granted to that user - if a user can not see data outside of their site, they will only be able to view issues relevant to their site.
- If a user has DCC permission they will be able to see issues relevant to all sites.
- Additionally, users can be designated reporters or developers.
- Reporters can add issues, edit their own issues, and comment on all issues.
- Developers can additionally edit all issues, and mark them as resolved.
- Most users of Loris should be designated as reporters.

Most of the permissions are controlled in `IssueForm.js`, dependent on values returned in `editIssue.php`.

## Future Development
Future development includes the ability to edit one’s own comments after submission, a pop-up or sliding view within other modules for easy issue reporting, further integration with the dashboard and with statistics, refinement of the form UI, a tabular sortable view of comments, the ability to click watching within the filter-form table and the inclusion of default users to notify in the config settings.
