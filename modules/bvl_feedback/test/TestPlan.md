# Behavioural Feedback Test Plan

1. Behavioural feedback button (notepad in the toolbar) should show up on the following pages:
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
6. Type something in the 'New profile level feedback' text box and choose a 'Feedback Type' from the dropdown. Click 'Save data'.
7. 'Open Thread Summary' and 'Feedback Threads' should update with the submitted thread.
 * Open Thread Summary
    * QC class should be what page the feedback was submitted on (i.e. profile, instrument)
    * Instrument should be populated if QC class is instrument
    * Visit should be populated if QC class is not profile
    * "# Threads" should be the thread number
  * New visit level feedback
    * Should have "The new thread has been submitted" appear in the text box
  * Feedback threads
    * The Feedback Type should appear under 'Type'
    * Current user and date should appear under 'Author'
    * 'Status' should be set to 'opened'
8. Click on the chevron next to the status. You should be able to see the original text box thread entry.
9. Click on the pencil button and 'Add a thread entry'. Click on 'Send'. Click on the chevron next to the status. You should be able to see the original text box thread entry and the one you just entered.
10. Click on 'opened' and choose a different status. Status should be updated.

### Widget registration on the dashboard page

11. Verify that if a user has the 'bvl_feedback' permission, the latest Behavioural Feedback Notifications are displayed (4 at most) in the Behavioural Feedback panel. Clicking on a feedback thread will take you to the proper page.
12. Check that if a document notification occurred since the last login, it is labeled as 'New' in the Behavioural Feedback panel.
13. Check that a 'New' notification is not labeled 'New' anymore after login in again.
