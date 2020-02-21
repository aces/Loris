# Candidate Profile

## Purpose

The `candidate_profile` module provides is intended to provide
a dashboard in which a user can see an overview of all data related
to a specific candidate in LORIS across all installed and active
modules.

## Intended Users

Any user interacting with candidate data.

## Scope

The candidate profile module is only concerned with candidate level
data.

NOT IN SCOPE:

The candidate profile is not intended to be used for data entry, only
for a candidate overview. Modules which provide widgets should link to
appropriate pages in the module for data entry.

## Permissions

None, but modules may implement their own permissions.

## Configurations

None, but see interactions with LORIS.

## Interactions with LORIS
- The `candidate_profile` module depends on the LORIS API to retrieve
  basic candidate and visit level data to pass to widgets
- The `candidate_profile` will call `getWidgets` on each module to
  get a list of widgets. It uses the widget type of `candidate`. The
  options provided include a 'candidate' key which is the `\Candidate`
  object for the candidate whose dashboard is being displayed. It expects
  an array of `\LORIS\candidate_profile\CandidateWidget` widget types
  as a result.
