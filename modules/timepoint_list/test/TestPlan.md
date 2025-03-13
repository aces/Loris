# Timepoint List - Test Plan

## Table of Contents

1. [Setup](#setup)
2. [Test Site Constraint](#test-site-constraint)
3. [Test Project Constraint](#test-project-constraint)
4. [Test All Sites Permission](#test-all-sites-permission)
5. [Test Buttons](#test-buttons)

## Setup

Sign into your loris instance with an **admin** account.

- Select Admin > User Accounts and click the Add User button.
- Enter all required information.
- Select *ONE* site for example, "Rome".
- Select *ONE* project, for example Pumpernickel.
- [x] View/Create Candidates and Timepoints - Own Sites.
- Open a separate **incognito** or **private** browser window.
- Sign into your loris instance. Enter the credentials of the user that you just created.

## Test Site Constraint

### List only candidates of same site

- Click Candidate/Access Profile.

Assert that you see only candidates of that site "Rome" (in our example)**

### Load time points by entering CandID in url

- Copy the CandID of this user, paste as follows:
https://\<yourInstance>\.loris.ca\/\<paste the candidateID here

Assert that this loads a list of timepoints **or** returns :
>There are no timepoints associated with this candidate

### Deny access to candidate of a different site

- Enter a candidate ID into url that is from a different site.

Assert that the following message is shown:**

>Permission Denied

## Open Profile Button

- [x] View/Create Candidates and Timepoints - Own Sites.

- Click the 'Open Profile' button.
- Enter the CandID number and PSCID of the same candidate.
This will replicate the same behaviour as clicking on the candidate's PSCID, showing their list of timepoints.

Assert that it does

## Test Project Constraint

- Are the projects shown the same as those you selected in your user settings (in our example: "Pumpernickel")?
- Refresh your incognito (or private) browser.
You will see a list of time points from all sites that share your selected project (in this case "Pumpernickel")

Assert that other projects are **not** shown

## Test All Sites Permission

- [x] View/Create Candidates and Timepoints - All Sites

- Select a candidate from a different site and open up a timepoint. Assert that, for this candidate, you can see timepoints from different sites.

## Test Buttons

- For a Candidate of **same site** (Rome, in our example), there should be 3 Buttons, as follows:

### Create Time Point

- Click this and assert that it takes you to 'Create Time Point'.**

### Candidate Info

- With the following permissions unchecked :
- [ ] Candidate Parameters: View Candidate Information
- [ ] Candidate Parameters: Edit Candidate Information
Assert that you do not see the `Candidate Info` button. Assert that the button appears when one or both are checked.

### View Imaging Datasets

Assert that, if you click this button, you are taken to imaging browser

- If you don't see this button, set the following permission :
- [x] Imaging Browser: View Imaging Scans - Own Sites
- Refresh and try again.

## End
