# My Preferences Test Plan

1. Check that all users (even those with NO permissions) have access to the My Preferences page. [Automated]
2. Change the user’s password.  Check that the password rules are enforced. [Automated]
3. Check that if password and confirmed password do not match you get an error. [Automated]
4. Check that saving fails if any field is left blank (except password).
5. Check that if you do not enter an email address that is syntactically valid you get an error.
6. Modify any field on the page and save, and go to the User Account page. Check that the modifications are
    displayed when looking at the modified user account.  
7. Verify that all notification checkboxes match what the project has enabled in the `notification_modules_services_rel`. See WIKI for more details https://github.com/aces/Loris/wiki/Notification-system.
8. Verify that checkboxes available respect the permission restrictions set in the `notification_modules_perm_rel`. See WIKI for more details https://github.com/aces/Loris/wiki/Notification-system.
9. Verify that the notifications are sent when the trigger event occurs. (NB the user triggering the event will not get the email, only other registered users are notified)
