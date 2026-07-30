This test plan tests the functionality of `start visit stage`. The latter part of the test requires database access. Start visit stage essentially creates an entry in the `session` table 

## Time Point Button

Make a user with the following permission:
- [x] Access Profile: Create/View Candidates and Timepoints - Own Sites
- Log into this user in an incognito window, maintianing the admin user in a "normal" browser window
- In the user (non-admin), navigate to Candidate -> New Profile
- Create a candidate and make note of the PSCID.
- Once you close the modal, you will be redirected to the candidate's list of Visits (aka "Time Points"), where there are currently none. Assert that you see the button `Create Time Point`
- In the admin account, remove the **Access Profile: Create/View Candidates and Timepoints Own Sites** permission for your user
- Hard Refresh your user's browser and assert that the button has disappeared

## Start Visit Stage Icon

In this section, you will test the activation and deactivation of the start stage icon in the blue side bar. It is small, says **Start Visit Stage** and has a folder icon. When deactivated, it says **(No Actions)**

- In admin account, Re-administer the **Access Profile** permission for this user
- In the user account, click on `Create Time Point` 
- Select the first option in all fields and click `Create Timepoint`
- Assert that you see an entry in your **List of Visits (Time Points)**
- Assert that the **Stage, Stage Status, Date of Stage** are all merged into a single value which states **Not Started**. This means that the stage for this candidate at the indicated visit is not yet started.
- Click on the blue link in the **Visit Label (Click to Open)** field and assert that you can see a **Start Visit Stage** link in the light blue sidebar next to a folder icon.
- In the admin account, remove the permission again and save.
- Hard refresh the user account and assert that the icon has changed to **(No actions)**

## Date
- Create a time point for a candidate click start visit stage
- enter no dates and click on `Start Visit`
- Assert that a red error message **Date is required.** appears 

## Matching dates

This section tests that the confirm date functionality works as intended.

- re-enable the permission
- Click "Start Visit Stage" on left of **instrument_list** and ensure that page renders.
- Enter values **01/01/2020** for **Date of Visit** and **01/01/2021** for **Retype Date of Visit**
- Assert that you get an error message **Both Date fields must match.** for this date mismatch
- Enter matching dates and start the visit stage. You will be redirected to a window indicating **Next stage started** in small regular text.
- Assert that the Date_visit field entry in the `session` table contains the date that you wrote in the above step.

## Test Battery filters

`In this part of the test, you will insert an instrument for a candidate, then delete it, then change some parameters, then re-insert and test filters.
 To do this, some CRUD operations are required. These are destrcutive, so, if you are doing this in a project context in a dev instance, it is recommended to reset your database after this test is complete.

### Prepare the candidate

- On a notepad or simple text editor, write down the following candidate information:

PSCID: <value>
DoB: <value>

- Select the first user from your candidate_list.
- Write down their PSCID.
- Ensure that this candidate has a date of birth (they may have been registered with EDC). 
- If they do not have a DoB, insert a value with `UPDATE candidate SET DoB = <value> WHERE PSCID = <value>;`
- Write down their DoB
- If a cohort is listed for this user, it implies that this user has at least one open session: delete it/them.

#### To delete them:

-  click the blue Visit Label link and copy the SessionID section from the browser URL.
- `DELETE * FROM session WHERE ID = <value>`;
- Repeat this step for any other sessions. 

### Prepare the instrument

- `SELECT * FROM test_battery;`
- Choose an instrument
- On the same notepad, write down the following test battery information:

Test_name : <value>
CohortID : <int value> <string value>
CenterID : <int value> <string value>
Project: <int_value> <str_value>
Visit_label: <value>
min age: <value>
max age <value>

- If the selected candidate's age is outside of the domain of min and max age, UPDATE the min and max age so that it is inside.
- DELETE all entries of **other instruments** with this visit label.
- You will assign *only* this instrument to this candidate: it will be the only instrument you see in instrument_list.

### Prepare cohort project and visit relational tables

- Visit labels are associated to Projects and Cohorts in **relational** tables: `project_cohort_rel` and `visit_project_cohort_rel`
- Ensure that the cohort and visit are associated to the project in these tables
- Delete the other entries

## Site filter

### Constrain your user to one site

- Return to the admin account
- Select your user
- Modify the multi-select for `Sites` to a single site.
- In SQL: `SELECT * FROM psc` 
- Write down the CenterID number for this site

### Assign instrument to candidate

#### Create Time Point

- Return to the browser where this user has an open session.
- Select Access Profile -> select the blue PSCID of this candidate -> Create Time Point.
- Enter the `Site`, 
`Project`, `Cohort` that you wrote down, the `Visit Label` that you wrote down, Language and click **Create Timepoint**.
- The modal will indicate that you have successfully created a Timepoint for this candidate
- copy the sessionID from the URL and paste it into your notepad.

#### Start Visit Stage

- Start the Visit Stage
- Enter your date of visit, retype and **Start Visit** -> **Click here to continue**
- Assert that the instrument has been assigned to the candidate.

#### Change site

- DELETE the session you just created. `DELETE FROM session WHERE ID = <value from notepad>;`
- UPDATE the CenterID field of the same test_battery entry with a CenterID your user does not have permission for.
- Repeat the above process, create the time point, start the visit stage, and assert that the instrument is not assigned

## Active Filter

- DELETE the session
- UPDATE the test_battery entry to the user's CenterID and Active = 'N';
- Create time point as above and start visit stage and assert that the instrument is not assigned

## Age filter

- DELETE the session
- Set Active = 'Y'
- Set AgeMindDays to 33000 (~90 years old)
- Start the visit stage on yesterday's date and assert that the instrument is not assigned


