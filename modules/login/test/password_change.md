# Password Change

1. Click on the Reset Link sent in the email
 - Assert link takes you to `login/authenticate-token/?token=XXXXXXXX`
 - Assert redirects to `login/password-change/?token=XXXXXXXX` on token validation
2. Enter an invalid password by omitting the necessary number of password requirements
 - Assert submission fails with 'The password is weak, or the passwords do not match' message
3. Enter a password that meets the minimum requirements in the first field; enter a non-matching password in the confirmation field
 - Assert submission fails with 'The password is weak, or the passwords do not match' message
4. Note the value of the `users.password_hash` field of the database for your user
5. Enter a password that meets the minimum requirements in the first field; enter the same password in the confirmation field
 - Assert value of password_hash has changed from **Step 4**
 - Assert redirects to the login page on success
 - Assert password allows you to login to this user from the login page
6. Try accessing the *'authenticate-token'* page without a proper link by navigating to `login/authenticate-token/`
 - Assert redirects to main login page
7. Try accessing the *'authenticate-token'* page with an incorrect token by navigating to `login/authenticate-token/?token=nimportequoi`
 - Assert redirects to main login page
8. Try accessing the *'password-change'* page without a proper link by navigating to `login/authenticate-token/`
 - Assert redirects to main login page
9. Try accessing the *'password-change'* page with an incorrect token by navigating to `login/authenticate-token/?token=nimportequoi`
 - Assert redirects to main login page