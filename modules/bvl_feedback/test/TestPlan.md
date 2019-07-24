# Behavioural Feedback Test Plan

1. Behavioural feedback button (notepad in the toolbar) should show up on the following pages:
 * Candidate Profile
 * Instrument List
 * Any instrument
[Automation Test]
2. Remove 'bvl_feedback' permission by unchecking 'Behavioural QC' in the User Accounts module. Behavioural feedback button should no longer appear.
3. Click on the behavioural feedback button. A slide-out panel should appear on the right-hand side with the following:
 * Open Thread Summary
 * New profile level feedback
 * Feedback Threads
4. Click on the chevron arrow on each section and make sure it toggles open/closed.
5. Type something in the 'New profile level feedback' text box and choose a 'Feedback Type' from the dropdown. Click 'Save data'.
6. 'Open Thread Summary' and 'Feedback Threads' should update with the submitted thread. 
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
7. Click on the chevron next to the status. You should be able to see the original text box thread entry.
8. Click on the pencil button and 'Add a thread entry'. Click on 'Send'. Click on the chevron next to the status. You should be able to see the original text box thread entry and the one you just entered.
9. Click on 'opened' and choose a different status. Status should be updated.

