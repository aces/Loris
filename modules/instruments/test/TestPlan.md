# Instrument Test Plan

1. Verify that in order to access the module, the user must either have the `Across all sites access
candidate profiles` permission, or have the 'Edit Candidate Parameters' permission and be at the same
site as the visit, or at the same site as one of the candidate's other visits.
2. Select and instrument in the list of the session instruments. Note that the visit's stage should
be at 'Visit'.
3. Ensure that the candidate info at the top (DoB, EDC, ...) are correct.
In the instrument's medical history section, enter a date in the future and click on the 'save data'
button. You should have an error message stating that the date is in the future.
4. Try to save the instruments without an examiner. You should have a box specifying that 
'an examiner is required'.
5. If the instrument have multiple pages (on the left pane), move from page to page and check that the
saved data stay the same. The data that wasn't saved should be lost.
6. Make sure that the 'Delete instrument data' button on the left pane is only visible when the user
have the 'Send to DCC' permission.
7. Click on the 'Delete instrument data' button and check if the instrument's data is cleared.

