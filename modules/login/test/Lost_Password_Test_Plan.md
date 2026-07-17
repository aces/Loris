# Lost Password Test Plan

1. On the LORIS login page, click the "Forgot your password?" link and ensure you are taken to the lost password form.
2. Enter your username or the email address associated with your account. Click the submit button. A notice should appear indicating that a password reset email has been sent.
3. Open the password reset email and click the password reset link. Ensure that you are taken to the password reset page.
4. Enter a valid new password and confirm it. Click the submit button.
5. Try logging in with your new password.
6. Request multiple password reset emails. Use one of the password reset links to successfully reset your password. Verify that both password reset links are no longer valid.
7. Request another password reset email. Wait more than 20 minutes before opening the password reset link. You should be redirected to the login page and informed that the password reset link is invalid or has expired.
8. Submit the lost password form more than three times within 20 minutes. Verify that no more than three password reset emails are received.