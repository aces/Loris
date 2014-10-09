Test Plan: Behavioural Feedback module (pop-up)

## Module mechanics: 
1. Verify that clicking pencil icon in top menu bar will pop up BVL Feedback window and display appropriate content from and BVL Candidate/Timepoint/Instrument/Subtest page
2. Verify that clicking "Stop this window from popping up" will stop the pop-up from re-appearing
3. Verify that upon clicking a link in feedback window (to an instrument, timepoint), main Loris browser window will reload with appropriate page (e.g. aosi form).  Verify this works moving through various links/levels e.g. candidate list, timepoint list, instrument list and back again.
4. Verify that when navigating from candidate list to timepoint list to instrument list to instrument forms, and back and forth, in the main Loris browser window - Feedback window should reload to follow with appropriate feedback detail/links at each level. 

## Content display:
5. Verify that all feedback threads/data are accurate at candidate-list, timepoint-list, instrument-list and instrument-form levels, on several candidates.  Compare to back-end table contents. 
6. Is feedback status accurate in Feedback columns in Candidate List, Timepoint List, and INstrument list pages?  Does it change when Feedback status changes?   
7. Verify that links work inside Bvl Feedback popup window for/on DCCID, visit label, instrument etc

## Permissions: 
7. Verify that own-site feedback data Viewable IFF has permission ? no restrictions at present
8. Verify that own-site feedback data Editable IFF has permission bvl_feedback
9. Verify that Other sites feedback data viewable IFF has permission:access_all_profiles
10. Verify that Other sites feedback data editable IFF has permission:access_all_profiles ** should be changed to superuser

## Creating/Editing feedback threads: 
11. Create new feedback thread.  Does it save? Does it display in table at bottom?
12. Verify that adding a new feedback thread will not save if Comment field is blank - should give error message and not save. 
13. Change type of feedback in an existing thread - does it save? 
14. Verify that adding a new comment to an existing thread does not overwrite old comments. After saving should appear in table below, organized with previous entries for that thread (not just in chronological order as most recent feedback update). 
13. Change QC status. Does it save?
14. Change Action Required status. Does it work?
15. Make sure dropdowns are populated with appropriate data e.g. instrument field names.
16. "Close all threads" button (should work but clearly doesnt actually) 
