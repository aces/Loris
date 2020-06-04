# Survey Module Test Plan

1.  Check user permission: User Management.
    [Automation Testing]
2.  Selection Filter:  try filtering by PSCID, Visit, and Instrument.
    [Automation Testing]
3.  Enter a PSCID, email, visit label and Instrument then use “Clear Form”:
    should show visit and instrument “All” and blank for PSCID and email.
    [Automation Testing]
4.  Ensure all columns are sortable (ascending and descending).
    [Manual Testing]
5.  Click on a URL fill out field, make sure “Save and Continue” works
    (if mandatory fields are not filled out make sure it doesn’t allow you to save.
    Make sure that if you don’t fill out a field that is required,
    and you hit save and continue fields you have filled out are not erased.
    [Manual Testing]
6.  Add Survey button:
    a. Try sending the URL to yourself -  make sure that both email addresses match in order for the “Email Survey” button to work
      (try mismatched email addresses to make sure that the "Email Survey" button remains inactive).
    b. Once you hit “Email Survey” you should get a blank page where you can customize an email to go along with the URL –
    enter in a message and make sure it sends (also try the cancel button on this page).
    The email can be pre-populated for each instrument using participant_emails table.
    c. Ensure that the instrument being sent is what you get (and that the URL brings you to the correct survey).
    d. Use the `Create Survey` button (no email address should be specified).
    e. Use the `Email survey` button by specifying email address.
    f. Try mismatched PSCID and DCCID and should get an error message.
    g. Try creating duplicate instrument for a candidate for a visit, should get an error message.
    h. Try creating instrument for a candidate in a non-existing visit, should get an error message.
    [Manual Testing]
7.  Enable a new instrument for Survey module and verify survey can be created. (IsDirectEntry set to 1 in test_names table).
    [Manual Testing]
8.  Verify Status column in the module updates appropriately
    a. When survey is created Status should be set to `Created` when no email address is specified
      and should be set to `Sent` if email address is specified
    b. Status should be set to `In Progress` once the URL is accessed by user (or tester)
    c. Status should be set to `Complete` once the survey is completed by clicking on Submit Data button on the review page.
9.  Verify instrument is marked as `Complete` and Administration is set to `All` after step 8.c
    [Manual Testing]
10. Test all functionality on multiple browsers (Chrome and Firefox minimum).
    [Manual Testing]
