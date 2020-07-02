# Reset Password Test Plan

1. In the `users` table in the database, set a user's `PasswordChangeRequired` value to `1`.
2. Login as that user. You should see an update password page.
3. Try using a very short password (e.g. "pass"). You should get an error.
4. Try using a very weak password (e.g. "password"). You should get an error.
5. Try entering unmatched passwords. You should get an error notice.
6. Try entering the same password that you currently have. You should get an error notice.
7. Try entering the user's email as the new password. You should get an error.
8. Try entering the user's username as the new password. You should get an error.
9. Enable the `usePwnedPasswordsAPI` via the Configuration module or the back-end. Enter the password "correct horse battery staple".
    (The service will report that this password is known to be exposed in online password breaches and, while complex in terms of entropy,
     should not be used as a password.) You should get an error notice. If your firewall is configured to prevent a connection with this
    API, you will NOT get an error message and the password will successfully register in LORIS. 
10. Create a new, complex password and submit. A complex password is usually one that is long or contains many different kinds of characters,
    such as numbers, upper and lower case letters, and special characters.
    You can use the website https://lowe.github.io/tryzxcvbn/ to interactively create a password using the same complexity-scoring algorithm as LORIS. 
    A password receiving at least a score of 3 on this site will work for LORIS.
11. Logout. Try logging back in with new password to see if it works.
