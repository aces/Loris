# Issue Tracker Test Plan

## Issue Tracker Filter Form [Automation Testing]
1. User can access the page only if they have `Issue Tracker: Close/Edit/Re-assign/Comment on All Issues` or ` Issue Tracker: Create/Edit Own Issues and Comment on All Issues` permission
2. User can see data from other sites only if they have `access_all_profiles` permission
3. Test that all filters work. Nothing should be filtered at first loading.
4. Test that all preset filters work and redirect to the correct table. 
5. Test that the watching checkbox works correctly (issues that your userID is watching in issues_watching table)
6. Check that links to issues in table are correct.
7. Check that table sorts and displays additional pages correctly 
8. Check that a user who does not have `access_all_profiles` permission and belongs to only one site can see all issues with a NULL centerID. Check that they have the label `All Sites` in the Site column. 

## Issue Tracker Create New Issue [Manual Testing]
1. User can access the page if they have `Issue Tracker: Close/Edit/Re-assign/Comment on All Issues` or `Issue Tracker: Create/Edit Own Issues and Comment on All Issues` permission.
2. Check that title, assignee and site are required.
3. Do not provide a PSCID value and set site to All Sites. This should set Site to NULL after success.
4. Do not provide a PSCID value and and check that site can be populated by a particular site (except All Sites) in the dropdown values.
5. Submit a PSCID and set Site to All Sites. This should work if the PSCID exists in the database.
6. Submit a PSCID with a Site value (except All Sites). This should not work if the PSCID does not exists or if the PSCID does not match with the site.
7. Should display message, and redirect after success. 
8. Submit invalid and valid PSCID and visit label pairs. Error messages should display accordingly. 
9. A user should be able to submit a PSCID from other sites only if they have `access_all_profiles` permission. 
10. Submit just a visit label - this should give an error message.
11. Check that all values are propagated and saved correctly.
12. Add an attachment to the new issue and make sure that it is successfully uploaded.
13. Check that watching options are working - turn it off and on for your current user, and for other watchers on the issue, and check that values are saved.

## Issue Tracker Edit Existing Issue [Manual Testing]
1. User can access the page if they fulfill all the following conditions:
	* they have `Issue Tracker: Close/Edit/Re-assign/Comment on All Issues` or ` Issue Tracker: Create/Edit Own Issues and Comment on All Issues` permission 
	* they have `access_all_profiles` or are a member of the site of the issue or the site has no issue.
2. Users who have `Issue Tracker: Create/Edit Own Issues and Comment on All Issues` permission can edit all fields if it is their issue, but are blocked except for commenting and watching options for all other issues. Users with `Issue Tracker: Close/Edit/Re-assign/Comment on All Issues` permission can make all changes on all issues that they can view. 
3. Users can only enter a PSCID for those candidate that are in their site.
4. Submit invalid and valid PSCID and visit label pairs. Error messages should respond accordingly. Not that you cannot submit PSCIDs from other sites unless you have `access_all_profiles` permission
5. Submit just a visit label - this should give an error message.
6. Check that all values are propagated and saved correctly.
7. Check that watching options are working - turn it off and on for your current user, and for other watchers on the issue, and check that values are saved.
8. Add an attachment to the new issue and make sure that it is successfully uploaded.
9. Check that an attachment can be added to an existing issue.
10. Test if users assigned to issues can upload attachments.
11. Test if users can delete their own uploaded attachments.
12. Test if user assigned to issue cannot delete attachments of issue owner.
13. Test that emails are sent to users that are watching the issue.

## Permissions [Automation Testing]
1. Remove `access_all_profiles` permission.
2. Remove `Issue Tracker: Create/Edit Own Issues and Comment on All Issues` permission
3. Remove `Issue Tracker: Close/Edit/Re-assign/Comment on All Issues` permission
4. Test that the module behaves correctly as described above. 

**Test the Issue Tracker Dashboard widget**
1. The dashboard widget named My Tasks, should display the correct number of assigned issues.
2. Check if the number changes when a new issue has been assigned to you or removed.
3. Verify clicking on Your assigned issues, will redirect you to the issue tracker module and where all issues contain you as the assignee.

**Test the Issue Tracker Candidate Dashboard widget**
1. Find an issue with a PSCID assigned to it.
2. Visit the Candidate Dashboard for the foregoing candidate.
3. View the Open Issues widget and verify all issues of the candidate exist in the widget.
4. The number of comments an issue has should be displayed correctly in the widget.
5. The links should redirect the user to the correct issue.
6. Create or assign an issue to a PSCID and see if the foregoing works correctly for the new issue.
