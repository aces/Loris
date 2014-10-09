#Test Plan: Behavioural Feedback module (pop-up)

## Module mechanics: 
1. Verify that clicking pencil icon in top menu bar will pop up BVL Feedback window and display appropriate content from and BVL Candidate/Timepoint/Instrument/Subtest page
2. Verify that clicking "Stop this window from popping up" will stop the pop-up from re-appearing
3. Verify that upon clicking the pencil icon again, the bvl feedback pop-up re-appears and behaves normall (per 4,5 below)

Pop-up and main window content should be synced throughout the BVL side of Loris:
4. Verify that upon clicking a link in feedback window (to an instrument, timepoint), main Loris browser window will reload with appropriate page (e.g. aosi form).  Verify this works moving through various links/levels e.g. candidate list, timepoint list, instrument list and back again.  
5. Verify that when navigating from candidate list to timepoint list to instrument list to instrument forms, and back and forth, in the main Loris browser window - Feedback window should reload to follow with appropriate feedback detail/links at each level.

## Content display:
6. Verify that all feedback threads/data are accurate at candidate-list, timepoint-list, instrument-list and instrument-form levels, on several candidates.  Compare to back-end table contents. 
7. Is feedback status accurate in Feedback columns in Candidate List, Timepoint List, and INstrument list pages?  Does it change when Feedback status changes?   
8. Verify that links work inside Bvl Feedback popup window for/on DCCID, visit label, instrument etc

## Permissions: 
9. Verify that own-site feedback data Viewable IFF has permission ? no restrictions at present
10. Verify that own-site feedback data Editable IFF has permission bvl_feedback
11. Verify that Other sites feedback data viewable IFF has permission:access_all_profiles
12. Verify that Other sites feedback data editable IFF has permission:access_all_profiles ** should be changed to superuser

## Creating/Editing feedback threads: 
13. Create new feedback thread.  Does it save? Does it display in table at bottom?
14. Verify that adding a new feedback thread will not save if Comment field is blank - should give error message and not save. 
15. Change type of feedback in an existing thread - does it save? 
16. Verify that adding a new comment to an existing thread does not overwrite old comments. After saving should appear in table below, organized with previous entries for that thread (not just in chronological order as most recent feedback update). 
17. Change QC status. Does it save?
18. Change Action Required status. Does it work?
19. Make sure dropdowns are populated with appropriate data e.g. instrument field names.
20. "Close all threads" button (doesn't actually work but not sure this features is desirable anymore - no need to flag for bug fixes for now)
