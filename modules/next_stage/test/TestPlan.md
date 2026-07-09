This testplan tests the functionality of `start visit stage`. Start visit stage essentially creates an entry in the `session` table. 

## Time Point Button

Make a user with the following permission:
- [x] Access Profile: Create/View Candidates and Timepoints - Own Sites
- Log into this user in an incognito window, mainting the admin user in a "normal" browser window
- In the user (non-admin), naviagate to Candidate -> New Profile
- Create a candidate and make note of the PSCID.
- Once you close the modal, you will be redirected to the candidate's list of Visits (aka "Time Points"), where there are currently none. Assert that you see the button `Create Time Point`
- In the admin account, remove the **Access Profile: Create/View Candidates and Timepoints Own Sites** permission for your user
- Hard Refresh your user's browser and assert that the button has disappeared

## Start Visit Stage Icon

In this section, you will test the activation and sisactivation of the start stage icon in the blue side bar. It is small, says **Start Visit Stage** and has a folder icon. When disactivate it saus **(No Actions)**
- In admin account, Re-administer the permission for this user
- In the user account, click on `Create Time Point` 
- Select the first option in all fields and click `Create Timepoint`
- Assert that you see an entry in your **List of Visits (Time Points)**
- Assert that the **Stage, Stage Status, Date of Stage** are all merged into a single value which states **Not Started**. This means that the stage for this candidate at the indicated visit is not yet started.
- Click on the blue link in the **Visit Label (Click to Open)** field and assert that you can see a **Start Visit Stage** link in the light blue sidebar with a folder icon.
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
- Assert that the Date_visit field entry in the `session` table contains the date that you wrote in the above step