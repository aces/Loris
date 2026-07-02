The Behavioural Feedback module is located in Clinical -> Behavioural Quality Control -> Behavioural Feedback

## Permissions

- Disable the module in the database:
- UPDATE modules SET Active = 'N' WHERE Name = 'bvl_feedback';
- Assert that Behavioural Feedback: Create/Edit Feedback Threads does not appear in the user_accounts module.
- Re-Enable the module by setting Active to 'Y'
- Assert that the permission **does** appear in user_accounts
- Enable the following permissions:
- [x] Access Profile: Create/View Candidates and Timepoints
- [x] Candidate Parameters: View Candidate Information
- [x] Behavioural Quality Control: View Flagged Behavioural Entries
- Assert that, under the Clinical Tab in the website, 'Behavioural Quality Control' appears.
- Click on the `Behavioural Feedback` tab and click on an entry in the `Feedback Level` field.
- The behavioural feedback thread summary is a panel that "slides" out when you select an entry. So, with the Behavioural Feedback permission un-ticked, assert that this panel does not slide out. Instead, the candidate's linst instrument should appear without this window.
- Assert that a notepad icon (with the pencil) does **not** appear  next to the question mark in LORIS main blue horizontal tool bar at the top right hand corner.
- [x] Behavioural Feedback: Create/Edit Feedback Threads
- Enable the Behavioural Feedback permission and assert that the panel does slide out.

## Behavioural Feedback Sliding Panel

- Behavioural Feedback is sought in three different classes: `Profile` is feedback of the candidate page, `Visit`, the list of their instruments in a visit, and finally, `Instrument`, the instrument page itself. In this portion of the test, you will create 5 threads for 1 participant.

- Assert that the chevrons expand and collapse windows for `Open Thread Summary`, `New profile level feedback', and `Feedback Threads`

### QC Class: Profile

- Navigate to Access Profile and select a candidate with some visits and tests. Return to the candidate page and assert that the notepad with pencil icon appears in the top right corner of the horitzontal blue bar, next to the question mark.
- Click the notepad and register a feedback entry.
- Assert that, in the Open Thread Summary, an entry was made with QC class 'Profile'
- Repeat the previous steps, thereby registering a new entry under QC class 'Profile'
- Assert that the # Threads for this QC Class = 2.

### QC Class: Visit 

- Select a Visit for this participant
- Click the notepad-pencil icon
- Make an Entry
- Assert that, in the Open Thread Summary, and entry was made with QC Class, 'Visit'.

### QC Class: Instrument

- Select an Instrument for this participant
- Click the notepad pencil icon and make an entry
- Assert that, in the Open Thread Summary, an entry was made with QC class 'Instrument'
- Repeat the previous steps, registering a second entry under QC Class `Instrument`

### Database Tables

- Assert that your 5 entries appear in the feedback_bvl_entry table in the database.
- Assert these appear in `feedback_bvl_thread` and theat they reference the thread's `FeedbackID`.

### Update
- Click on the pencil next to the entered text to modify the comment text. 
- Select submit and assert that it has changed. 
- Assert that it has also been updated in the feedback_bvl_thread table.
- Close the thread by selected `opened` in the `Status` section and 
- Assert that the button has now changed to `closed`.
- Verify these changes in the database table `feedback_bvl_thread`
- Close a thread and verify that is marked `closed` in the database


### On the dashboard

- Assert that if a user has the 'bvl_feedback' permission, the latest Behavioural Feedback Notifications are displayed (4 at most) in the Behavioural Feedback panel. Clicking on a feedback thread will redirect you to the feedback
- Assert that if a document notification occurred since the last login, it is labeled as 'New' in the Behavioural Feedback panel.
- Assert that a 'New' notification is not labeled 'New' anymore after login in again.
