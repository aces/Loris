# Conflict Resolver Test Plan

- [Permissions](#permissions)
- [Unresolved Conflicts](#unresolved-conflicts)
- [Resolved Conflicts](#resolved-conflicts)
- [Selection Filter](#selection-filter)
- [Correct Answer](#correct-answer)
- [Dashboard Widget](#dashboard-widget)
- [Candidate Profile](#candidate-profile)

## Permissions

- Go into /user_accounts/ and select the following permission
  - [x] Conflict Resolver: Resolve Conflicts
- Assert that the 'Clinical/Conflict Resolver' menu item appears
- Assert that clicking on this loads the page `/conflict_resolver`
- Assert that, when unchecked, the following permission hides the menu item
  - [ ] Conflict Resolver: Resolve Conflicts
  - try the URL: `/conflict_resolver`, and assert that the page is blocked with a 403 error
  - Check this box again
    - [x] Conflict Resolver: Resolve Conflicts
- Uncheck **both** of the following permissions
  - [ ] Dictionary: Edit Parameter Type Descriptions
  - [ ] Dictionary: View Parameter Type Descriptions
  - Assert that access to the page is blocked, drawing a 403 error.

## Unresolved Conflicts

- Verify the following conditions are required for creation of new unresolved conflict:
  - Double data entry active on instrument
  - Instrument time-point must be entered twice
  - Mismatch of values on a given field
  - Candidate is not in 'Recycling Bin'
  - Instrument is marked Data Entry = 'Complete' for initial and double data entries

- Correct display of Unresolved conflicts
  - Table displays list of unresolved conflicts
  - The 'Correct answer' field has dropdown menu containing a list of options for each row
  - Pagination [1 | 2 | 3 ...] appears at top and bottom when n > 20 and works, and maximum rows per page dropdown appears and works
  - Clicking on a column name sorts data properly

## Resolved Conflicts

- Correct display of Resolved conflicts:
  - Use 'resolved conflicts' tab to switch views
  - Table displays resolved conflicts
  - Field 'Corrected answer' has a value
  - Pagination [1 | 2 | 3 ...] appears at top and bottom when n > 20 and works, and maximum rows per page dropdown appears and works
  - Clicking on a column name sorts data properly

## Selection Filter

- Select an instrument from the `Instruments` and assert that the table filters
- Enter a CandID and Assert that the table filters accordingly
- Enter a PSCID and Assert that the table filters accordingly
- Enter a site and assert that the table filters accordingly
- Enter a project and assert that the table filters accordingly
- Select a Visit-label and assert that the table filters accordingly
- Assert that `Clear Filter` removes values from the form

## Correct Answer

- click the `Unresolved` tab
- on the rightmost field of each row, under `Correct Answer`, select an option for several rows, asserting that the row highlights with a lime green colour
- Check database to verify that your chosen values have been saved
  - SELECT * FROM conflicts_unresolved;
  - SELECT * FROM conflicts_unresolved;
- Also check and make sure that the instrument and its corresponding DDE are updated accordingly
- Ensure if Date_taken is changed, the candidate age in the instrument is updated accordingly
- Make sure the scoring_fields are re-calculated in the given instrument once the conflict is resolved
- Open a new browser window and go to the Resolved conflicts tab and make sur the record is there.
- Go back to your previous window, select a new value for the resolved conflict. Refresh the second window and check if the new value appears. 

## Dashboard Widget

- Go to the LORIS dashboard `/` 
- Assert that `My Tasks` widget has `Data entry conflicts` with an associated integer
   item
- Click on `Data entry conflict` and assert that this re-directs to `/conflict_resolver`
- Go to `/user_accounts/`
- [x] `access_all_profiles`
  - verify the label changes between "Sites: All"
   and "Sites: User sites" and the number associated with the tasks is updated accordingly.
- Remove the following permission
  - [ ] Conflict Resolver: Resolve Conflicts
  - Assert that widget does not appear in the LORIS splash page `/`
  - Assert that there is an `Unresolved Conflicts` card if the user has the
  permission

## Candidate Profile

- Go to the `candidate_profile` module through the "Candidate -> Access Profile (beta) or `/candidate_list/?betaprofile=1`
- access a candidate with at least 1 conflict
- With the `conflict_resolver` permission, ensure that there is a bar graph of the number
of conflicts per instrument, grouped by visit
- Assert that clicking a bar in the bar graph re-directs you to the conflict resolver module
with the filters preset to filter for that instrument and visit
- Assert that clicking on an instrument in the legend takes you to the conflict resolver
with the filter preset for that instrument (but no filter for visit)