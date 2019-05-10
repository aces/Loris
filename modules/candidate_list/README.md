# Candidate List

## Purpose

The candidate list is intended to provide a menu from which users
can access specific candidates while browsing LORIS data.

It is referred to as "Access Profiles" in the LORIS menus.

## Intended Users

The candidate list is primarily used by data entry staff in order
to access the `timepoint_list` module (and `instrument_list`
from there) in order to access the candidate and perform data entry.

Other user groups may use it for filtering candidate profiles for
reviewing candidate data status.

## Scope

The `candidate_list` module provides a list of candidates and links
to other relevant LORIS modules where applicable.

## Permissions

Accessing the `candidate_list` module requires either the `data_entry`
permission and at least one study site, or the `access_all_profiles`
permission.

Users with the `access_all_profiles` permission can see every
candidate in LORIS, while users with only the `data_entry` permission
can exclusively see candidates at study sites where they are affiliated.

## Configurations

The `useEDC` configuration variable has a similar function for the
"EDC" ("EDC" stands for "Expected Date Of Confinement" which refers
to the pregnancy due date) column.

## Interactions with LORIS

The "Scan Done" column indicates whether or not a scan was performed
for that candidate. When a scan was performed (i.e. it has the value
"Y"), clicking the table cell links to the `imaging_browser` module
prefiltered for that candidate.

Clicking on the cell in the PSCID column takes the user to the
`timepoint_list` page for that candidate. The link is only clickable
if the user does *not* have the `data_entry` permission. For users
who have the `data_entry` permission, a separate form appears for
the user to type the CandID/PSCID combo in order to access the
candidate.  This is intended to prevent data entry errors caused
by accidentally clicking on the wrong row before doing data entry.
