# User Accounts

## Purpose

The user accounts module is used to manage the user accounts on the LORIS 
application. It provides functions to add new users, edit a user account and search
for specific user sets.

## Intended Users

This module is typically used by site coordinators to manage the access rights to the LORIS
application at their site. Other users might include the study coordinator and the LORIS system 
administrator.

## Scope

This module displays information about the user accounts on the LORIS application.
It allows the modification of a user account (activation/inactivation, change in access 
permissions, change in email addresses, etc..) and the creation of new user accounts. 
It also provides a search filter to view specific sets of user accounts.

## Permissions

The user accounts module uses the following permissions. Any one of them 
is sufficient to have access to the module:

user_accounts
 - This permission gives the user viewing and editing access to all accounts
that have at least one affiliated site in common with him/her.

user_account_multisite
 - This permission gives the user viewing and editing access to all 
accounts, irrespective of the sites they are affiliated to.

## Configurations

The user accounts module has the following configuration settings that affect its usage:

title
 - title of the study that will appear in the text of the email sent to a user 
and/or his/her supervisor when modifying or creating a user account. 

url
 - url of the LORIS application that will appear in the text of the email sent to a 
user and/or his/her supervisor when modifying or creating a user account. 

additional_user_info
 - whether or not to use the additional user profile fields (like Institution, Country, etc...).

## Interactions with LORIS

- Modifications performed on the MyPreferences page will be reflected on 
the user account page when viewing the edited account.

