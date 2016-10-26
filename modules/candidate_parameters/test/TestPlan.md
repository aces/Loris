# Candidate Parameters Test Plan

1. Check Permissions. You should not be able to access the page
    * without Edit Candidate Parameters permission (you should be able to edit fields)
	* without View Candidate Parameters permission (you should not be able to edit fields)
	* if you don't have the same site as the candidate you are accessing	
2. Make sure that the candidate date of birth and gender, shown in the table at the top of the page, match what is stored in the candidate table for this given candidate.
3. Click on the Return to Timepoint List button and ensure it goes to the correct timepoint list page.
4. Make sure all tabs render. Ensure you stay on the same tab when you refresh.

### Candidate Information Tab
5. Confirm that all the fields in this panel correspond to what's stored in the candidate table and the corresponding parameter_candidate.
	* PSCID
	* Caveat Emptor flag for Candidate
	* Reason for Caveat Emptor flag
	* Comment (if it exists in parameter_type)
        * Plan (if it exists in parameter_type)
6. Change each field and click on Update and make sure it updates in the front-end and back-end
7. If you set the Caveat Emptor flag to Yes, check that a reason must be specified. If the reason is set to 'Other', check that an explanation must be provided. If 'Other' does not exist as an option in the caveat_options table, the field should not show up in the front-end.
8. Add fields to the parameter_candidate table and check if it shows up on this page

### Proband Information Tab
9. Check that the proband tab only shows up if "useProband" is set to true in the configuration module.
10. Check that the age difference in months between the candidate and proband is correct and is updated if DoB Proband is updated.
11. Remove the proband DoB. Check that the age difference field says that the age difference could not be calculated.
12. Make sure that the "Confirm DoB Proband" must be entered and must match "DoB Probend" and cannot be later than today's date.
13. Click on Update and make sure it updates in the front-end and back-end

### Family Information Tab
14. Check that the family tab only shows up if "Use family ID" is set to true in the configuration module.
15. Check that these family members match what can be found in the family table.
16. Click on the add family button and ensure that it adds in the front-end and back-end.
17. Click on the DCCID and check that it takes you to the family member's candidate profile.
18. Try changing the family member ID without specifying the relationship type. An error should appear.
19. Ensure the candidate's DCCID cannot be chosen in the family member ID dropdown.
20. Try deleting a family member and check it is updated in the front-end and back-end.

### Participant Status Tab
21. Ensure that this panel shows all status changes for the participant
22. Change the participant status and try to save it and check it is updated in the front-end and back-end.
23. Change the participant status to inactivate or incomplete and do not edit the specify reason input. Try saving the form and ensure that an error appears
24. Try editing the Comments field and saving

### Consent Status Tab
25. Check that the consent status tab only shows up if `<useConsent>true</useConsent>` in the config.xml.
26. Add a new consent type following [the guide](https://github.com/aces/Loris/wiki/Candidate-Information-Page) on the LORIS Wiki. Does it show up in this tab when you refresh the page?
27. Does the consent info shown in this table match what is stored in the participant_status table?
28. Check that there is a set of form inputs for each type of consent. Does your new type of consent you just added appear here, with form inputs?
29. Try updating the consent information. Do not fill out all required fields. Ensure that an error appears when you try to save.
30. Try entering two different dates for the date of consent. Make sure that an error appears when you try to save.
31. Try entering two different dates for the date of withdrawal of consent. Make sure that an error appears when you try to save.
32. For each of the date fields, try entering only one part of the date (eg. the year). Make sure there is an error when you try to save.
