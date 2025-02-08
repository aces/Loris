# Issue Tracker

## Purpose
The Issues Module allows users to track issues they have with data, or with their LORIS instance itself. A form with pre-defined fields is provided for users to submit issues, upload attachments and a filter-form gives a sortable and filterable table view of issues viewable by the user.

## Permissions
- `issue_tracker_own_issue` permission allows seeing, editing, adding an issue, closing and commenting on issues created by the user.
- `issue_tracker_site_issue` permission allows to do the same except closing an issue, as well as editing any field of a submitted issue for the user site(s).
- `issue_tracker_all_issue` permission allows to do the same except closing an issue, as well as editing any field of a submitted issue for all site.
- `issue_tracker_close_site_issue` permission allows closing issue created by the user site(s)
- `issue_tracker_close_all_issue` permission allows closing issue for all sites
- Permissions are in accordance with the data permissions granted to that user - if a user can not see data outside of their site, they will only be able to view issues relevant to their site.
- If a user has DCC permission they will be able to see issues relevant to all sites.
- Most users of Loris should be designated as reporters.
- Users can also enable issue tracker notifications in `My Preferences` to 	be notified for all issues created or edited.

Most of the permissions are controlled in `IssueForm.js`, dependent on values returned in `editIssue.php`.

## Future Development
Future development includes the ability to edit one’s own comments after submission, a pop-up or sliding view within other modules for easy issue reporting, further integration with the dashboard and with statistics, refinement of the form UI, a tabular sortable view of comments, the ability to click watching within the filter-form table and the inclusion of default users to notify in the config settings.

## Interactions with LORIS

The issue tracker registers widgets on the `dashboard` and `candidate_profile` dashboard.
