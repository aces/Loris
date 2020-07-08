# Behavioural Quality Control Test Plan

## [Automated testing](https://github.com/aces/Loris/blob/17.1-dev/modules/behavioural_qc/test/behavioural_qcTest.php) covers:
* Permissions (both present and absent)
* That body text exists

## Must be manually tested:
1. Access behavioural_qc module
2. Upon first loading, Site filter should be set to 'All Sites' if the user has 
'access_all_profiles' permission or 'All User Sites' otherwise.
3. Remove the 'access all profiles' permission and test whether the site filter is 
now populated only with sites that are study sites and to which the user has access.
4. Make sure that the user accessible site data is only populated with the  step 4 condition.
5. Ensure that Conflict/Incomplete Candidate/Link to BVL Feedback links point to the correct place.
6. Ensure that feedback status is correct.
7. Ensure that the behavioural_qc graphics is working according to the applied filters.
8. Click on a field label and ensure that it downloads CSV of the data.
9. Repeat steps 2-9 with applying all the filters.
10. Perform a query that returns a row with a link to BVL feedback. Click on the click to edit the feedback QC
   status and change its value. Save the data and close the popup. Make sure that the behavioural_qc result table has been 
   updated for that row (i.e. reflect the new Feedback status). Click on the feedback link again and check that 
   the QC status has also been updated in the popup window.  
