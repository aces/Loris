# Candidate Parameters Test Plan

1. Check Permissions:
    * _candidate_parameter_view_ (_View Candidate Parameters_) permission (you should not be able to edit fields)
	* _candidate_parameter_edit_ (_Edit Candidate Parameters_) permission (you should be able to edit fields)
	* You need to belong to the same site as the candidate you are accessing, unless...
	* If you have _access_all_profiles_ you should be able to access all candidate profiles (even without candidate_parameters permissions)
2. Click on the *Return to Timepoint List* button and ensure it goes to the correct timepoint list page.
3. Make sure all tabs render.
4. Ensure you stay on the same tab when you refresh.
5. Ensure that you stay on the same page when clicking on the `Candidate Parameters` breadcrumb.

### Candidate Information Tab
6. Confirm that all the fields in this panel correspond to what's stored in the candidate table and the corresponding parameter_candidate.
	* PSCID
	* Caveat Emptor flag for Candidate
	* Reason for Caveat Emptor flag
	* Any other fields in `SELECT * FROM parameter_type WHERE ParameterTypeID IN (SELECT distinct(ptcr.ParameterTypeID) FROM parameter_type_category ptc JOIN parameter_type_category_rel ptcr USING (ParameterTypeCategoryID) WHERE ptc.NAME='Candidate Parameters');`
7. Change each field and click on *Update* and make sure it updates in the front-end and back-end.
8. If you set the *Caveat Emptor flag* to Yes, check that a reason must be specified. If the reason is set to 'Other', check that an explanation must be provided. If 'Other' does not exist as an option in the caveat_options table, the field should not show up in the front-end.
9. Add fields to the parameter_type table and check if it shows up on this page.

### Proband Information Tab
10. Check that the proband tab only shows up if _useProband_ is set to true in the configuration module.
11. Check that the age difference in months between the candidate and proband is correct and is updated if DoB Proband is updated.
12. Remove the proband DoB. Check that the age difference field says that the age difference could not be calculated.
13. For DoB fields:
    * 'Confirm DoB Proband' must be entered
    * 'Confirm DoB Proband' must match 'DoB Proband'
    * Cannot be later than today's date.
14. Click on Update and make sure it updates in the front-end and back-end.

### Family Information Tab
15. Check that the family tab only shows up if _Use family ID_ is set to true in the configuration module.
16. Check that these family members match what can be found in the family table.
17. Click on the add family button and ensure that it adds in the front-end and back-end.
18. Click on the DCCID and check that it takes you to the family member's candidate profile.
19. Try changing the family member ID without specifying the relationship type. An error should appear.
20. Ensure the candidate's DCCID cannot be chosen in the family member ID dropdown.
21. Try deleting a family member and check it is updated in the front-end and back-end.

### Participant Status Tab
22. Ensure that this panel shows all status changes for the participant.
23. Change the participant status and try to save it and check it is updated in the front-end (including the history table) and back-end.
24. Change the participant status to inactivate or incomplete and do not edit the specify reason input. Try saving the form and ensure that an error appears.
25. Try editing the Comments field and saving.

### Consent Status Tab
26. Check that the consent status tab only shows up if _useConsent_ is set to true in the configuration module.
27. Add a new consent type following [the guide](https://github.com/aces/Loris/wiki/Candidate-Information-Page) on the LORIS Wiki. Does it show up in this tab when you refresh the page?
28. Does the consent info shown in this tab match what is stored in the `consent` table?
29. Check that there is a set of form inputs for each type of consent. Does your new type of consent you just added appear here, with form inputs?
30. Try updating the consent information. Do not fill out all required fields. Ensure that an error appears when you try to save.
31. For each of the date fields, try entering only one part of the date (eg. the year). Make sure there is an error when you try to save.
32. Enter the following combinations:
    * Consent to Study = No  (error: must enter Date of 'No' Consent)
    * Consent to Study = Yes (error: must enter Date of 'Yes' Consent)
    * Consent to Study = Yes/No; Date of Consent = random date
        * Error: must enter Confirmation Date of Consent
        * Date (Withdrawal) of Consent & Confirmation Date (Withdrawal) of Consent is disabled.
    * Consent to Study = Yes/No; Date of Consent = random date after today; Confirmation Date of Consent = same random date
        * Error: date cannot be later than today
    * Consent to Study = No (changing/updating an already given 'Yes' consent);
        * Error: must enter Date (Withdrawal) of Consent and Confirmation Date (Withdrawal) of Consent
    * Consent to Study = No (changing/updating an already given 'Yes' consent);  Date (Withdrawal) of Consent = random date after today; Confirmation (Withdrawal) Date of Consent = same random date
        * Error: date cannot be later than today
    * Consent to Study = No (changing/updating an already existing 'Yes' consent); Date (Withdrawal) of Consent = valid random date; Confirmation (Withdrawal) Date of Consent = same random date
        * No error
        * Make sure they update properly in the front-end and backend

### Date of Birth Tab
33. Check that date of birth can only be amended if user has candidate_dob_edit permission.
34. Change the date of birth and try to save it. Check that it is updated on front-end and database.
35. Check that entering a date later than today gives a data entry error.
36. Check that the date stored matches the _DOB Format_ specified in the configuration module. 

### Date of Death Tab
37. Check that date of death can only be set if user has candidate_dod_edit permission.
38. Change the date of death and try to save it. Check that it is updated on front-end and database.
39. Check that entering a date of death before the date of birth gives a data entry error.
40. Check that entering a date later than today gives a data entry error.
41. Check that the date stored matches the _DOD Format_ specified in the configuration module.

## Widgets
42. Access a candidate in the `candidate_profile` module

### Candidate Info Widget terms

Within the "Candidate Info" card, after the information which
corresponds to the Candidate info returned by the LORIS API:

43. Verify that there is a "Participant Status" term with the candidate's
    status which matches the Parameter Status tab in the `candidate_parameters`
    module or "N/A" if there is no status for this candidate.
44. Verify that there is a "Caveat" term on the card with the
    description of the reason for a caveat which matches the
    Caveat Emptor flag of the "Candidate Info" tab of the
    `candidate_parameters` module, and that the term does *not*
    appear if the candidate does not have a caveat.
45. Verify that any terms from the "Candidate Parameters"
    `parameter_type_category` in step 5 of the test plan are displayed
    in the "Candidate Info" card.

### Consent Widget

46. With Consent configured in LORIS, verify that there is a
   "Consent" card in the Candidate Profile widget.
47. Verify that the card does *not* appear if Consent is
    not configured in LORIS.
48. With Consent configured in LORIS, ensure that all types
    of Consent are displayed in a table in the card, regardless
    of whether or not the candidate being viewed has any
    data for that consent type.
49. Verify that rows for both "Yes" and "No" are displayed
    properly in the table and match the "Consent" tab of
    the module.
50. Verify that a consent type which has no data saved
    for the candidate is displayed with an empty row in
    the table; the row should display only a dash.
