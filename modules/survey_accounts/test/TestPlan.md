# Survey Module Test Plan

1. Check user permission : Survey Participant Management
2. Selection Filter:  try filtering by PSCID, DCCID, Visit, and Instrument, ensure
3. Enter a PSCID, email, visit label and Instrument then use “Clear Form” : should show visit and instrument “All” and blank for PSCID and email
4. Ensure all columns are sortable (ascending and descendin.
5. Click on a URL fill out field, make sure “Save and Continue” works (if mandatory fields are not filled out make sure it doesn’t allow you to save.
   Make sure that if you don’t fill out a field that is required, and you hit save and continue fields you have filled out are not erased.
6. Add Survey button:
   a. Try sending the URL to yourself -  make sure that both email addresses match in order for the “Email Survey” button to work
      (try mismatched email addresses to make sure you get an error message if they do not match.
   b. Once you hit “Email Survey” you should get a blank page where you can customize an email to go along with the URL – enter in a message and make
      sure it sends (also try the cancel button on this page). The email can be pre-populated for each instrument using participant_emails table.
   c. Ensure that the instrument being sent is what you get (and that the URL brings you to the correct survey).
   d. Use the `Create Survey` button (no email address should be specified).
   e. Use the `Email survey` button by specifying email address.
   e. Try mismatched PSCID and DCCID and should get an error message.
   f. Try creating duplicate instrument for a candidate for a visit, should get an error message.
   g. Try creating instrument for a candidate in a non-existing visit, should get an error message.
7. Enable a new instrument for Survey module and verify survey can be created. (IsDirectEntry set to 1 in test_names table).
8. Test all functionality on multiple browsers ( Chrome and Firefox minimum).
