# Reset Password Test Plan

1. Change your password expiry in the backend so that it is a date in the past.
2. Login to LORIS. You should see an update password page.
3. Try out different passwords. When you type a password that is not in accordance with the listed rules, you should get an error notice:
   - The password must be at least 8 characters long
   - The password must contain at least 1 letter, 1 number and 1 character from !@#$%^&*()
   - The password and the user name must not be the same
   - The password and the email address must not be the same.
4. Try entering unmatched passwords. You should get an error notice.
5. Try entering the same password that you currently have. You should get an error notice.
5. Create a new password which complies with the rules and submit. Logout. Try logging back in with new password to see if it works.