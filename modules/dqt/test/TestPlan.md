# Data Query Tool (DQT) Test Plan

1. Ensure the DQT module loads only for a user that has the permission 'Data 
Query Tool: View/Download Cross-Modality Data' (`dataquery_view`)
2. Go to the "Define Fields" tab:
   - select an instrument in the instrument drop down, ensure the fields are displayed
     with the option to restrict to certain visits
   - ensure that the search of fields within the instrument is working
   - ensure that clicking on the "Add All" button adds all the fields for the 
     selected instrument to the list of fields to be queried on the
     right side of the screen
   - ensure that clicking on the "Remove All" button removes all the selected 
     fields for the selected instrument to the list of fields to be queried on the
     right side of the screen
   - select a few fields from different instruments and ensure that they are all added 
     to the list of selected fields on the right side of the screen
   - ensure that the number of visits added to the query reflect the number of
     visits that were selected for the fields

3. Go to the "Define Filters" tab:
   - add a filter by selecting an instrument; ensure that drop downs with field names
     are available for that instrument; select a field; ensure that a drop down with 
     comparison operators appears next to the selected field; select a comparison; 
     when applicable, ensure that a text box appears next to the comparison operator;
     enter a value in the text box and ensure a drop down with the list of visits 
     on which to apply the filter appears next to the text box
   - add another filter by clicking on the "Add Rule" button
   - add a group filter by clicking on the "Add Group" button
   - ensure that the delete button for a given filter deletes the filter
   - ensure that the delete button for a given group of filters deletes the group of filters
4. Go to the "View Data" tab:
   - ensure that a "We are currently working hard to load your data. Please be patient."
     message is displayed after clicking on the "Run Query" button and before the 
     data is displayed
   - ensure that a table with results is being displayed after having run the query
   - change the "(Maximum rows per page)" drop down and ensure the table gets updated
     accordingly
   - If the "Longitudinal" view is selected, ensure that the first column of the data table 
     is the "Identifiers" column and contains the "PSCID" data. Switch to the "Cross-sectional" 
     view and make sure the "Identifiers" column now contains "PSCID,VisitLabel" tuples for each row.
   - ensure that the fields that were selected are present in the resulting data table
   - ensure that the filters that were added are indeed applied to the resulting data table
   - ensure the "Download Table as CSV" downloads a csv format of the displayed table. Toggle 
     between "Longitudinal" and "Cross-sectional" and make sure the downloaded CSV represents 
     the selected view.
   - ensure the "Download Files" button triggers the compression and download of all files 
     available as links in the datatable. (make sure to include downloadable fields in your 
     query to test this item, downloadable fields are identified with a little download logo 
     in the "define fields" section)
   - ensure that clicking on the different page numbers on the right side are working
5. Click on the "Visualized Data" button:
   - ensure that a table with "Basic Statistics" (Min, Max, Standard Deviation, Mean,
     Mean Deviation, Mean Squared Error, First Quartile, Second Quartile, Third 
     Quartile) is shown and filled
   - ensure that the "Scatterplot" is working when selecting data for column X and Y
6. Ensure the 'Save' button opens to a modal window with a text box 
     to write the name of the query to be saved, a checkbox to publicly share the 
     query and 2 buttons at the bottom ('Close' and 'Save Changes') 
     entering a name for that query and clicking on 'Save Changes' in the modal 
     window
   - save one query (`query1`) that would not be shared publicly
   - save another query (`query2`) that will be shared publicly
7. Go back to the 'Create or Load' page and click on the 'Load Existing Query' button:
   - ensure that `query1` saved in item '7.' of the test plan is displayed under the
     'User Saved Queries' section
   - ensure that `query2` saved in item '7.' of the test plan is displayed under the 
     'Shared Saved Queries' section
   - ensure both queries saved in item '7.' of the test plan load properly in the
     DQT and give similar results than when run the first time
