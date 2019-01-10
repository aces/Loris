1. Log in. Note the time. Log out and log back in after 2 minutes. Check that welcome panel info is correct.
   [Automate Test on Travis_CI]
2. Make sure there is no recruitment target set in the configuration module. Check that an incentive to define a
  recruitment target is displayed in recruitment panel.
   [Automate Test on Travis_CI]
3. Put a target number of participants in the configuration module and check that the info in the recruitment panel is correct.
   [Automate Test]
4. Switch to site breakdown and check that info in recruitment panel is correct.
   [Automate Test]
5. Create a candidate and assign it to any site. Inactivate it. Make sure it is NOT taken into account in the sex
   breakdown view (recruitment panel).
   [Automate Test]
6. Check that site breakdown view (recruitment panel) is correct.
   [Automate Test]
7. Check that scans per site (study progression panel) view is correct (scan dates and scan numbers).
   [Automate Test]
8. Check that recruitment per site view is correct (study progression panel).
   [Automate Test]
9. Verify that for a user with 'Edit imaging browser QC status' permission the My Tasks panel reports the number of new
   scans (i.e. the number of scans on the MRI browser page for which QC status has not been set). Check that site
   displayed is always 'All'. Click on this task and verify that you go to the MRI Browser page.
   [Automate Test on Travis_CI]
10. Verify that for a user with 'Resolving conflicts' permission the number of data entry conflicts is reported in the
    My Task panel. If the user also has 'Across all sites access candidates profiles' then the site displayed is
    'All', otherwise it is set to 'All user sites'. The number of data entry conflicts is the number of
    entries in the Unresolved tab of the Conflict Resolver page. Click on this task and check that you go to the
    Conflict Resolver page.
    [Automate Test on Travis_CI]
11. Check that for a user with 'Data Entry' permission, the number of incomplete forms (instruments with Data Entry
    set to 'In Progress') is displayed in the My Tasks panel. If the user also has 'Across all sites access candidates
    profiles' then the site displayed is 'All', otherwise it is set to 'All user sites' and only the
    candidates that belong to the user's site are considered for the computation of the number of incomplete forms.
    Clicking on this task should take you to the BVL statistics page, with the stats filtered according to the user's
    site (or without any filter if the user has 'Across all sites access candidates profiles' permission).
    [Automate Test on Travis_CI]
12. Verify that if a user has 'Across all sites create and edit user accounts' permission, the number of pending
    account approvals is displayed in the My Task panel. This should be the number of entries in the User Account
    page with the following Selection Filter: Site set to 'All' and Pending Approval set to 'Yes'. The Site displayed
    will always be 'All'.Check that you are taken to that page (with the Selection Filter correctly set) when you
    click on the task.
    [Automate Test on Travis_CI]
13. Verify that if a user has 'Across all sites access candidate profiles' permission, the reports works and even
    more important to check without this permission.
    [Automate Test]
14. Verify that if a user has 'issue_tracker_reporter / issue_tracker_developer' permission,
    the issue tracker panel should not be found without this permission.
    [Automate Test on Travis_CI]
15. Verify that if a user has 'User Management / Survey Participant Management' permission, the number of pending
    account approvals is displayed in the My Task panel. This should be the number of entries in the User Account
    page with the following Selection Filter: Site set to the user's site and Pending Approval set to 'Yes'. The
    Site displayed will be 'All user sites'. Check that you are taken to that page (with the Selection Filter
    correctly set) when you click on the task.
    [Automate Test on Travis_CI]
16. Verify that a user with 'Violated Scans: View all-sites Violated Scans' permission has a task with the number
    of violated scans displayed. This is the number of entries on the MRI Violated Scans page. The Site displayed will
    always be 'All'. Check that clicking on the task takes you to the Violated Scans page.
    [Automate Test on Travis_CI]
17. Verify that if a user has the 'View and upload files in Document Repository' or 'Delete files in Document Repository'
    permission, the latest documents to have been edited or uploaded in the document repository are displayed (4 at most)
    in the Document Repository panel. Clicking on a document will display it in the browser. Clicking on the Document
    Repository button takes you to the Document Repository page.
    [Automate Test]
18. Check that if a document notification occurred since the last login, it is labeled as 'New' in the Document
    Repository panel.
    [Automate Test]
19. Check that a 'New' notification is not labeled 'New' anymore after login in again.
    [Manual Test]
20. Check performance on a large dataset (like IBIS) to make sure the dashboard page displays within a reasonable
    amount of time.
    [Manual Test]
21. When there are no candidates registered (i.e. first time install), the system should display a message indicating
    that there are no candidates in the DB yet instead of showing the candidates chart.
    [Manual Test]
22. When there are no scans done, the system should display a message indicating that no scans were made instead of
    showing the scans chart.     
    [Manual Test]
