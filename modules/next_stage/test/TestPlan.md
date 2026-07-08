This testplan tests the functionality of `start visit stage`. Start visit stage essentially creates an entry in the `session` table. 

## Permissions
### The Time Point Button

Make a user with the following permission:
- [x] Access Profile: Create/View Candidates and Timepoints - Own Sites
- Log into this user in an incognito window, mainting the admin user in a "normal" browser window
- In the user (non-admin), naviagate to Candidate -> New Profile
- Create a candidate
- Make note of the PSCID in the swalfire modal
- Once you close the modal, you will be redirected to the candidate's list of Visits (aka "Time Points"), where there are currently none. Assert that you see the button `Create Time Point`
- In the admin account, remove the Access Profile: Create/View Candidates and Timepoints - Own Sites permission for your user
- Hard Refresh your user's browser and assert that the button has disappeared
- In admin account, Re-administer the permission for this user
- In the user account, click on `Create Time Point` 
- In the provided fields, leave the visit label null
- Select the first option in all fields and click `Create Timepoint`
- Assert that you see an entry in your **List of Visits (Time Points)**
- Assert that the **Stage, Stage Status, Date of Stage** are all merged into a single value which states **Not Started**. This means that the stage for this candidate at the indicated visit is not yet started.
- Click on the blue link in the **Visit Label (Click to Open)** field and assert that you can see a **Start Visit Stage** link in the light blue sidebar with a folder icon.
- In the admin account, remove the permission again and save.
- Hard refresh the user account and assert that the icon has changed to **(No actions)**
- Check for an entry in the `session` table for this candidate using the sessionID in the URL and assert that the **Date_visit** value is NULL

## Start Stage

- Click "Start Visit Stage" on left of **instrument_list** and ensure that page renders.
- Enter values **01/01/2020** for **Date of Visit** and **01/01/2021** for **Retype Date of Visit**
- Assert that you get an error message **Both Date fields must match.** for this date mismatch
- Enter matching dates and start the visit stage. You will be redirected to a window indicating **Next stage started** in small regular text.
- Assert that the Date_visit field entry in the `session` table contains the date that you wrote in the above step

### Test Battery Age functionality
This section will test a timepoint where the age range is 40 to 50 years old. For the sake of isolating this test, the visit label will be set to NULL.

- First, check the table for other entries where **Visit_label** is NULL, and, if you find them, delete them.
- In /create_timepoint select the VisitLabel option **NULL** and assert that there is an orange line around the the field rectangle. 
- INSERT an entry into the **test_battery** table as follows:
- `INSERT INTO test_battery (Test_name, AgeMinDays, AgeMaxDays, Active, Stage, CohortID, Visit_label, CenterID, firstVisit, instr_order, DoubleDataEntryEnabled) VALUES (<existing_test_name>, 480,600, 'Y','Visit', <existing_cohort_id>, NULL, <existing_CenterID>, NULL, NULL, 'N');`
- Create a candidate who is between these ages (approx 40-60 y/o).
- Create a Time point with the visit label associated with this entry into session.
- Click on the link and assert that the instrument that you inserted into the test_battery appears.This means that the instrument was correctly assigned based on age.


6. Create a timepoint where there is a `test_battery` entry for the
   `Visit_label` and `cohortID`, and start the stage. Ensure that those 
   were inserted into the battery, and NOT the ones based on age (when 
   `Visit_label` is NULL).
   [Manual Testing]

   ## First Visit Functionality
7. Ensure that any instruments in `test_battery` with firstVisit='Y' where
   inserted if and only if it's the first timepoint started. Ensure that
   firstVisit='N' instruments are inserted if and only if it is NOT the
   first timepoint started, and firstVisit=null whether or not it's the
   first time point.
   [Manual Testing]
8. Ensure that if a CenterID is set for a row in the test battery, the
   instrument is inserted for candidates at that centerID (if `Age` is 
   correct and `Visit_label` is NULL or identical to the timepoint's one), 
   and not other centers.
   [Manual Testing]
9. Ensure that if Active='N' for an instrument in the `test_battery` it is
   NOT inserted even if other criteria pass.
   [Manual Testing]
