## Issue Tracker Readme

#### Overview
The Issues Module allows users to track issues they have with data, or with their LORIS instance itself. A form with pre-defined fields is provided for users to submit issues, and a filter-form gives a sortable and filterable table view of issues viewable by the user. 

#### Permissions
Permissions in this module are complex and are not yet in their final iteration. Two new permissions were created, issue_tracker_reporter and issue_tracker_developer. The view_all_sites permission was also integrated to prevent users from viewing issues relevant to data they do not have permission to see. A reporter can add an issue, edit their own issue, and comment on all issues. A developer can do the same, plus they can close an issue and edit all fields of a submitted issue. Most of the permissions are controlled in editIssue.js, dependant on values returned in editIssue.php.

#### Future Development
Future development includes the ability to edit one’s own comments after submission, a pop-up or sliding view within other modules for easy issue reporting, further integration with the dashboard and with statistics, refinement of the form UI, a tabular sortable view of comments, the ability to click watching within the filter-form table and the inclusion of default users to notify in the config settings.