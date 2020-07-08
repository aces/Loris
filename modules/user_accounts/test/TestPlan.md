User Account module - Test plan
===============================

1. Make sure you do not have access to the `User Accounts` page if you do not have at least one of these permissions:
      - `There can be only one Highlander`.
      - `User management`
2. The User Module should display only users belonging to the same site as the active user, unless they have the permission `Across all sites create and edit users`.
3. Click the `Clear Filters` button and verify it resets all filters.
4. Verify that searching functions with all criteria: 
    * site, 
    * user name, 
    * active, 
    * full name, 
    * pending approval, 
    * email
5. Verify that if the editor does not have permission 'Across all sites add and edit users' then the site drop-down list is populated with
   the editor's associated sites, otherwise all sites are displayed.
6. The empty option in the site filter should display users from all sites, even if they are different from the active user.
7. Ensure adding a new user with the same name as an existing user fails.

When creating or editing a user: (subtest: edit_user)
========================================================

8. Ensure password strength rules are enforced.
9. Form submission (the `Save` Button) should fail if any of the following fields are blank:
      - User name,
      - Password (and confirm password),
      - First name,
      - Last name,
      - Email.
10. If password and confirmed password do not match, an error should be displayed. [Automated]
11. Email fields containing submitted with invalid formats should generate an error. 
     
* Ensure the confirm email text field is not displayed on the edit user page (and only on the create new user page).

12. For an existing active user, edit the user's account and click 'Generate new password' and check 'Send email'.
    Save. Check that an email is sent to the user with the new password. 
    Check that after logging in, the user is immediately asked to update his/her password.
13. Check that if creating a new user an email is sent to him/her (requires email server). Also check that when a new
    user is logging in for the first time he/she is asked to change his/her password.
    1. Check that when creating a new user, leading and trailing spaces in the username are stripped.
    2. Check that you can create a new user with name 00 (double zero).
    3. Check that you can delete one of the additional fields (organization, fax, etc...) that was previously set and that the save is performed.
14. Check that if generating a new password for a user an email is sent to that user containing the new password (requires
    email server).
15. Check that when editing a user account it is not possible to set the password to its actual value (i.e. it needs to change). [Automated]
16. Verify that if the editor does not have permission 'Across all sites add and edit users' then the site drop-down list is populated with
    the editor's associated sites, otherwise all sites are displayed.
17. Check that if the 'Display additional information' entry is set to false in the Configuration module, fields Degree,
    Academic Position, Institution, Department, Street Address, City, State/Province, Zip/Postal Code, Country and 
    FAX are not shown.
18. Check that the 'Examiner At:' and 'Examiner Status' sections are available only if you have the 'Across all sites add and certify examiners'.
19. Check that selecting sites for the "Examiner At:" Section and saving, adds user X to the Examiner list (and in examiners table).
20. Check that de-selecting sites from the "Examiner At:" section and saving, does NOT delete X from the Examiner table but rather sets them as inactive for that site.
21. Check that setting the radiologist to Yes/No changes the values for X for all sites
22. Setting the Pending Approval for user X prevents user X from logging in until his/her account is approved.
23. Setting the Active=”No” for user X prevents user X from logging in until his/her account is active again.
24. Check that the values entered in 'Active from' and 'Active to' are validated properly. Any combination that has from <= to or either one or both fields null is valid
25. Check that modifications made to the basic user infos are displayed when the user table is reloaded.
26. When editing an existing user: Check that Reset button restores previous settings (does not wipe all settings, or
    retain any changes).
27. When editing an existing user: Check that Back button takes you to the User Account page and does not save any
    changes. 
28. When editing an existing user: Clicking on the 'User Account' breadcrumb takes you to the User Account page
    without saving any changes to the user profile.
29. Check that if config setting 'Enable "Pwned Password" check' is set to 'Yes', then validation to make sure that the password
    entered (both for add user and edit user pages) has not been pwned is done. Also check that disabling this setting disables the 
    validation. Example of a pwned password: a1b2c3!!
30. Check that a 'Reject user' button will be available on the edit user page if the editee is a user whose account is awaiting approval and the editee
    has not yet logged in.
31. Edit a user that fits the conditions listed above and reject it. Make sure that the user has been removed from the database and does not show up in
    the search results anymore.
    
### Testing permissions:
*Log in as a simple user (non-admin) and ensure the following. Define `editee` as the user being edited and `editor` as the logged in user making the changes.*

32. Editor can only see and manipulate permissions for editee if and only if editor has the permissions in question
33. When page is saved with any set of selected permissions, on reload all selected permissions are kept and all unselected permissions are removed.
34. If editee has permissions that editor does not have, said permissions are not impacted by manipulating the editee's visible permissions (requires admin user login in a side window to be able to view all permissions for editee as editor will only be able to view permissions they own)
35. See security testing below

##### Security testing:
 - Try manipulating the POST request from the browser to add a permission to the editee. Make sure that the editee gets the permission if it is within the set of permissions of the editor Make sure the editee does not get the permission if it is not within the set of permissions of the editor. [See this PR](https://github.com/aces/Loris/pull/3818#issuecomment-408882440) for more details.

On the My Preferences page:
==========================

36. Check that all users (even those with NO permissions) have access to the My Preferences page.
37. Change the user’s password.  Check that the password rules are enforced. [Automated]
38. Check that if password and confirmed password do not match you get an error. [Automated]
39. Check that saving fails if any field is left blank (except password).
40. Check that if you do not enter an email address that is syntactically valid you get an error.
41. Modify any field on the page and save, and go to the User Account page. Check that the modifications are
    displayed when looking at the modified user account.  
42. Verify that all notification checkboxes match what the project has enabled in the `notification_modules_services_rel`. See WIKI for more details https://github.com/aces/Loris/wiki/Notification-system.
43. Verify that checkboxes available respect the permission restrictions set in the `notification_modules_perm_rel`. See WIKI for more details https://github.com/aces/Loris/wiki/Notification-system.
44. Verify that the notifications are sent when the trigger event occurs. (NB the user triggering the event will not get the email, only other registered users are notified)
45. Clicking on the 'User Account' breadcrumb takes you to the User Account page without saving any changes. If you do not have access to the user account module, the system should tell you so.
