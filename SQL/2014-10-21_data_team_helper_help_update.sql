UPDATE help SET content = "Data Team Helper' allows the users to find out what the outstanding behaviourial feedbacks, conflicts and incompleted forms for the given candidate/field/instrument by filtering for the given visit-Label and Instrument.
This module will also display the 'Single Data_entry Completion Percentage' for the given visit and instrument, only if the instrument is selected.\n\r
The resulting table:\n
- displays all fields from the selected instrument (or All Instruments if this feature was chosen) for the specified visit. \n
- Under the column 'Names (Instrument_Fieldname)', the given field name is clickable which allows the user to download the data for the given field/instrument in the .csv format, containing the data and data_entry (i.e complete, in_pregress or null)  for every candidate for the given field and visit.\n
- The 'Link to Bvl Feedback' column contains links to pop-up feedback window, where feedback for a particular field and candidate was previously entered, based on the field-name. If such information was never entered, users will see “N/A”. \n
- For existing links to behavioural feedback, the corresponding status for this field will be listed under the column 'Feedback Status'. \n
- Any candidates with conflicts between initial and double data entry will be listed under the 'Conflicts' column. Clicking on the candidate’s link will open up a new tab, directing the user to the Conflict Resolver for the corresponding field and visit label for that candidate. \n
- A list of candidates for which data entry is incomplete for that particular instrument and visit label will be listed under 'Incomplete Candidates'. The ID of each candidate listed is a link to that candidate’s data entry page.\n" where topic = 'Data Team Helper';
