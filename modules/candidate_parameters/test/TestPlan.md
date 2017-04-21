# Candidate Parameters Test Plan

1. Check Permissions:
    * _candidate_parameter_view_ (_Edit Candidate Parameters_) permission (you should be able to edit fields)
	* _candidate_parameter_edit_ (_View Candidate Parameters_) permission (you should not be able to edit fields)
	* You need to belong to the same site as the candidate you are accessing, unless...
	* If you have _access_all_profiles_ you should be able to access all candidate profiles (even without candidate_parameters permissions)
2. Make sure that the candidate date of birth and gender in the table at the top of the page, match what is stored in the candidate table for this given candidate.
3. Click on the *Return to Timepoint List* button and ensure it goes to the correct timepoint list page.
4. Make sure all tabs render. 
5. Ensure you stay on the same tab when you refresh.

### Candidate Information Tab
1. Confirm that all the fields in this panel correspond to what's stored in the candidate table and the corresponding parameter_candidate.
	* PSCID
	* Caveat Emptor flag for Candidate
	* Reason for Caveat Emptor flag
	* Any other fields in `SELECT * FROM parameter_type WHERE ParameterTypeID IN (SELECT distinct(ptcr.ParameterTypeID) FROM parameter_type_category ptc JOIN parameter_type_category_rel ptcr USING (ParameterTypeCategoryID) WHERE ptc.NAME='Candidate Parameters');`
2. Change each field and click on *Update* and make sure it updates in the front-end and back-end.
3. If you set the *Caveat Emptor flag* to Yes, check that a reason must be specified. If the reason is set to 'Other', check that an explanation must be provided. If 'Other' does not exist as an option in the caveat_options table, the field should not show up in the front-end.
4. Add fields to the parameter_type table and check if it shows up on this page.

### Proband Information Tab
1. Check that the proband tab only shows up if _useProband_ is set to true in the configuration module.
2. Check that the age difference in months between the candidate and proband is correct and is updated if DoB Proband is updated.
3. Remove the proband DoB. Check that the age difference field says that the age difference could not be calculated.
4. For DoB fields:
    * 'Confirm DoB Proband' must be entered
    * 'Confirm DoB Proband' must match 'DoB Proband'
    * Cannot be later than today's date.
5. Click on Update and make sure it updates in the front-end and back-end.

### Family Information Tab
1. Check that the family tab only shows up if _Use family ID_ is set to true in the configuration module.
2. Check that these family members match what can be found in the family table.
3. Click on the add family button and ensure that it adds in the front-end and back-end.
4. Click on the DCCID and check that it takes you to the family member's candidate profile.
5. Try changing the family member ID without specifying the relationship type. An error should appear.
6. Ensure the candidate's DCCID cannot be chosen in the family member ID dropdown.
7. Try deleting a family member and check it is updated in the front-end and back-end.

### Participant Status Tab
1. Ensure that this panel shows all status changes for the participant.
2. Change the participant status and try to save it and check it is updated in the front-end (including the history table) and back-end.
3. Change the participant status to inactivate or incomplete and do not edit the specify reason input. Try saving the form and ensure that an error appears.
4. Try editing the Comments field and saving.

### Consent Status Tab
1. Check that the consent status tab only shows up if `<useConsent>true</useConsent>` in the config.xml.
2. Tab should render with only one consent type.
3. Add a new consent type following [the guide](https://github.com/aces/Loris/wiki/Candidate-Information-Page) on the LORIS Wiki. Does it show up in this tab when you refresh the page?
4. Does the consent info shown in this table match what is stored in the participant_status table?
5. Check that there is a set of form inputs for each type of consent. Does your new type of consent you just added appear here, with form inputs?
6. Try updating the consent information. Do not fill out all required fields. Ensure that an error appears when you try to save.
7. For each of the date fields, try entering only one part of the date (eg. the year). Make sure there is an error when you try to save.
8. Enter the following combinations:
    * Consent to Study = No
    * Consent to Study = Yes (error: must enter Date of Consent)
    * Consent to Study = Yes; Date of Consent = random date
        * Error: must enter Confirmation Date of Consent
    * Consent to Study = Yes; Date (Withdrawal) of Consent = random date; Confirmation Date (Withdrawal) of Consent = a different random date
        * Error: dates do not match
    * Consent to Study = Yes; Date (Withdrawal) of Consent = random date after today; Confirmation (Withdrawal) Date of Consent = same random date
        Error: date cannot be later than today
    * Consent to Study = Yes; Date (Withdrawal) of Consent = valid random date; Confirmation (Withdrawal) Date of Consent = same random date
        * No error
        * Make sure they update properly in the front-end and backend 
    * Consent_status = No; Date of Consent = valid random date; Confirmation Date of Consent = same random date
        * No error
        * Make sure they update properly in the front-end and backend (dates should not save)
    
### Monitoring Status Tab
1. Check that the monitoring status tab only shows up if `useMonitoring:true` in the Config table.
2. Tab should render with only timepoints already created for this candidate
3. Check that the information displayed for each timepoint corresponds to the data in the `monitoring` table in the database.
4. Check that the information displayed in the history section corresponds to the data in the `monitoring_history` table in the database.
5. Check that each timepoint has the following fields: 
   * `Visit` yes/no drop-down for flagging
   * `Monitored` yes/no drop-down 
   * `Date monitored` date field 'YMd'
   * `Date monitored_confirmation` date field 'YMd'
   * `Monitored by` drop-down of all examiners  
6. Try updating the the flag information for a timepoint. Make sure form only saves when all required fields are filled (indicated by red stars).
7. When `flag` is set to 'No' make sure all subsequent fields are disabled.
8. When `flag` is set to 'Yes' make sure the `Monitored` field is required.
9. When `Monitored` is set to 'Yes' make sure all subsequent fields are required.
10. Check that all updates are recorded in the history area at the bottom of the page.