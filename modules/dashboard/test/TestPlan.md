1. Log in. Note the time. Log out and log back in after 2 minutes. Check that welcome panel info is correct.
   [Automate Test on Travis_CI]
2. Verify that for a user with 'Edit imaging browser QC status' permission the My Tasks panel reports the number of new
   scans (i.e. the number of scans on the MRI browser page for which QC status has not been set. Note DCC scans are not
   counted in the query as for most projects this is not an acquisition site). Check that site
   displayed is always 'All'. Click on this task and verify that you go to the MRI Browser page.
   [Automate Test on Travis_CI]
3. Verify that for a user with 'Resolving conflicts' permission the number of data entry conflicts is reported in the
   My Task panel. If the user also has 'Across all sites access candidates profiles' then the site displayed is
   'All', otherwise it is set to 'All user sites'. The number of data entry conflicts is the number of
   entries in the Unresolved tab of the Conflict Resolver page for candidates that do not belong to the DCC site. 
   Click on this task and check that you go to the Conflict Resolver page.
   [Automate Test on Travis_CI]
4. Check that for a user with 'Data Entry' permission, the number of incomplete forms (instruments with Data Entry
   set to 'In Progress') is displayed in the My Tasks panel. If the user also has 'Across all sites access candidates
   profiles' then the site displayed is 'All', otherwise it is set to 'All user sites' and only the
   candidates that belong to the user's site are considered for the computation of the number of incomplete forms.
   Clicking on this task should take you to the BVL statistics page, with the stats filtered according to the user's
   site (or without any filter if the user has 'Across all sites access candidates profiles' permission).
   [Automate Test on Travis_CI]
5. Verify that if a user has 'Across all sites create and edit users' and 'User management' permissions, the number of pending
   account approvals is displayed in the My Task panel. This should be the number of entries in the User Account
   page with the following Selection Filter: Site not set and Pending Approval set to 'Yes'. 
   Check that you are taken to that page (with the Selection Filter correctly set) when you
   click on the task.
   [Automate Test]
6. Verify that the issue tracker panel is accessible if and only if a user has the 'issue_tracker_reporter'
   or the 'issue_tracker_developer' permission.
   [Automate Test on Travis_CI]
7. Verify that if a user has 'User Management / Survey Participant Management' permission, the number of pending
   account approvals is displayed in the My Task panel. This should be the number of entries in the User Account
   page with the following Selection Filter: Site set to the user's site and Pending Approval set to 'Yes'. The
   Site displayed will be 'All user sites'. Check that you are taken to that page (with the Selection Filter
   correctly set) when you click on the task.
   [Automate Test on Travis_CI]
8. Verify that a user with 'Violated Scans: View all-sites Violated Scans' permission has a task with the number
   of violated scans displayed. This is the number of entries on the MRI Violated Scans page. The Site displayed will
   always be 'All'. Check that clicking on the task takes you to the Violated Scans page.
   [Automate Test on Travis_CI]
9. Verify that if a user has the 'View and upload files in Document Repository' or 'Delete files in Document Repository'
10. Check that if a document notification occurred since the last login, it is labeled as 'New' in the Document
    Repository panel.
    [Automate Test]
11. Check that a 'New' notification is not labeled 'New' anymore after login in again.
    [Manual Test]
12. Check performance on the raisin bread dataset: make sure the dashboard page displays within 5 seconds or less.
    [Manual Test]
13. When there are no candidates registered (i.e. first time install), the system should display a message indicating
    that there are no candidates in the DB yet instead of showing the candidates chart.
    [Manual Test]
14. When there are no scans done, the system should display a message indicating that no scans were made instead of
    showing the scans chart.     
    [Manual Test]
