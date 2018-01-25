# Issue Tracker 

## Purpose 

The Issue Tracker allows users to log and track data issues, software bugs, or questions encountered in LORIS.  Users with appropriate permissions can (re-)assign and resolve open issues. 

## Intended Users

The four primary types of users are:
1. Any front-end user working with the database who may wish to report software bugs
2. Imaging specialists logging general concerns with imaging datasets while performing online QC
3. Study coordinators reviewing and resolving data issues, and communicating software issues or requesting feature changes to the development team 
4. Administrator / development team users working to resolve issues in the technical back-end of LORIS.

## Scope

The Issue Tracker displays logged issues in a sortable and filterable table view of issues.   
A form with pre-defined fields is provided for users to submit and edit issues. 
Issues may be associated to a specific PSCID and visit.
The history of changes to an issue is accessible for each issue.
Users with appropriate permissions may assign, re-assign and mark issues as 'resolved'.              
Individual users can "watch" tickets and receive notifications when these are updated.

NOT in scope:

The Issue Tracker does not link to individual data points, instrument forms or imaging scans (although links can be added in the comment field).
The Issue Tracker does not allow users to edit comments after submission.  Comments are not searchable / sortable across issues.  The Filter form table does not provide for one-click “watching” opt-in or opt-out.  There is no configuration for this module for specifying default users to be notified for issues on certain categories or sites. 
It is not available as a pop-up or sliding panel from within other modules which would facilitate easier issue reporting.  Issues are not integrated into the Dashboard or Statistics modules. 

## Permissions

The Issue Tracker uses the following permissions.
access_all_profiles
    - This permission allows the user to view issues from sites other than those associated to their user account. 
issue_tracker_reporter 
    - This permission allows the user to add an issue, edit their own issue, and comment on all issues
issue_tracker_developer
    - This permission allows the user to add issues, edit all fields of all issues, close issues. 
Any one of these issue_tracker_* permissions is sufficient to have access to the module.
Most of the permissions are controlled in IssueForm.js, dependant on values returned in editIssue.php.

## Configuration

The Issue Tracker has the following configuration settings that affect its usage: 

useProjects - This setting determines whether "project" filtering dropdowns exist on the menu page. 

mantis_url - This setting defines a URL for LORIS to include a link to for bug reporting on the viewsession page.  Projects using the Issue Tracker should set this to  “issue_tracker/” or “$url/issue_tracker/” 

## Interactions with LORIS

* Depending on how the Issue Tracker is used by a given project, there can be overlap in functionality with other Loris tools used for data review such as the Behavioural Feedback module and external bug trackers used for Imaging data concerns. Projects are advised to define for all members the appropriate use of each tool.  

* Setting the configuration setting mantis_url to “issue_tracker/” or “$url/issue_tracker/” will add a link in the Imaging Browser’s View Session page to this module for imaging data review purposes.

