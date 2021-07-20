# Dashboard Testplan
1. Log in. Note the time. Log out and log back in after 2 minutes. Check that welcome panel info is correct. [Automate Test on Travis_CI]
2. Check performance on the raisin bread dataset: make sure the dashboard page displays within 5 seconds or less. [Manual Test]  
3. Verify the links on the dashboard can navigate to the corresponding pages (eg. clicking the Access Profile tab on the navigation bar will navigate to the Candidate list page). [Automated Test]  

## Dashboard Widgets
1. Verify that the dashboard (with full permissions) includes the following widgets.
   * My Tasks
   * Recruitment
   * Study Progression

Note: Please see module test plans for other widgets, links and notifications that may appear in the Dashboard such as the Document Repository widget, and links under My Tasks e.g. Data entry conflicts, New and pending imaging sessions, Incomplete forms, Your assigned issues, Violated scans. 

2. Ensure that the recruitment widget displays the overall recruitment information by default and can switch to display site breakdown and project breakdown via drop-down list on the top right corner of the widget.

3. Ensure that the Study Progression widget displays the scans per site graph by default and can switch to display recruitment per site graph via drop-down list on the top right corner of the widget.
