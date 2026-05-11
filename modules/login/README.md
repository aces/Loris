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

If a query is pinned to the login page from the dataquery module, then
after the tools/update_login_summary_statistics.php tool is run, a summary of
all the pinned queries will be displayed on the login page including the count. 
If a query returns more than one row, the name will be appended with an 's'.
Pinned queries must include the column Project in order to be displayed.
Queries can also be added to project/tools/Login_Summary_Statistics to
be added to the calculations for the statistics on the login page.


## Interactions with LORIS

The login module redirects to the dashboard upon successful login.
