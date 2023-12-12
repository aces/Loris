# Candidate List

## Purpose

The candidate list is intended to provide a menu from which users
can access specific candidates while browsing LORIS data.

It is referred to as "Access Profile" in the LORIS menus.

## Intended Users

The candidate list is primarily used by data entry staff in order
to access Candidate Profile pages (the `timepoint_list` module,
which further navigates to `instrument_list`) in order to access
the candidate and perform data entry.

Other user groups may use it for filtering candidate profiles for
reviewing candidate data status.

## Scope

The `candidate_list` module provides a list of candidates and links
to other relevant LORIS modules where applicable.

## Permissions

Accessing the `candidate_list` module requires either the `data_entry`
permission (_"Access Profile: View/Create Candidates and Timepoints - Own Sites"_)
and at least one study site, or the `access_all_profiles`
permission (_"Access Profile: View Candidates and Timepoints - All Sites"_).

Users with the `access_all_profiles` permission can see every
candidate in LORIS, while users with only the `data_entry` permission
can exclusively see candidates at study sites with which they are affiliated.

## Configurations

The "EDC" column is only displayed in the data table if the `useEDC` variable
(_"Use EDC"_) is configured to 'Yes' in the Configuration module.

## Interactions with LORIS

The "Scan Done" column indicates whether or not a scan was performed
for that candidate. If a scan was performed, the value "Y" in the column
will contain a link to the `imaging_browser` module prefiltered for that candidate.

Clicking on the link in the PSCID column takes the user to the `timepoint_list`
page for that candidate. Users who do *not* have the `access_all_profiles`
permission will only be able to see, and navigate to the `timepoint_list` page of,
candidates from sites with which the user is affiliated. For these users, a
separate form appears (by clicking the _Open Profile_ button) for the user to fill
out in order to access candidates not displayed. This is done by entering in the
form a candidate's CandID/PSCID combination. This is intended to allow users
to only see candidates whose CandID and PSCID they already have access to.
