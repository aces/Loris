# Password Reset

1. On the LORIS login page, click the "Forgot your password?" 
 - Assert redirects to `login/password-reset/` page
2. Type a non-existing user's username (`users.UserID`)
 - Assert the success message get displayed (to avoid revealing user information during phishing attacks)
3. Click on "Return to Login Page"
 - Assert link is functional and sends you back to login
4. Proceed with **Step 1** again. Type a valid user's username (`users.UserID`)
 - Assert the success message gets displayed
 - Assert Email is sent to user's registered email address (`users.Email`)
 - Assert Email contains all the necessary information in a readable format. Most importantly the reset link.
 - Assert the reset link points to `login/authenticate-token/?token=XXXXXXXXX`
 - Assert reset link redirects to proper page.
5. Proceed with ***Password Change*** test plan