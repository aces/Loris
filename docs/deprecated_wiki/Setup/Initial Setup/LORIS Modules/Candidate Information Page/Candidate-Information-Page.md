**[[HOME|Home]]** > **[[SETUP|Setup]]** > **[[LORIS MODULES|LORIS Modules]]** > **[[CANDIDATE INFORMATION PAGE|Candidate-Information-Page]]**

All information regarding overall candidate, proband, participant status across timepoints including consent status is displayed in the front-end Candidate Information page, accessible from the Candidate Profile page via the “Edit Candidate Info” button.  Note that the user must have "Edit Candidate Parameters" permission and must be of the same site as the candidate for this link to work. 

Note: In the back-end of LORIS, all Candidate Information fields and data are known as and managed via [[Candidate Parameters|Candidate-Parameters]]. 

The Candidate Information page contains several sections:

   1. **Candidate information** main panel displays the following fields:

      - Caveat Emptor flag for candidate dataset; update requires a comment (reason for update)
      - individual Candidate Parameters, created via parameter_candidate table

      Click 'Update Candidate Info' button to modify.

   2. **Proband information** Enable this feature in the Configuration module under the “Study variables” section by setting the “Show Proband” field to true. Click 'Update Proband Info' button to modify the following:

      - Proband ID
      - Proband Gender
      - Proband Date of Birth

   3. **Family information** Displays Family member’s CandID, and Relationship to candidate. 
In order to enable this feature, go to the Configuration module under the “Study variables” section and set the “Use family ID” field to true.  Click on the Family Member CandID to open their individual Candidate Information page. To add a Family Member, click on 'Add Family' button. This opens a new page where you will enter:

      - Family Member ID: enter CandID of another related candidate in the same study
      - Relationship Type: specify relationships in the family table under Relationship_type column

   4. **Participant Status** Displays current status of candidate in the study, with metadata from last status update such as date, comments, and data entry staff. All candidates are Active by default.  
      Click on 'Update Participant Status' button, to update/modify:

      - Participant Status: Active, Refused/Not Enrolled, Ineligible, Excluded, Inactive, Incomplete, Complete. Complete definitions of each status option are available in the Help section for this page in LORIS.
      - Reason for status change: Some options have related reasons that are populated as suboptions: Inactive (Unsure, Requiring Further Investigation, Not Responding) and Incomplete (Death, Lost to follow-up). If status is changed to Inactive or Incomplete, selecting a suboption is required.
      - Comments (optional)

      Status options and sub-options can be modified and added in the participant_status_options table. Suboptions are linked to status options via the ParentID column.

   5. **Consent Status** : Displays date of consent to study, date of withdrawal of consent, consent status, and metadata from last updates such as comments and data entry staff. To update/modify a candidate's consent status, click on the 'Edit Candidate Info' button to access the Candidate Parameters module for that candidate. To enable this section, set the _useConsent_ option in the Configurations module to true.

      To add consent to the study, populate the `consent` table with the new consent.

      For example, for consent to draw blood:

         ```sql
         INSERT INTO consent (Name, Label) VALUES ('draw_blood_consent', 'Consent to Draw Blood');
         ```