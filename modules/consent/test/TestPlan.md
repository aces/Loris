# Consent Test Plan

1. Menu item and permissions
    1. Menu item 'Admin > Consent' appears for users with permission 'access_all_profiles', 'consent_view', 'consent_edit'
    2. Menu item loads the module page
    3. If you are accessing the module without 'consent_edit' permission, you should not see the "Add consent" button, the action column of the table, and none of the eConsent forms should be clickable. 
2. Verify the following for the "Add Consent" button
    1. Make sure that form loads
    2. Make sure that you can not submit without any of the required fields
    3. Having mismatching DCCID / PSCID should give a descriptive error
    4. If the form you click on is an eConsent form, a checkbox should pop up saying "Add as eConsent?""
    5. If you check the "Add as eConsent" checkbox, Email fields and the option to send should pop up.
    6. If sending, make sure that you can not send without emails entered, and that the emails have to be valid and matching. Send to yourself and make sure you receive the email (check that emails are set up on your server)
    7. All consent codes relevant to the consent form selected should be added as rows in the data table after creating (or sending if relevant). After being created, Consent Status, Date Given, Date withdrawn, Date Sent should all be blank. Request Status should be "NA" if not eConsent, "Created" if eConsent but not sent, and "Sent" if eConsent and sent.
    8. If creating as eConsent, check that a entry in direct_consent exists for the candidate / form.
3. Edit button
    1. The edit button should be available in the "Actions" column for every row as long as you have the 'consent-edit' permission.
    2. Click on the edit button and make sure that form renders
    3. Check that the values pre-filled in the form are accurate
    4. Make changes to the form and submit
    4. Check that the history on the form is updated and accurate
4. Add as eConsent button
    1. Click on "Add Consent", and add a form that is eConsent compatible, but don't add as eConsent. In other words, add a form so that the "add as eConsent?" checkbox shows, but do not check the checkbox.
    2. Make sure that the globe button (add as eConsent button) shows in the action column for the respective row(s)
    3. Click on the button, and then click "Add as eConsent"
    4. Make sure that this added a new row in direct_consent table with a one time key
    5. Make sure that if the eConsent form's request status was previously set to "Expired" and the Consent Status had a non-null value, then re-adding as eConsent should nullify the Consent Status values.
5. Share button
    1. For a row that has been added as eConsent, make sure that the share button is available in the Actions column
    2. When clicking on the share button, a form should render with 2 subactions: "Copy link", "Send"
    3. Click copy link and make sure that the unique link to the eConsent form is copied to your clipboard
    3. Click "Send" and make sure that a form with email fields is rendered
    4. You should not be able to send without filling in both emails, having matching emails, and having valid emails
    5. Make sure that the form sends properly
    6. Check that a new one time key was generated after you clicked "send"
6. Expire button
    1. The expire button looks like an circle with an x in it. This button should be available for any eConsent row in the Actions column.
    2. Clicking on the expire form should render a form with two options: "expire", "expire and inactivate"
    3. When you expire an eConsent form, the Request status should change to "Expired", the trainingProgress and oneTimeKey columns in the direct_consent table should be reset to null.
    4. If you click "expire and inactivate", everything from 3. should be true, and the participant status should also be set to "inactive"

## eConsent Forms
1. Basic eConsent
    1. Add a form as eConsent that has an entry in the consent_display_rel table, and that does not have an entry for "training" in the consent_display table. (On raisinbread, this is the "Bakery Consent" form)
    2. Access the link to the form by either copying the link from the "Share" action, or clicking on the Consent Form name in the table
    3. Make sure that the form renders. Go into an icognito browser where you are not signed in to loris. Make sure that the form renders there too without being logged in.
    4. Try submitting the form without answering any of the consent question(s). Make sure you are given an error
    5. Fill out the consent and submit. Make sure that the Consent Status is properly updated in the candidate_consent_rel table for each of the consent codes, and the Request status from the direct_consent table is set to "Complete"
    6. After submitting, the consent questions should be disabled
2. Training eConsent
    1. Add a form as eConsent that has an entry in the consent_display_rel table, and that does have an entry for "training" in the consent_display table. (On raisinbread, this is the "Sourdough Starter eConsent" form)
    2. Access the link to the form by either copying the link from the "Share" action, or clicking on the Consent Form name in the table
    3. Make sure that the form renders. Go into an icognito browser where you are not signed in to loris. Make sure that the form renders there too without being logged in.
    4. On the home page you should see multiple clickable boxes. The consent box should be disabled
    5. Click on one of the boxes. Make sure that the "next", "previous", and "return to main page" buttons work correctly
    6. Navigate to a page with a quiz question.
    7. If there is a "next" page, make sure it is disabled if the question is not answered
    8. Try to click "Submit" on the quiz page without selecting an answer. You should get an error saying that you need to submit an answer
    9. Try to submit with an incorrect answer. You should get an error saying that it is the wrong answer.
    10. Try submitting with the correct answer. You should get a success pop up, and if there is a next page it should now be enabled.
    11. Check that the request status has been changed to "Complete". Make sure that you are able to exit and reload the form, and that it maintains your progress.
    12. Once all of the quiz sections in each information module is complete, the consent section on the main page should be enabled.
    13. Navigate to the consent section. If you reach a page with non-consent questions, make sure that you have to answer these questions before having access to consent.
    14. After you answer and submit the acknowledgement questions, navigate to the consent pages and answer and submit those as well.
    15. Make sure that the consent status saves properly (should be seen in the consent data table afterwards), and that the Request status is changed to "Complete" when all of the consent answers are completed.
    16. After submitting, all questions should be disabled


## Reset eConsent script
1. Run the eConsent_Reset.php script and make sure that it sets the trainingProgress to null for eConsent forms that have a "dateSent" that is passed the Reset_period_days value in the consent_display table.
