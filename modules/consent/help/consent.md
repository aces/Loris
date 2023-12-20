# Consent

This module allows you to view and edit candidate consent, as well as send and manage eConsent forms. 

Use the *Selection Filter* section to define your search. Results will appear in the data table below. 

If the consent row you need can not be found in the table, use the "Add Consent" button to add by consent form.

## Data table

Below is an explanation of the data table columns:

- *Consent Form*: Gives the name of the grouping of consent. One consent form may have several consent codes related to it. When sent as an eConsent form, the candidate will receive one link per consent form.
- *Consent Code*: Gives the name of the individual consent codes. Each consent code has its own consent status and dates associated to it.
- *Request Status*: This column relates only to eConsent forms. The request status indicates what stage the eConsent form is in. This includes the options Created, Sent, In Progress, Complete, or Expired.
- *Consent Status*: Indicates whether the candidate has given consent or not. If no answer has been given yet, the column will be blank.
- *Date Given*: The date that the candidate answered consent.
- *Date Withdrawn*: The date that the candidate changed their consent from "yes" to "no".
- *Date Sent*: The date that an eConsent form was sent to the participant from this module.
- *Patient Portal*: This column is only available for users with the "Edit Consent Module" permission. The column gives a link to the Patient Portal when an eConsent form has been set on Patient Portal.
- *Actions*: This column is only available for users with the "Edit Consent Module" permission. See below for a guide on the action options.

## Data table Actions

The action buttons are only available for users with the "Edit Consent Module" permission. Any action related to eConsent effects not only the row that it was called on, but any consent code related to the relevant consent form for that candidate.

1. *Edit consent*: This button looks like a square with a pencil inside. The edit button is always available if you have the permission. Click on this button to enter the candidate's consent for the given row and view the consent history.
2. *Add eConsent*: This button looks like a globe. The button is available if the given row is for a consent form that is compatible with eConsent, but has not yet been added as an eConsent form. By clicking this button and confirming, you will create the eConsent form and a unique link will exist that the participant can navigate to.
3. *Share eConsent*: This button looks like a square with an arrow exiting. There are three sharing options: 
	- *Copy link*: The link to the eConsent form will be copied to your clipboard
	- *Set on Patient Portal*: Only available if not already set on patient portal. You will be asked to enter an email that the participant can use as a password for the Patient Portal login page. The email is securely protected, and is not stored in plain text. A new unique key will also be generated. Any previous link to the eConsent form will no longer be valid.
	- *Send*: You will be asked to enter an email to send the eConsent form to. The email is securely protected, and is not stored in plain text. When submitting, the email to be used as a Patient Portal password will be updated in the database, and a new unique key will be created. Any previous link to the eConsent form will no longer be valid.
4. *Expire eConsent*: This button looks like a circle with an x inside. The action is available on any eConsent row for users with the "Edit Candidate Parameters" permission and "Edit Consent Module" permission. You will have two options in this action:
	- *Expire*: The consent form will be set to expired. The form will no longer be accessible for this candidate. If this is the only data set on the Patient Portal, the patient portal will no longer be accessible for this candidate. Once Expired, it is still possible to renew the eConsent form by using the Add eConsent action on any of the consent codes.
	- *Expire and Inactivate*: This action expires the eConsent form as above, but also sets the candidate's participant status to "inactive" in the database.
	