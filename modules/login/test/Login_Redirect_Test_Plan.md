# Login Redirect Test Plan

1. As an anonymous user, go to a page that requires to be logged in (this requires to use the URL of the page).
2. When met with a 403 error, choose the option "Try logging in" and enter your user credentials.
3. You should be redirected to the previous page and have access to it if you have the permissions to do so.
4. The option "Try logging in" should not appeared for logged in users that access pages they do not have the permissions for.
