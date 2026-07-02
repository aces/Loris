# Behavioural Feedback Test Plan

The Behavioural Feedback module is located in Clinical -> Behavioural Quality Control -> Behavioural Feedback

1. Permissions
- Disable the module in the database:
- UPDATE modules SET Active = 'N' WHERE Name = 'bvl_feedback';
- Assert that 
- [] Behavioural Feedback: Create/Edit Feedback Threads does not appear in the user_accounts module.
- Re-Enable the module by setting Active to 'Y' and assert that the permission **does** appear in user_accounts
- Enable the following permissions in the front end:
- [x] Access Profile: Create/View Candidates and Timepoints
- [x] Candidate Parameters: View Candidate Information
- [x] Behavioural Quality Control: View Flagged Behavioural Entries
- Assert that, under the Clinical Tab in the website, 'Behavioural Quality Control' appears.
- Click on the `Behavioural Feedback` tab and click on an entry in the `Feedback Level` field.
- The behavioural feedback thread summary is a panel that "slides" out when you select an entry. So, with the Behavioural Feedback permission un-ticked, assert that this panel does not slide out. Instead, the candidate's linst instrument should appear without this window.
- Enable the Behavioural Feedback permission and assert that the panel does slide out.

2. Behavioural Feedback Sliding Panel
- Assert that the chevrons expand and collapse windows for `Open Thread Summary`, `New profile level feedback', and `Feedback Threads`

- In `Open Thread Summary`, click the `Instrument`. Assert that you are re-directed to the linst instrument page for this participant. 

- Click the notepad icon with pencil that is located in the top right corner of the blue LORIS horizontal menu bar next to the question mark. This will redirect you back to the behavioural feedback sliding panel for that participant.

- Again, in Open Thread Summary, click on `Visit` to be re-directed to /instrument_list. Click one the same notepad icon in the top right corner of LORIS to re-directed back to the behavioural feedback slide out pane.

- Assert that the icon appears in that top right corner in the following: a Candidate page, their instrument list, and a single instrument within that list.

- In `New instrument level feedback` pane, enter some random text in the text box, select the first items in `Field Name` and in `Feedback Type` and click on `Create Thread`. Assert that this thread appears in the `Feedback Threads` pane continaing the field names, your author name with timestamp, Status `Open`, and the text itself.

- Assert that this text has appeared as an entry in the feedback_bvl_entry table in the database.

- Assert also that an entry was made in `feedback_bvl_thread` references the thread's `FeedbackID`.

- Click on the pencil next to the entered text to modify the comment text. Click submit and assert that it has changed. Assert that it has also been updated in the feedback_bvl_thread table.

- Close the thread by selected `opened` in the `Status` section and assert that the button has now changed to `closed`.

Behavioural feedback button (notepad in the toolbar) should show up on the following pages:
 * Candidate Profile
 * Instrument List
 * Any instrument
[Automation Test]
2. Remove 'bvl_feedback' permission by unchecking 'Behavioural Feedback' in the User Accounts module. Behavioural feedback button should no longer appear.
3. Re-add bvl_feedback permission and disable bvl_feedback module. Behavioural feedback button should not appear.
4. Click on the behavioural feedback button. A slide-out panel should appear on the right-hand side with the following:
 * Open Thread Summary
 * New profile level feedback
 * Feedback Threads
5. Click on the chevron arrow on each section and make sure it toggles open/closed.
6. Type something in the 'New profile level feedback' text box and choose a 'Feedback Type' from the dropdown. Click 'Create thread'.
7. Make sure that the thread was inserted in the `feedback_bvl_thread` table, with `Feedback_level`: 'profile' and the correct `Feedback_type`.
   Also make sure that an appropriate `feedback_bvl_entry` was created that references the thread's `FeedbackID`.
8. 'Open Thread Summary' and 'Feedback Threads' should update with the submitted thread.
 * Open Thread Summary
    * QC class should be what page the feedback was submitted on (i.e. profile, instrument)
    * Instrument should be populated if QC class is instrument
    * Visit should be populated if QC class is not profile
    * "# Threads" should be the thread number
  * New visit level feedback
    * Should have "The new thread has been submitted" appear below the text box
  * Feedback threads
    * The Feedback Type should appear under 'Type'
    * Current user and date should appear under 'Author'
    * 'Status' should be set to 'opened'
9. You should be able to see the original text box thread entry. If you click the chevron the thread comments should be hidden.
10. Click on the comment icon and 'Add a comment'. Click on 'Submit'. You should be able to see the original text box thread entry and the one you just entered.
11. Click on 'opened' and choose a different status. Status should be updated.
12. Click on the pencil icon and you should be able to update the comment. 
13. Click on the delete icon and the comment should be deleted.
14. Make sure the update and delete operations are properly reflected in the `feedback_bvl_entry` table.

### Widget registration on the dashboard page

15. Verify that if a user has the 'bvl_feedback' permission, the latest Behavioural Feedback Notifications are displayed (4 at most) in the Behavioural Feedback panel. Clicking on a feedback thread will take you to the proper page.
16. Check that if a document notification occurred since the last login, it is labeled as 'New' in the Behavioural Feedback panel.
17. Check that a 'New' notification is not labeled 'New' anymore after login in again.
