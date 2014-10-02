# Candidate Parameters Test Plan

1. Check Permissions. Try removing each of these permissions/conditions one at a time. You should not be able to access the page
	* data_entry
	* unsend_to_dcc
	* having the same site as the candidate you are accessing	
2. Make sure that the candidate date of birth and gender, shown in the table at the top of the page, match what is stored in the candidate table for this given candidate.
3. Click on the Return to Timepoint List button and ensure it goes to the correct timepoint list page.

### Candidate Information Panel
4. Confirm that all the fields in this panel correspond to what's stored in the candidate table.
	* PSCID
	* Caveat Emptor flag for Candidate
	* Reason for Caveat Emptor flag
	* Additional Comments for flag
	* Comment
5. Click on update Candidate Info and make sure it takes you to the correct form for that candidate

### Update Candidate Info
6. For each field, change it and make sure that it saves when the "Save" button is clicked. Do each field one at a time. Should you be able to save the Caveat Emptor Reason without the Caveat Emptor flag set?
7. Check that the return candidate info button is working.
8. Check if your changes are displayed in the Candidate Information panel

### Proband Information Panel
9. Check that the proband section only shows up if "show proband section..." is set to true in the configuration module.
10. Proband GUID, DoB Proband and Proband Gender should match what is stored in the candidate table. (Note: I don't even have Proband GUID in my table. It says "array" for this field on the module front-end. Perhaps it should take a different action.)
11. Check that the age difference in months between the candidate and proband is correct.
12. Remove the proband DoB. Check that the age difference field says that the age difference could not be calculated.
13. Click on Update Proband Info and make sure that it goes to the correct form for this candidate

### Update Proband Info
14. For each field, change it and make sure that it saves when the "Save" button is clicked. Do each field one at a time.
15. Try entering two different DoB and make sure an error appears if that is done.
16. Try entering only one DoB and make sure an error appears if that is done.
17. Try changing the DoB. Ensure that the age difference in the Proband Information Panel gets recalculated
19. Check that the return candidate info button is working and that any changes you have made are now showing up.

### Family Information Panel
19. Check that the family panel only shows up if "Use family ID" is set to true in the configuration module.
20. Check that these family members match what can be found in the family table.

### Add Family Info
21. Try changing the family member ID to an ID that does not exist and make sure that an error appears.
22. Try changing the family member ID to an ID that does exist. Save without specifying the relationship type. An error should appear.
23. Enter the candidate's DCCID as the family member ID. Enter a relationship type. Make sure that an error appears. 
24. Enter a valid DCCID as the family member ID and a relationship type. Check that these values are saved when the save button is clicked.
25. Check that the return candidate info button is working.
Note: Is there no way to edit/remove a family member from the front-end?

### Participant Status Panel
- show all history
- all fields displaying correctly

### Update Participant Status
- Change the participant status 
- Change the participant status to inactivate or incomplete and edit the specify reason input. Save the form and ensure that an error appears
- Try editing the Comments field and saving
- Specify reason should only come up when inactive/incomplete is there

### Participation Consent Status Panel
- Add a consent type like in the Developer's guide - does it show up here?
- are the fields right?

### Update Consent Info
Check that there is a set of form inputs for each type of consent. Add a new type of consent (by following the instructions in the Developer's guide for adding consent) and see that it appears here, with form inputs.
Try updating the consent information. Do not fill out all required fields. Ensure that an error appears when you try to save.
Try entering two different dates for the date of consent. Make sure that an error appears when you try to save.
Try entering two different dates for the date of withdrawal of consent. Make sure that an error appears when you try to save.
For each of the date fields, try entering only one part of the date (eg. the year). Make sure there is an error when you try to save.