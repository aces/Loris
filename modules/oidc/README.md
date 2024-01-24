# OIDC

## Purpose

The OIDC (OpenID Connect) module is intended to allow users to login
to LORIS using the OpenID Connect Authorization code flow and log in
with third party identity providers.

If the OIDC provider returns a verified email address that exists in
LORIS and is not pending, the user will be logged in. If the address
does not exist in LORIS, the user will be redirected to the request
account page with the known user info pre-filled.

## Intended Users

The module is used by all users who are trying to access LORIS on
a server that has configured valid OpenID Connect identity providers.

## Scope

This module performs functions relating to the authentication
of users. It does not configure the OIDC workflow.

## Permissions

None, this module is primarily intended for not yet authenticated
users.

## Configurations

The `openid_connect_providers` table must be manually populated. The
exact configuration depends on values that come from the provider.

The columns in the table are:

- Name -- this is a string which is used to identify the provider to
          users on the login page behind a "Login with $name" link.
          (ie. "Facebook", "Globus", "Google", "Auth0", etc)
- BaseURI -- this is the basis of the third party URLs. It should be
        set to the domain which serves the .well-known/openid-configuration
        file so that this module can do service discovery.
- ClientID -- This is a value that comes from the third party provider. It
        is generally a long string.
- ClientSecret -- This is a value that comes from the third party provider. It
        is generally a long string and should not be shared or displayed anywhere.
- RedirectURI -- This is the URI that the provider will redirect to. It generally
        *must* be served over HTTPS and must be whitelisted in the configuration,
        though some providers allow http://localhost for development purposes.

An example of an insert statement to populate the table is for mylorisserver.example.com
using auth0 as the identity provider is:

```
INSERT INTO `openid_connect_providers` (Name, BaseURI, ClientID, ClientSecret, RedirectURI) VALUES ('auth0', 'https://dev-p8q62jkwrvtaznao.us.auth0.com', '$mypublicid', '$mysecretid', 'https://mylorisserver.example.com/oidc/callback');
```

## Interactions with LORIS

If the email address returned by the OpenID Connect provider does
not yet exist in LORIS, the module will re-direct to the request
account page with the known values pre-filled.
