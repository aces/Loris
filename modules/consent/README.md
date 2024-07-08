# Consent

## Purpose

The consent module is a 2-part module. It acts as a hub in which coordinators can filter through consent information from all of their participants, edit consent, and manage eConsent. The participant side of eConsent is also in this module, where participants can view and submit eConsent forms.

## Intended Users

The primary types of users are:
1. Site coordinators / Data entry
2. Study participants


## Permissions

The Consent module uses the following permissions

 - `consent_view`
    - This permission gives the user access to view the module

 - `consent_edit`
    - This permission gives the user access to edit consent and send / manage eConsent.

## Integration with LORIS

- In the "Edit" form of the consent module, the candidate parameters Consent Status page is rendered. The code for the Consent Status page checks whether it is being called from the consent module or candidate parameters to modify the display.

## Setup

The following steps must be taken to create an eConsent form:

For a basic eConsent without training:
 - Create the consent group / individual consents if they do not already exist
 - Create an entry in the `consent_display` table. Leave the `training` column null. The `Reset_period_days` column is optional, and represents the amount of time that an eConsent form can go untouched after sending before the progress is refreshed.
 - Create an entry in the `consent_display_rel` table with the corresponding ConsentGroupID and ConsentDisplayID. If the CenterID is left null, the form will be default for all participants. If you need a site specific form, then enter the CenterID for that site. You may have both a default and a site-specific form for the same ConsentGroupID.

For eConsent with trianing
 - Follow the steps from above
 - Create the eConsent form in z-JSON format
 - Store the eConsent form in the `project/eConsents/` directory
 - Set the `training` column in consent_display to the name of the z-json eConsent form (leave out the .json extension)

 If `Reset_period_days` is being used to reset the eConsent data after a specified amount of time, the script `Reset_eConsent.php` must be run nightly.
