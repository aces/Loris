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
7. If you set the Caveat Emptor flag to Yes, check that a reason must be specified. If the reason is set to other, check that an explanation must be provided.
8. Check that the return candidate info button is working.
9. Check if your changes are displayed in the Candidate Information panel
10. Add fields to the parameter_candidate table and check if it shows up on this page

### Proband Information Panel
11. Check that the proband section only shows up if "show proband section..." is set to true in the configuration module.
12. Proband GUID, DoB Proband and Proband Gender should match what is stored in the candidate table. (Note: I don't even have Proband GUID in my table. It says "array" for this field on the module front-end. Perhaps it should take a different action.)
13. Check that the age difference in months between the candidate and proband is correct.
14. Remove the proband DoB. Check that the age difference field says that the age difference could not be calculated.
15. Click on Update Proband Info and make sure that it goes to the correct form for this candidate

### Update Proband Info
16. For each field, change it and make sure that it saves when the "Save" button is clicked. Do each field one at a time.
17. Try entering two different DoB and make sure an error appears if that is done.
18. Try entering only one DoB and make sure an error appears if that is done.
19. Try changing the DoB. Ensure that the age difference in the Proband Information Panel gets recalculated
20. Check that the return candidate info button is working and that any changes you have made are now showing up.

### Family Information Panel
21. Check that the family panel only shows up if "Use family ID" is set to true in the configuration module.
22. Check that these family members match what can be found in the family table.
23. Click on the add family button and ensure that it takes you to the appropriate form.
24. Click on the DCCID and check that it takes you to the family members candidate profile.

### Add Family Info
25. Try changing the family member ID to an ID that does not exist and make sure that an error appears.
26. Try changing the family member ID to an ID that does exist. Save without specifying the relationship type. An error should appear.
27. Enter the candidate's DCCID as the family member ID. Enter a relationship type. Make sure that an error appears. 
28. Enter a valid DCCID as the family member ID and a relationship type. Check that these values are saved when the save button is clicked.
29. Check that the return candidate info button is working.
Note: Is there no way to edit/remove a family member from the front-end?

### Participant Status Panel
30. Ensure that this panel shows all status changes for the participant
31. Click on the update participant status button and ensure that it takes you to the appropriate form. 

### Update Participant Status
32. Change the participant status and try to save it. See if it is successful.
33. Change the participant status to inactivate or incomplete and do not edit the specify reason input. Try saving the form and ensure that an error appears
34. Try editing the Comments field and saving

### Participation Consent Status Panel
35. Add a new consent type following the Developer's guide. Does it show up in this panel when you refresh the page?
36. Does the consent info shown in this table match what is stroed in the participant_status table?

### Update Consent Info
37. Check that there is a set of form inputs for each type of consent. Does your new type of consent you just added appear here, with form inputs?
38. Try updating the consent information. Do not fill out all required fields. Ensure that an error appears when you try to save.
39. Try entering two different dates for the date of consent. Make sure that an error appears when you try to save.
40. Try entering two different dates for the date of withdrawal of consent. Make sure that an error appears when you try to save.
41. For each of the date fields, try entering only one part of the date (eg. the year). Make sure there is an error when you try to save.