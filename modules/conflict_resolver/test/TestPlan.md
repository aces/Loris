# Conflict Resolver Test Plan

1. Menu item and permissions [Automation Testing]
    1. Menu item 'Clinical > Conflict Resolver' appears for users with permission 'Resolving conflicts'
    2. Menu item loads the module page
    3. Check for existence of 'Resolving conflicts' permission checkbox on 'User Accounts > Edit User'
       Verify that the permission works as expected (hides menu item and blocks page access)
2. Verify the following conditions are required for creation of new unresolved conflict
   to be instantiated in the module table:[Manual Testing]
    1. Double data entry active on instrument
    2. Instrument time-point must be entered twice
    3. Mismatch of values on a given field
    4. Candidate is not in 'Recycling Bin'
    5. Instrument is marked Data Entry = 'Complete' for initial and double data entries
3. Correct display of Unresolved conflicts:[Manual Testing]
    1. Table displays list of unresolved conflicts
    2. The 'Correct answer' field has dropdown menu containing a list of options for each row
    3. Save & Reset buttons at bottom of table
    4. Pagination [1 | 2 | 3 ...] appears at top and bottom when n > 20 and works, and maximum rows per page dropdown appears and works
    5. Clicking on a column name sorts data properly
4. Correct display of Resolved conflicts:[Manual Testing]
    1. Use 'resolved conflicts' tab to switch views
    2. Table displays resolved conflicts
    3. Field 'Corrected answer' has a value
    4. Pagination [1 | 2 | 3 ...] appears at top and bottom when n > 20 and works, and maximum rows per page dropdown appears and works
    5. Clicking on a column name sorts data properly
5. Filter for the specific parameter (Choose the one that applies):[Automation Testing]
  - Select the right instrument from the 'All Instruments' drop-down
  - Input the right DCCID
  - Input the right PSCID
  - Select the right Site
    - Select the right Project
  - Select the right Visit-label
  - Check that 'Clear Form' removes values from the filters and resets the table
  - Verify that filters work as expected - inspect the results table
6. Operation of resolving conflict and saving data should work as follows:[Automation Testing]
 - On Unresolved conflicts tab, set value of dropdown lists to accepted value
    (Note: use paper form or other reference to resolve correct value)
 - Press 'Reset' button to verify it resets dropdown menus
 - Enter correct answers for several rows
 - Press 'Save' button to save. Page will reload
 Ensure the changes take effect:
 - Check database to verify that submitted values have been properly saved
 - Also check and make sure that the instrument and its corresponding DDE are updated accordingly
 - Ensure if Date_taken is changed, the candidate age in the instrument is updated accordingly
 - Make sure the scoring_fields are re-calculated in the given instrument once the conflict is resolved

## Dashboard Widget

1. Go to the LORIS dashboard. 
 - Ensure that the "My Tasks" widget on the LORIS dashboard has a "Data entry conflicts"
   item
 - Toggle `access_all_profiles` user permission and verify the label changes between "Sites: All"
   and "Sites: User sites" and the number associated with the tasks is updated accordingly.
2. Clicking on the entry in the task in the dashboard should navigate to the conflict resolver
   module

## Candidate Profile Widget
1. Go to the `candidate_profile` module through the "Candidate -> Access Profile (beta)" and
   access a candidate with at least 1 conflict.
  - Ensure that there is an "Unresolved Conflicts" card if the user has the `conflict_resolver`
    permission
  - Ensure that the card does *not* appear (but no other cards are affected) after removing
    the `conflict_resolver` permission
2. With the `conflict_resolver` permission, ensure that there is a bar graph of the number
   of conflicts per instrument, grouped by visit.
  - Ensure that clicking a bar in the bar graph brings you to the conflict resolver module
    with the filters preset to filter for that instrument and visit
  - Ensure that clicking on an instrument in the legend takes you to the conflict resolver
    with the filter preset for that instrument (but no filter for visit)

