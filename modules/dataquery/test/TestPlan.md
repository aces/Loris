# Data Query Tool (DQT) Test Plan

1. Ensure the DQT module loads only for user that has the permission 'View Data Query Tool' (`dataquery_view`)
2. Verify that the permission 'View Data Query Tool' is required to access the DQT page
3. Go to the "Define Fields" tab:
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
   -
4. Go to the "Define Filters" tab:
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
5. Go to the "View Data" tab:
   - ensure that a "We are currently working hard to load your data. Please be patient."
     message is displayed after clicking on the "Run Query" button and before the 
     data is displayed
   - ensure that a table with results is being displayed after having run the query
   - change the "(Maximum rows per page)" drop down and ensure the table gets updated
     accordingly
   - ensure that the first column of the data table is the "Identifiers" column that
     contains the "PSCID,VisitLabel" information separated with a comma
   - ensure that the fields that were selected are present in the resulting data table
   - ensure that the filters that were added are indeed applied to the resulting data table
   - ensure the "Download Data as ZIP" is working
   - ensure that clicking on the different page numbers on the right side are working
   - change the data view from "Cross-sectional" to "Longitudinal", ensure that the 
     data is now displayed longitudinal on the X axis with column header names changed
     to "VisitLabel,InstrumentName" separated with a comma
6. Go to the "Statistical Analysis" tab:
   - ensure that a table with "Basic Statistics" (Min, Max, Standard Deviation, Mean,
     Mean Deviation, Mean Squared Error, First Quartile, Second Quartile, Third 
     Quartile) is shown and filled
   - ensure that the "Scatterplot" is working when selecting data for column X and Y
7. Go to the "Manage Saved Queries" tab:
   - ensure the current query can be saved
   - ...
8. Go to the "Load Saved Query" tab:
   - ...