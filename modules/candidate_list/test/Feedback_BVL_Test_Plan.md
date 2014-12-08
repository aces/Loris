#Test Plan: Behavioural (BVL) Feedback module (pop-up)
*Note: this file is stored in modules/candidate_list/test/ for now.*

## Module mechanics: 
1. Verify that clicking pencil icon in top menu bar will pop up BVL Feedback window and display appropriate content from and BVL Candidate/Timepoint/Instrument/Subtest page
2. Verify that upon clicking the pencil icon again, the bvl feedback pop-up re-appears and behaves normally as you navigate through Loris's BVL side (per Synced content section below)

## Synced content - Pop-up and main window content
3. Verify that upon clicking a link in feedback window (to an instrument, timepoint), main Loris browser window will reload with appropriate page (e.g. aosi form).  Verify this works moving through various links/levels e.g. candidate list, timepoint list, instrument list and back again.  
4. Verify that when navigating from candidate list to timepoint list to instrument list to instrument forms, and back and forth, in the main Loris browser window - Feedback window should reload to follow with appropriate feedback detail/links at each level.

## Content display:
5. Verify that all feedback threads/data are accurate at candidate-list, timepoint-list, instrument-list and instrument-form levels, on several candidates.  Compare to back-end table contents. 
6. Is feedback status accurate in Feedback columns in Candidate List, Timepoint List, and INstrument list pages?  Does it change when Feedback status changes?   
7. Verify that links work inside Bvl Feedback popup window for/on DCCID, visit label, instrument etc

## Permissions: 
*This section should be revisited when permissions are re-done.  Soon.*

8. Verify that own-site feedback data is Viewable { to everyone - no permission restrictions at present. Try accessing via Stats Bvl/Completion links. These permissions should be fixed.}
 
9. Verify that own-site feedback data Editable IFF has permission bvl_feedback

10. Verify that Other sites feedback data viewable IFF has permission:access_all_profiles

11. Verify that Other sites feedback data editable IFF has permission:access_all_profiles ** should be changed to superuser

## Creating/Editing feedback threads: 
12. Create new feedback thread.  Does it save? Does it display in table at bottom?
13. Verify that adding a new feedback thread will not save if Comment field is blank - should give error message and not save. 
14. Change type of feedback in an existing thread - does it save? 
15. Verify that adding a new comment to an existing thread does not overwrite old comments. After saving should appear in table below, organized with previous entries for that thread (not just in chronological order as most recent feedback update). 
16. Change QC status. Does it save?
17. Change Action Required status. Does it work?
18. Make sure dropdowns are populated with appropriate data e.g. instrument field names.
19. "Close all threads" button (doesn't actually work but not sure this features is desirable anymore - no need to flag for bug fixes for now)
