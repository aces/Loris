# login Test Plan

1. Assert text on the front page matches text in the Config table of the database (ConfigSettings: 'StudyDescription')
2. Assert links on the front page match links in the Config file (config.xml: 'StudyLinks')
3. Enter incorrect credentials in the username/password fields
 - Assert login fails.
4. Enter correct credentials for a user set to not active in the database (`users.active='N'`)
 - Assert login fails with message ~`user account not active`
5. Enter correct credentials for a user who has not yet been activated after requesting an account (`users.pending_approval='Y'`)
 - Assert login fails with message ~`user account pending`
6. Enter correct credentials for active user
 - Assert login success
7. Click on "Request Account" link
 - Assert redirects to `login/request-account/` page
8. Click on "Forgot your password?" link
 - Assert redirects to `login/password-reset/` page

