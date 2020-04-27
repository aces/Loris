# Candidate Profile Test Plan

## Module / Page Permissions
1. Access the module at the url `$LORISURL/candidate_profile/$CandID` for
   a CandID that the logged in user has access to. The page should load
   with (at a minimum) a "Candidate Info" card. Ensure that the links
   in the "Visits" work.
2. Access the module the using same URL while logged out. Ensure there is a permission
   denied page with an appropriate HTTP response code and no cards are
   displayed.
3. Log back in, and access a URL for a candidate that the user should
   not have access to (wrong project, site, etc). Ensure that there is
   a permission denied page.
4. Access a CandID that does not exist. Ensure that there is a 404
   Not Found response.

## Widget Permissions
For a module that adds a widget and a candidate which has data for
that widget (ie. the media module for CandID 491446 in Raisinbread):
1. Ensure that the card appears when accessing that candidate as a
   user who has appropriate permission and access to the module
   itself.
2. Ensure that the card does *not* appear (but other cards do) when
   the user does not have appropriate permissions to access the
   module.
3. Disable the module in LORIS, ensure that the card does not appear
   even if the user has permissions (but other cards still do).

## Candidate Info Widget

1. Ensure that the "Candidate Info" card displays correct data for data
  returned by API:
    - PSCID
    - DCCID
    - Date of Birth
    - Age
    - Sex
    - Project
    - Subproject
    - Site
    - Visits
2. Ensure that any visits under "Visits" are links that go to the
   candidate's visit.
3. Ensure that other modules are able to add extra terms to the candidate
   info by implementing a `getWidgets` function which returns an array of
   `\LORIS\candidate_profile\CandidateInfo` objects when the type is
   'candidateinfo', either by implementing the function on a module or
   testing a module which already has it implemented (such as 
   `candidate_parameters`)
4. Ensure that, when the module which added the extra `CandidateInfo` terms
   is disabled, the terms from that module no longer show up in the
   `Candidate Info` card.

All other widgets are part of other modules, and should be tested as
part of that module's testing.
