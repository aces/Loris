# Request Account - Test Plan 
 
### Request Account form: 
1. Verify that form returns error message for each field left blank
2. Verify that form returns appropriate error message for each field with invalid value entered (e.g. invalid email)
3. Verify that verification code is enforced (if and only if re-captcha has been activated by the project)
4. Verify that clicking "Submit" button with valid form data will load page acknowledging receipt (Thank you page)
5. Verify "Return to Loris login page" link on Thank you page works
	
### Approving new User Account Request:
6. Log in as another user who has permission: user_accounts (User Management) and does not have permission:user_accounts_multisite (Across all sites create and edit users). Verify that new account request notification is counted in Dashboard (count has incremented).
7. Verify that Dashboard "Accounts pending approval" link will load the User Accounts module filtered for all accounts where Pending(=1/Yes) and Site is not yet assigned
8. Approve a new user account request (set Pending=No, set Site, check "Notify" and "Generate new password" boxes, set various permissions).  
9. Verify that new user is notified by email when account is approved.
10. Once account is approved, try logging in with new user credentials

### Email functionality
11. Disable the `sandbox` configuration setting in your configuration file.
12. Create a new user account using an email address you can access. Give it either the `user_accounts` or `user_accounts_multisite` permission.
13. Issue a new user account request specifying the same site and project as the user you created in the previous step. Verify that an email is sent to your email address.

