# Instrument Test Plan

1. Verify that in order to access the module the user meets one of the following criteria:
   - User can access the instrument through the candidate_list module (Access Profile) 
     - go to the candidate_list
     - click on a PSCID to get to the timepoint_list module
     - click on a timepoint to get to the instrument_list module
     - click on an instrument to access the instrument itself.  
     _**Note:** All steps before clicking on the instrument itself are handled 
     by their own modules and necessary permissions to access these modules should be 
     part of their respective testplans._
   - User is provided a direct link to the instrument.
2. Select and instrument in the list of the session instruments.
3. Ensure that the candidate info at the top (DoB, EDC, ...) are correct.
4. Enter a date and click 'Save Data'. Check if age calculation
is correct.
5. Try to save the instruments without an examiner. You should have a box specifying that 
'an examiner is required'.
6. If the instrument has multiple pages (on the left pane), move from page to page and check that the
saved data stays the same. The data that wasn't saved should be lost.
7. Make sure that the 'Delete instrument data' button on the left pane is only visible when the user
has the 'Send to DCC' permission.
8. Click on the 'Delete instrument data' button and check if the instrument's data is cleared.
9. Select a candidate with a Date Of Death (DoD) or put one in for a candidate as needed, then select an
instrument for that candidate. Enter a date (same a step 4) posterior to the DoD. Refresh the page and check that the 
'Candidate age' label change to 'Candidate Age at Death'.
10. Check that access restriction in `config.xml` work.
 - In the `<instrumentPermissions>` section of `config.xml`
 - set the `<useInstrumentPermissions>` to `true`
 - add the name of an instrument in the `<Test_name>` tag of the `<instrument>`
 - add the name of a permission in the `<permission>` tag of the same `<instrument>`
   - create a new permission if needed (`permissions` table)
 - check that the user can access that instruments if and only if they has that permission
