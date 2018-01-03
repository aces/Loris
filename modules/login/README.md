# Login

## Purpose

The login module is intended to perform operations related to
logging in to LORIS and account management of users who are not
yet authenticated in to LORIS (ie. reset password, request account,
etc.)

## Intended Users

The module is used by all users who are trying to access LORIS, and
also displays the main landing page of LORIS (with the login box) for
users who are not yet logged in.

## Scope

This module performs functions relating to the authentication
of users.

## Permissions

None, this module is primarily intended for not yet authenticated
users.

## Configurations

Since the login is part of main LORIS landing page, there are some
configuration settings unrelated to authentication which affect
the main "login" page.

The configuration setting "Study Description" provides text to show
beside the login box.

The ExternalLinks of type "StudyLinks" are shown on the page for
to provide references on the LORIS landing page. 

The configuration setting "StudyLogo" is the URL for an image to
show above the login box.

## Interactions with LORIS

The login module redirects to the dashboard upon successful login.
