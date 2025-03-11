# Timepoint List - Test Plan :

### Table of Contents
1. [Setup](#setup)
2. [Test Site Constraint](#test-site-constraint)
3. [Test Project Constraint](#test-project-constraint)
4. [Test All Sites Permission](#test-all-sites-permission)
5. [Test Buttons](#test-buttons)

<br>

## Setup

Sign into your loris instance with an **admin** account.

- Select Admin > User Accounts and click the Add User button. 
- Enter all required information.
- Select *ONE* site for example, "Rome".
- Select *ONE* project, for example Pumpernickel.
- Tick box:Roles/Access Profile: View/Create Candidates and Timepoints - Own Sites.
- Open a separate **incognito** or **private** browser window.
- Sign into your loris instance. Enter the credentials of the user that you just created. 

<br>

## Test Site constraint

#### List only candidates of same site<br>

- Click Candidate/Access Profile.

**Assert that you see only candidates of that site "Rome" (in our example)**

#### Load time points by entering CandID in url
- Copy the CandID of this user, paste as follows:
https://\<yourInstance>\.loris.ca\/\<paste the candidateID here><br>

**Assert that this loads a list of timepoints **or** returns :**
>There are no timepoints associated with this candidate 

#### Deny access to candidate of a different site<br>
- Enter a candidate ID into url that is from a different site.<br>
**Assert that the following message is shown:** 
>Permission Denied<br>


#### Open Profile Button
- Click the 'Open Profile' button.
- Enter the CandID number and PSCID of the same candidate.
This will replicate the same behaviour as clicking on the candidate's PSCID, showing their list of timepoints.<br>
**Assert that it does**

<br>

## Test Project Constraint<br>
- Are the projects shown the same as those you selected in your user settings (in our example: "Pumpernickel")?
- Refresh your incognito (or private) browser.
You will see a list of time points from all sites that share your selected project (in this case "Pumpernickel").<br> 
Assert that other projects are **not** shown

<br>

## Test All Sites Permission
- Tick : Permissions/Access Profile: View/Create Candidates and Timepoints - All Sites

- Select a candidate from a different site and open up a timepoint.

**Assert that, for this candidate, you can see timepoints from different sites.**

<br>

## Test Buttons<br>
- For a Candidate of **same site** (Rome, in our example), there should be 3 Buttons, as follows:<br>

#### Create Time Point<br>

- Click this. 
**Assert that it takes you to 'Create Time Point'.**
 
#### Candidate Info<br> 
- Click this. 
**Assert that you are taken to candidate parameters.**
- If you get code 403, the<br> 
'Candidate Parameters: View Candidate Information' permission is needed.


#### View Imaging Datasets<br>
**Assert that, if you click this, you are taken to imaging browser**

- If you don't see this button, got to User accounts from the admin page, and tick:
'Imaging Browser: View Imaging Scans - Own Sites'
- Refresh and try again.

<br>

## End









