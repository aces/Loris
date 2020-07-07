# Instrument Test Plan

1. Verify that in order to access the module the user meets one of the following criteria:
   - User has permission `data_entry` and can access the instrument through the 
     candidate_list module (Access Profile) 
     - go to the candidate_list
     - click on a PSCID to get to the timepoint_list module
     - click on a timepoint to get to the instrument_list module
     - click on an instrument to access the instrument itself.  
     _**Note:** All steps before clicking on the instrument itself are handled 
     by their own modules and necessary permissions to access these modules should be 
     part of their respective testplans._
   - User is provided a direct link to the instrument and has permission `data_entry`.
2. Ensure that the candidate info at the top (DoB, EDC, ...) are correct.
3. Enter a date and click 'Save Data'. Check if age calculation
is correct.
4. Try to save the instruments without an examiner. You should have a box specifying that 
'an examiner is required'.
5. If the instrument has multiple pages (on the left pane), move from page to page and check that the
saved data stays the same. The data that wasn't saved should be lost.
6. Make sure that the 'Delete instrument data' button on the left pane is only visible when the user
has the 'Send to DCC' permission.
7. Click on the 'Delete instrument data' button and check if the instrument's data is cleared.
8. Select a candidate with a Date Of Death (DoD) or put one in for a candidate as needed, then select an
instrument for that candidate. Enter a date (same a step 4) posterior to the DoD. Refresh the page and check that the 
'Candidate age' label change to 'Candidate Age at Death'.
9. Check that access restriction in `config.xml` work.
 - In the `<instrumentPermissions>` section of `config.xml`
 - set the `<useInstrumentPermissions>` to `true`
 - add the name of an instrument in the `<Test_name>` tag of the `<instrument>`
 - add the name of a permission in the `<permission>` tag of the same `<instrument>`
   - create a new permission if needed (`permissions` table)
 - check that the user can access that instruments if and only if they has that permission
10. Test both LINST & PHP instruments found in the `project/instruments` directory.
    - Refer to the following guides for help.
        1. The [Instrument Insertion](https://github.com/aces/Loris/wiki/Instrument-Insertion) for PHP instruments.
        2. The [Creating and installing clinical instruments](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links) for LINST instruments.
    - To test an instrument:
        1. Register a candidate
        2. Create a timepoint
        3. Start its visit stage
        4. Enter sample data, testing each field's type and logic constraints
11. Verify Validity flags are functioning for instruments.
    - **Validity:** can be marked as “Valid”, “Questionable”, or “Invalid”. Whether or not this flag is shown for an instrument is by the boolean $ValidityEnabled. Whether the field is required before flagging an instrument as complete is determined by $ValidityRequired.
    - You can test the forgoing flags by switching the corresponding boolean of the test instruments to either `true` or `false`.

### Visit the Dashboard module.
   1. Dashboard Widget - "My Tasks" for Incomplete forms 
      - Ensure the total of Incomplete forms correspond with the correct 
            number of candidates inside the statistics/statistics_site module.
      - Click on the total number of Incomplete forms and check if redirection
            to the statistics/statistics_site module succeeds.

### Visit the Candidate Dashboard module.
   1. Candidate Widget - "Behavioural Data" for Candidate instruments entry.
      - Ensure the appropriate visit labels are visible for the candidate. 
      - The visit status, subproject status, site, date of visit, and age should be shown.
      - Clicking on a visit should redirect to the instrument_list module for the candidate.
      - Test making a new Time Point for a candidate and assign an instrument to the time point. 
        The Behavioural Data widget should update accordingly.
