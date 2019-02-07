# Create Timepoint

## Purpose

The create timepoint module is intended to allow the creation of
timepoints (also sometimes called "sessions" or "visits") for
candidates within a LORIS module.

## Intended Users

The `create_timepoint` module is primarily used by data entry staff
in order to create a new session prior to data entry. It may also
be used by imaging staff in order to create a timepoint before
uploading scans.

## Scope

The `create_timepoint` only creates the timepoint. It does not
populate the test battery (which is done by the `next_stage` module.)

## Permissions

The module requires the user to have the `data_entry` permission
as well as at least 1 study site.

## Configurations

The "useProjects" configuration affects whether or not the available
subprojects are restricted to the candidate's project related
subprojects.

The "visitLabel" setting in config.xml determines how the visit
label for the timepoint is selected. However, this functionality
is deprecated as text entry is unreliable.

## Interactions with LORIS

Users primarily access this module from the `candidate_list`. Upon
creating a timepoint, the module provides a link to the (empty)
`instrument list` module for the new timepoint.
