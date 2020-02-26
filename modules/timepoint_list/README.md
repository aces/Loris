# Timepoint List

## Purpose

The `timepoint_list` module serves as an entry-point for data entry
about a candidate. It also serves as a place for linking to other
modules that provide more specific information and actions for a
candidate's data.

It is also known as the "Candidate Profile" page.

## Intended Users

The `timepoint_list` module is primarily intended for data entry
staff who are accessing a candidate.

## Scope

The `timepoint_list` module provides a mechanism to link to
information about candidates. 

NOT in scope:

The `timepoint_list` module does *not* provide any data entry
functionality or mechanisms to configure study timepoints,
only access timepoints of specific candidates.

## Permissions

The `timepoint_list` module requires the user accessing it to
have access to at least 1  timepoint of the candidate being
accessed. This can either occur by having the `access_all_profiles`
permission, being a member of the same site as the candidate's
RegistrationCenterID, or having access to a CenterID in common
with one of the candidate's timepoints.

## Configurations

None

## Interactions with LORIS

- The `timepoint_list` links to the `candidate_parameters` module,
  `create_timepoint` module, `imaging_browser` module, and `instrument_list`
  module to provide more specific data entry/browsing functionality
  about the candidate being accessed.
