# Data Team Helper Test Plan:

## Automated testing covers:
* Permissions (both present and absent)
* That body text exists

## Must be manually tested:
1. Access data_team_helper module
2. Choose a visit label and instrument and click "Show Data"
3. Ensure that Conflict/Incomplete Candidate/Link to BVL Feedback links point to the correct place.
4. Ensure that feedback status is correct.
5. Ensure that Current data_entry status percentage is correct for the given visit.
6. Click on a field label and ensure that it downloads CSV of the data.
7. Select "All Instruments" for a visit label and repeat steps 3-5
8. Perform a query that returns a row with a link to BVL feedback. Click on the click to edit the feedback QC
   status and change its value. Save the data and close the popup. Make sure that the DQH result table has been 
   updated for that row (i.e. reflect the new Feedback status). Click on the feedback link again and check that 
   the QC status has also been updated in the popup window. 
