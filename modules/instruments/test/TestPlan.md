# Instrument Test Plan

1. Verify that in order to access the module the user has meets one of the following criteria:
 - User can access the candidate_list module (Access Profile) then
   - click on a PSCID to get to the timepoint_list module then
   - click on a timepoint to get to the instrument_list module and finally
   - click on an instrument to access the instrument itself.  
   _**Note:** All steps before clicking on the instrument itself should be handled by their own modules and necessary permissions to access these modules should be part of their respective testplans._
 - User is provided a direct link to the instrument.

2. Select and instrument in the list of the session instruments.
3. Ensure that the candidate info at the top (DoB, EDC, ...) are correct.
4. Enter a date and click 'Save Data'. Check if age calculation
is correct.
5. Try to save the instruments without an examiner. You should have a box specifying that 
'an examiner is required'.
6. If the instrument have multiple pages (on the left pane), move from page to page and check that the
saved data stay the same. The data that wasn't saved should be lost.
7. Make sure that the 'Delete instrument data' button on the left pane is only visible when the user
have the 'Send to DCC' permission.
8. Click on the 'Delete instrument data' button and check if the instrument's data is cleared.
9. Select a candidate with a Date Of Date (DoD) or put one in for a candidate as needed, then select an
instrument for that candidate. Enter a date (same a step 4) posterior to the DoD. Refresh the page and check that the 
'Candidate age' label change to 'Candidate Age at Death'.
