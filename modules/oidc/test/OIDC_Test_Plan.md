# OIDC Test Plan

1. Populate the `openid_connect_providers` table with credentials for a third party OIDC identity provider.
2. Ensure that there is a "Login with (name)" for the name from the `openid_connect_providers` table set up in 1.
3. Click the link and try logging in with a user whose email address does not exist in LORIS. You should be redirected
   to the request account page.
4. Click the link and try logging in with a user whose email does exist in LORIS. You should be logged in and redirected
   to the LORIS dashboard.
5. Attempt to access the /oidc/callback a second time with the same parameters that were set up in step 3 or 4. You should
   be denied (the state and nonce are no longer valid once used. Ensure they don't remain in the `openid_connect_csrf` table.)
