UPDATE help SET content='The MRI Violations Module has a Selection Filter function to allow users to search for a
particular scan that violates MRI protocol. By clicking the button Show Data after selecting certain search options, a box will appear containing all the search results, which are organized by Patient Name, Project, Subproject, Site, Time Run, MincFile name, MincFile Violated, Series Description Or Scan Type, Problem, and Resolution Status. \n
Clicking on a link under the MincFileViolated column will open a pop-up window of the scan on Brainbrowser. \n
Clicking on a link under the Problem column will allow the user to see the issues for that particular patient and visit label. The issues are organized by Patient Name, CandID, Visit Label, Scan Type, Severity, Header, Value, ValidRange, ValidRegex, and SeriesUID. \n
Once a particular MRI Protocol Violation has been resolved, the Resolution Status can be updated using the drop-down
menu to select one of the following options: Reran, Emailed site/pending, Inserted, Rejected, Inserted with flag,
Other. Otherwise, the drop-down menu is left as "Unresolved", serving as a message to other users that an issue still
 exists. \n' where topic='mri_violations';

UPDATE help SET content='The Examiner tab allows the authorized user to add, view, or modify examiners and their
certifications. \n To add an examiner, the name and site of the examiner must be specified, as well as whether or not the examiner is a radiologist. \n
The Examiner Module has a Selection Filter function to allow users to search for a particular examiner and/or site. By clicking the button Show Data after selecting certain search options, the search results will appear, organized by the blue headers Examiner, Site, Radiologist, and Certification. \n
By clicking on an examiner\'s name, the certification for that examiner can be added or modified. To edit
certification for an examiner, choose an instrument under the  Instrument header, click the Certification Status drop-down, select the correct Certification Date and enter in any pertinent comments. Any modifications to an examiner\'s certification will appear in the Change Log. \n' WHERE topic='examiner';

UPDATE help SET content='To edit certification for an examiner, choose an instrument under the  Instrument header,
click the Certification Status drop-down, select the correct Certification Date and enter in any pertinent comments.
Any modifications to an examiner\'s certification will appear in the Change Log. \n' WHERE topic='edit_examiner';

UPDATE help SET content='The Training Module allows users to view training content in three columns: Certifications
to Complete, Completed Certifications, and Online Training. \n Certifications to Complete consists of available existing training modules that the user has not yet completed. Completed Certifications allow the user to browse the training content for any of the instruments that the user has alrady been certified for. Online Training allows the user to access training for certain instruments online.\n' WHERE topic='training';

UPDATE help SET content='The Server Processes Manager has a Selection Filter function to allow users to search by
Process ID (PID), UserId, or Type. By clicking the button Show Data after selecting certain search options, the search results will appear, organized by the blue headers Pid, Type, Stdout File, Stderr File, Exit Code File, Exit Code, Userid, Start Time, End Time, and Exit Text.\n' WHERE topic='server processes manager';

UPDATE help SET content='The Survey Accounts Module can be used to create a survey form, which creates a unique URL
that can either be emailed to the participants to be completed online or loaded as a webpage on a desktop at the site
 for the participants to fill out during their visit.\r\n This module can be accessed from the Admin menu of the IBIS
  database under "Survey Module". At this point, the questionnaires coded in this module are the Peer and Sibling
  Social Contact Questionnaires ,PSPQ Questionnaire and the SRS2 Questionnaire.\r\n This page contains a list of all
  forms created for direct data entry by study participants. You can filter this list of surveys based on the Visit,
  Email, PSCID and Instrument. \r\n To create a survey, click on the "Add Survey" button. See additional help on the
  "Add Survey" page for information on how to create a survey. Once the survey has been created, click on the URL to
  access the online survey.\r\n Survey Status Information:\r\nCreated: Indicates that the survey was created. This is
   the default status once a survey is created using the "Add Survey" page.\r\n Sent: Indicates that the survey was
   created and an email with the survey link was sent to the participant. This is the default status once a survey is
    created and sent by email using the "Add Survey" window. \r\n In Progress: indicates that the survey was accessed
    . This status can either be attained when data entry staff click on the URL to load the page for the participants
     or when participants access the link sent to them via email. \r\n Complete: This indicates that the survey was
     completed and submitted. After this stage, the participant will not be able to go back and change his/her
     entries. Clicking on the URL will display a page with the message "Data has already been submitted".' WHERE
     topic='survey';

UPDATE help SET content='Each time point for each subject has its own Instrument List page. The candidate\'s CandID, PSCID, and Visit Label are listed in the dark blue header at the top of the page. Additional candidate information, such as Date of Birth, Gender, Project and Site are listed in a table immediately below the header. Underneath this table is another table with information pertaining to the time point, including the stage, status, and date. Finally, a table of the Behavioral Battery of Instruments can be found. \r\n In the Behavioral Battery of Instruments, all forms for that candidate at a particular time point can be found. To access an instrument and enter data, click on the instrument in the battery. It is recommended that acquired data be entered as promptly as possible into the DB. \r\n
Once a visit stage is opened, data for all the visit instruments must be entered and saved before the profile can be
moved into the approval stage.' WHERE topic='instrument_list';

UPDATE help SET updated='2016-02-12 03:32:41' WHERE topic='mri_violations';
UPDATE help SET updated='2016-02-12 03:32:41' WHERE topic='examiner';
UPDATE help SET updated='2016-02-12 03:32:41' WHERE topic='edit_examiner';
UPDATE help SET updated='2016-02-12 03:32:41' WHERE topic='training';
UPDATE help SET updated='2016-02-12 03:32:41' WHERE topic='server processes manager';
UPDATE help SET updated='2016-02-12 03:32:41' WHERE topic='survey';
UPDATE help SET updated='2016-02-12 03:32:41' WHERE topic='instrument_list';
