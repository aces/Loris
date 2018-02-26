#Request account feature - Test Plan 
*Stored under User Accounts module test/ directory*
 
### Request Account form: 
1. Verify that form returns error message for each field left blank
2. Verify that form returns appropriate error message for each field with invalid value entered (e.g.invalid email)
3. Verify that verification code is enforced (if and only if re-captcha has been activated by the project)
4. Verify that new verification code loads on every refresh of the page
5. Verify that clicking "Submit" button with valid form data will load page acknowledging receipt (Thank you page)
6. Thank-you Receipt-acknowledgement page:  test "Return to Loris login page" button
	
### Approving new User Account Request:
7. Log in as another user who has permission:user_accounts and does Not have permission:user_accounts_multisite.  Verify that new account request notification is counted in Dashboard (count has incremented).
8. Verify that Dashboard "Accounts pending approval" link will load the User Accounts module filtered for all accounts where Pending(=1/Yes) and Site is not yet assigned
9. Approve a new user account request (set Pending=No, set Site, check "Notify" and "Generate new password" boxes, set various permissions).  
10. Verify that new user is notified by email when account is approved.
11. Once account is approved, try logging in with new user credentials
