# Issue Tracker Test Plan

## Issue Tracker Filter Form [Automation Testing]
1. User can access the page only if they have `Issue Tracker: View/Edit/Comment Issues - All Sites` or `Issue Tracker: View/Edit/Comment Issues - Own Sites` or `Issue Tracker: View/Edit/Comment/Close Issues - Own` permission.
2. User can see data from all sites if they have `Issue Tracker: View/Edit/Comment Issues - All Sites` permission.
3. User can see data only from their site(s) if they have `Issue Tracker: View/Edit/Comment Issues - Own Sites` permission.
4. User can see only their data if they have `Issue Tracker: View/Edit/Comment/Close Issues - Own` permission.
5. Check that user do not have access if only they have `Issue Tracker: Close Issues - All Sites` or `Issue Tracker: Close Issues - Own Sites` permission.
6. Check that a user cannot close an issue if they do not have `Issue Tracker: Close Issues - All Sites` or `Issue Tracker: Close Issues - Own Sites` or `Issue Tracker: View/Edit/Comment/Close Issues - Own` permission.
7. Test that all filters work. Nothing should be filtered at first loading.
8. Test that all preset filters work and redirect to the correct table. 
9. Test that the watching checkbox works correctly (issues that your userID is watching in issues_watching table)
10. Check that links to issues in table are correct.
11. Check that table sorts and displays additional pages correctly 
12. Check that a user who has `Issue Tracker: View/Edit/Comment Issues - Own Sites` permission and belongs to only one site can see all issues with a NULL centerID. Check that they have the label `All Sites` in the Site column. 

## Issue Tracker Create New Issue [Manual Testing]
1. User can access the page if they have `Issue Tracker: View/Edit/Comment Issues - All Sites` or `Issue Tracker: View/Edit/Comment Issues - Own Sites` or `Issue Tracker: View/Edit/Comment/Close Issues - Own` permission.
2. Check that title and site are required.
3. Do not provide a PSCID value and set site to All Sites. This should set `issues.centerID` to `NULL` after success.
4. Do not provide a PSCID value and and check that site can be populated by a particular site (except All Sites) in the dropdown values.
5. Submit a PSCID and set Site to All Sites. This should work if the PSCID exists in the database.
6. Submit a PSCID with a Site value (except All Sites). This should not work if the PSCID does not exists or if the PSCID does not match with the site.
7. Should display message, and redirect after success. 
8. Submit invalid and valid PSCID and visit label pairs. Error messages should display accordingly. 
9. A user should be able to submit a PSCID from other sites only if they have `Issue Tracker: View/Edit/Comment Issues - All Sites` permission. 
10. Submit just a visit label - this should give an error message.
11. Check that all values are propagated and saved correctly.
12. Add an attachment to the new issue and make sure that it is successfully uploaded.
13. Check that watching options are working - turn it off and on for your current user, and for other watchers on the issue, and check that values are saved.
14. **External Issue ID field**: Check that the field is only visible if user has `Issue Tracker: View External Issue ID` permission.
15. **External Issue ID field**: Check that the field is only editable if user has `Issue Tracker: View External Issue ID` permission.
16. **External Issue ID field**: Submit an issue with an External Issue ID (e.g., "GH-9795") and verify it saves correctly.

## Issue Tracker Edit Existing Issue [Manual Testing]
1. User can access the page if they fulfill all the following conditions:
	* they have `Issue Tracker: View/Edit/Comment Issues - All Sites` or `Issue Tracker: View/Edit/Comment Issues - Own Sites` or `Issue Tracker: View/Edit/Comment/Close Issues - Own` permission. 
2. Users can only enter a PSCID for those candidate that are in their site.
3. Submit invalid and valid PSCID and visit label pairs. Error messages should respond accordingly. Not that you cannot submit PSCIDs from other sites unless you have `Issue Tracker: View/Edit/Comment Issues - All Sites` permission.
4. Submit just a visit label - this should give an error message.
5. Check that all values are propagated and saved correctly.
6. Check that watching options are working - turn it off and on for your current user, and for other watchers on the issue, and check that values are saved.
7. Add an attachment to the new issue and make sure that it is successfully uploaded.
8. Check that an attachment can be added to an existing issue.
9. Test if users assigned to issues can upload attachments.
10. Test if users can delete their own uploaded attachments.
11. Test if user assigned to issue cannot delete attachments of issue owner.
12. Test that emails are sent to users that are watching the issue.
13. **External Issue ID field**: Verify that users without `Issue Tracker: View External Issue ID` permission cannot see the field.
14. **External Issue ID field**: Verify that users with the permission can see and edit the field.
15. **External Issue ID field**: Edit an existing issue's External Issue ID and verify the change is saved and appears in the comment history.
16. **External Issue ID security**: Attempt to bypass frontend by sending a POST request with externalIssueID without the permission - verify it's rejected.

## Permissions [Automation Testing]
1. Remove `Issue Tracker: View/Edit/Comment Issues - All Sites` permission.
2. Remove `Issue Tracker: View/Edit/Comment Issues - Own Sites` permission.
3. Remove `Issue Tracker: View/Edit/Comment/Close Issues - Own` permission.
4. Remove `Issue Tracker: Close Issues - All Sites` permission.
5. Remove `Issue Tracker: Close Issues - Own Sites` permission.
6. Remove `Issue Tracker: View External Issue ID` permission.
7. Test that the module behaves correctly as described above.
 

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
