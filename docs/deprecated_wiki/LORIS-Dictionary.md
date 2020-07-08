> Under Construction

**Administration:** in an instrument form, can be marked “None”, “Partial”, or “All”. If an instrument was not administered, it is marked as “None.” This will remove the instrument from the database statistics calculation. If an instrument was partially administered (i.e. candidate did not answer some questions, parent did not provide some answers, tester did not ask some of the questions), it is marked as “Partial”. This field has to be set for Data Entry to be marked as “Complete”.

**Approval:** to promote a candidate from the “Visit” stage to the “Approval” stage, all of the instruments associated with a visit must be fully completed. Once the data for al the instruments in a candidate’s battery are entered, the visit stage should be marked as “Pass”, “Failure”, or “Withdrawal”. Candidates in this stage are no longer accessible for change unless feedback from the DCC is available. 

**Battery:** a list of which instruments are to be administered on each cohort of participants, and typically varies per timepoint and per study site. For example, the battery of instruments administered at a participant's first visit (e.g. timepoint V01) may depend on which cohort and study site they belong to. A participant may be tested on a certain set of instruments if they are in cohort A and from site X, but would be tested on different instruments if they are registered in cohort B at site Y. 

**BVLQCExclusion:** “Excluded” or “Not Excluded”

**BVLQCType:** “Visual” or “Hardcopy”

**BVLQCStatus:** null or “Complete”

**Candidate Age:** the difference between the candidate’s date of birth and the instrument’s date of administration. 

**Candidate/Subject:** patient or participant in the study

**Caveat Emptor Flag:** false by default. Should be set to true if a candidate should be flagged for analysis. 

**Cohort:** subproject or subgroup of people within the study

**CommentID:** keys the data for each instrument form entry

**Data entry:** complete, in progress

**DDE:** Double Data Entry (DDE) is the practice of requiring users to manually input the same dataset twice in order to reduce the risk of error in data entry.

**Current_stage:** the latest visit status, which can be “Not Started”, “Visit”, “Screening”, “Approval”, “Recycling Bin”, “Subject”

**Data entry completion status:** either “Complete or “Incomplete” depending on whether or not the required elements are filled out (see required elements).

**Date of Administration:** the date the form was filled out

**Examiner:** the person certified to administer a specific instrument or that is entering data into the database

**Exclusion:** flag that can be set to “Fail” or “Pass” for an instrument. 

**Failure:** If a candidate fails any of the visit instruments that are exclusionary in nature or if the candidate does not complete any behavioural visit instruments, the visit stage should be marked as failed by clicking the “Failure” button.

**Flag:** each instrument instance has an entry in the flag table, which stores the status of various instrument flags such as data entry, administration, validity, exclusion, flag status. 

**Flag_status:** “P”, “Y”, “N”, “F”

**Full Name:** readable version of the table name to display in the front-end

**Group:** a collection of related elements

**Instrument:** tests and questionnaires which are administered and used to collect data on participants in a given study. These behavioural, psychological, and clinical tests fall into three categories: basic forms, forms with scoring algorithms, and uploaded data.

**Instrument Builder:** used by admin-level users to create simple instrument forms through the LORIS front-end. It can be found under Tools in the LorisMenu.

**Instrument Manager:** designed to allow the LORIS database Admin superuser to upload and install *.linst instrument forms and to monitor instrument status in LORIS. (include wiki link)

**Instrument:** form that candidates fill in during their visit

**IsDirectEntry:** if a form can be used by a study participant to directly enter data into Loris.
LORISForm - link to wiki page

**Linst:** a file format that is used by the instrument builder to create simple forms. 

**Look-up Table:** can be used for scoring and/or normalization. I.e. t-scores

**Metadata Fields:** Examiner, Date taken, Date of Administration, … which can be added to an instrument using the fucntion _addMetadataFields()/

**PHPCS:** PHP Code Sniffer detects coding standard violations (docs/LorisCS.xml). Can mostly be corrected using PHPCBF. To run PHPCS, go to the project root directory and run the following command:
` vendor/bin/phpcs --standard=docs/LorisCS.xml $filePath$ `

**QuickForm:** A package that provides methods for creating, validating, and processing HTML forms. Used up until but not including LORIS 17.0 for instrument forms. 

**Required Elements:** an array of the first question from each page, used to check whether or not the page has been completed

**Reliability:** permits users to calculate behavioural reliability with respect to gold standard cases and across testing sites by asking another examiner to perform the same evaluation on the same content. The reliability module outputs a reliability score based on the raw scores and the threshold value. Each reliability instrument needs a reliability instrument coded separately.

**Scoring Algorithm:** method to compute scores. The score() function by default runs a script named after the testName in the instrument directory if it exists, but it can be overridden in PHP. 

**Session:** timepoint

**SessionID:** each timepoint has a unique sessionID that can be found in the webpage URL

**Site:** clinic, hospital, research facility

**Stage:** see current stage

**Subgroup:** categorizes instruments within a timepoint’s list of instruments

**Subtest:** instrument page used in direct data entry

**Survey:** each survey has a unique URL that can be emailed to the participants to be completed online or loaded as a webpage on a desktop at the site for the participants to fill out during their visit. 

**Test Name:** table name as appears in the database

**Test_names:** the table that stores the list of all instruments

**Test_subgroups:** default subgroup is 1

**UserID:** username

**Validity:** can be marked as “Valid”, “Questionable”, or “Invalid”. Whether or not this flag is shown for an instrument is by the boolean $ValidityEnabled. Whether the field is required before flagging an instrument as complete is determined by $ValidityRequired.

**Visit:** In Progress, Not Started, Visit...

**Visit Label:** timepoint. Note that Visit labels must be defined separately for each subproject in the fileproject/config.xml

**Visit Window:** table that must be populated with all visit labels. The Imaging Pipeline critically depends on this. The populate_visit_windows.php script populates this table based on the config.xml. 

**Window Difference:** The calculated difference in days between the intended Visit Window age range and the actual (date of) administration for an instrument.  For example in an infant study, if an instrument with a defined Visit Window of 6-12 months of age is administered on a 13-month-old candidate, the Window Difference is 1 month i.e. exceeding the Visit Window by 1 month. This difference is calculated and displayed _in days_ at the head of every instrument form.  

**Withdrawal:** If a candidate withdraws participation from the study, the visit phase should be marked as withdrawn by clicking the “Withdrawal” button and sent to the DCC.

**XIN Rule:** validates input and can prevent moving forward if required fields are not filled out