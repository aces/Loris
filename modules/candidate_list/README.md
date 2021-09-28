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

The `useEDC` variable (_"Use EDC"_) can be configured to show or hide the
"EDC" column in the data table. "EDC" stands for "Expected Date Of Confinement",
which refers to the pregnancy due date. This variable can be turned on or off
in the Configurations module.

## Interactions with LORIS

The "Scan Done" column indicates whether or not a scan was performed
for that candidate. If a scan was performed, the value "Y" in the column
will contain a link to the `imaging_browser` module prefiltered for that candidate.

Clicking on the link in the PSCID column takes the user to the
`timepoint_list` page for that candidate. For users who do *not*
have the `access_all_profiles` permission, an _Open Profile_ form can be
used to access a candidate from a restricted site if the correct CandID
and PSCID are provided.
