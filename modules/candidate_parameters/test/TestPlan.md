Candidate Parameters Test Plan

1. Check Permissions
	These are the permissions needed: 
		- data_entry
		- unsend_to_dcc
		- having the same site as the candidate you are accessing
	Try removing each of these permissions/conditions one at a time. You should not be able to access the page
2. Make sure that the candidate date of birth and gender, shown in the table at the top of the page, are correct
3. Click on the Return to Timepoint List button and ensure it goes to the correct timepoint list page

-- Candidate Information Panel --
4. Confirm that all the fields in this panel correspond to what's stored
	- PSCID
	- Caveat Emptor flag for Candidate
	- Reason for Caveat Emptor flag
	- Additional Comments for flag
	- Comment
5. Click on update Candidate Info and make sure it takes you to the correct form for that candidate

-- Update Candidate Info --
6. For each field, change it and make sure that it saves when the "Save" button is clicked. Do each field one at a time.
7. Should you be able to save the Caveat Emptor Reason without the Caveat Emptor flag set? 

-- Proband Information Panel --
8. Check that the proband section only shows up if "show proband section..." is set to true.
9. Proband GUID, DoB Proband and Proband Gender should match what is stored in the candidate table.
10. Check that the age difference in months between the candidate and proband is correct.
11. Remove the proband DoB. Check that the age difference field says that the age difference could not be calculated.
12. Click on Update Proband Info and make sure that it goes to the correct form for this candidate

-- Update Proband Info --
13. For each field, change it and make sure that it saves when the "Save" button is clicked. Do each field one at a time.
14. Try entering two different DoB and make sure an error appears if that is done.
15. Try entering only one DoB and make sure an error appears if that is done.
16. Try changing the DoB. Ensure that the age difference in the Proband Information Panel gets recalculated

-- Participant Status Panel --
- show all history
- all fields displaying correctly

-- Update Participant Status
- Change all fields separately, see if they save properly
- Specify reason only comes up when incomplete/inactive is there

-- Participation Consent Status Panel --
- show all types of consent 