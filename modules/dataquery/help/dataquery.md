# Data Query Tool

The Data Query Tool (DQT) is a simple and easy-to-use interface for querying and exporting data from LORIS.<br>
The DQT module contains the following tabs:<br>
• **Info** : View timestamp of last data update and general information <br>
• **Define Fields** : Select fields for your query<br>
• **Define Filters** : Select criteria for your search based on field values<br>
• **View Data** : See the results of your query<br>
• **Statistical Analysis** : Visualize data and see basic statistical measures for your query results<br>
• **Load Saved Query** : Load a previously stored query<br>

### Manage Saved Queries

Either save your current query or see the criteria of previously saved queries here.

### Define Fields

The “Define Fields” tab is where you select the data categories and the specific data fields that you want added to your query. By default, all categories of data fields are displayed in a list when you first enter the tab. <br>
If you click on any category, its field names and field descriptions will appear in a table. 

If the number of fields in the chosen category exceeds the display limit per page, the results may be displayed on subsequent pages within the table, accessible via the page number buttons found by scrolling toward the bottom of the page. <br>
Any fields that are defined for the current query are listed on the right-hand side (subject to change). If there are no fields defined for the current query, this list is not shown. Time points can be specified within the field in the “Define Fields” tab or in the “Define Filters” tab.

The options to add fields to your query are as follows: 

Option 1: Add Using Dropdown Fields can be searched for using the list of categories of data fields. After clicking the desired instrument, a list of fields are displayed. Clicking on a field row will highlight it and add it to the list of selected fields for your current query. <br><br>
Option 2: Search Within Instrument Fields can be searched for using the search bar. Once the user starts typing, all matches will be displayed in an active list. Once the desired field is displayed, the field must be clicked to be added into the query. <br><br>
Option 3: Add All If all fields from a particular category should be included in the query, use this method. By clicking the “Add All” button above the list of categories, all fields from the category will be added.<br>
<br>
Option 4: Load fields from a previously saved qeury -- click on the "Load Saved Query" tab. User Saved Queries and Shared Saved Queries will appear in a dropdown. (User Saved Queries are queries that the current user has saved, and are listed according to Query Name. Shared Saved Queries are publicly shared, and are listed according to the user who created it and the Query Name.) <br>
Once a query is selected, the DQT will retrieve and load both the fields and filters defined in the saved query -- displayed in the “Define Fields” and “Define Filters” tabs. To remove fields from your query, find the field from the list (using the Search Within Instrument search bar or in the instrument list of fields) and click on the highlighted field, to de-select it. This can be confirmed by checking that the field no longer appears in your list of selected fields. <br>
To remove *all* currently selected fields, click “Clear Query” in the list of Fields.<br>
To remove only fields from a specific *category*, click the “Remove All” button above the list of categories. 

When ready, continue to the “Define Filters” tab to add filters to your query, or go directly to the “View Data” tab if your query does not require filters.

### Define Filters

The “Define Filters” tab is where you define the criteria to filter the data for your query. Filters can be applied on any field in order to limit the set of results returned by a query. For example, you can extract data collected at a specific site or from a particular visit. <br>
Multiple filters can be applied and layered with "And/Or" conditional logic. Filters are applied at the level of the candidate. The data fields are grouped by category. <br><br>
To add a filter, select a category using the dropdown. A secondare dropdown will appear listing all data fields in that category. Once a data field is selected, additional dropdowns to specify the “Operator” and “Value” will appear.  The Operators are: <br>
•  = equal to <br>
•  != does not equal<br> 
•  <= less than or equal to <br>
•  >= greater than or equal to <br>
  startsWith: filter for values starting with a specific character or string <br> 
  contains: filter for values containing a specific character or string <br>
To add more filters, click the “Add Rule” button and follow the instructions above. <br>
To delete any unwanted filters, click the “Delete” button within the specific filter. <br><br>
Filters can be combined using "And" and "Or" logic - “And” requires that all filter conditions are true before the data record is selected. "Or" requires that only one filter condition is true.<br>
Note: by default the filters are set to “And” logic -- click "Or" to switch the operator, which will apply to the whole group of filters.<br> 
To create nested filters with multiple And/Or filter conditions, click the “Add Group” button.

## View Data

The “View Data” tab executes queries, displays query results, and allows users to download data. Select how you want the data to be arranged using the Data dropdown (cross-sectional or longitudinal). Click the “Run Query” button to execute the current query on the database based on the defined fields and filters. Results can be also sorted by field by clicking on the table's column headers. The number of results displayed per page can be modified using the “Maximum rows per page dropdown” at the bottom of the results table. 

After running a query and viewing the results, click the "Download Table Data as CSV" button to save the query output dataset to your computer as a comma-separated value file. If any files are included in the query output, click "Download Data as ZIP" to save compressed packages of the files and data to your computer. 

The query can also be saved for reuse, to avoid constructing the query from scratch in future. Go to the “Manage Saved Queries” tab and then click the "Save Query" button. A pop-up dialog will appear. Enter a descriptive query name. If you would like the query to be publicly shared, click on the checkbox. Then click "Save query" to complete the process, and the currently defined fields and filters will be saved under the specified query name. This saved query should now appear under the "Manage Saved Queries" tab in the “Your currently saved queries” table. <br>
New fields can be selected and saved under the same name to directly update the current query.

### Manage Saved Queries

The “Manage Saved Queries” tab organizes new or previously saved queries. The query name, selected fields and filters for each saved query are displayed in the table. Clicking on any column header (e.g. "Query Name") will sort the list by that column. The current query can be saved by clicking the "Save Current Query" button. A pop-up dialog will appear. Enter a descriptive query name. If you would like other users to see and run your query, click on the checkbox to make it a Shared query. Then click "Save query" to complete the process, and the currently defined fields and filters will be saved under the specified query name. This saved query should now appear under the "Manage Saved Queries" tab in the “Your currently saved queries” table. <br>
New fields can be selected and saved under the same name to directly update the current query. To reload a saved query, click on the "Load Saved Query" tab. User Saved Queries and Shared Saved Queries will appear in a dropdown. <BR>
**User Saved Queries** are queries that the current user has saved, and are listed according to Query Name. <br>
**Shared Saved Queries** are publicly shared, and are listed according to the user who created it and the Query Name. 

Once a query is selected, the DQT will retrieve and load the query fields and filters that were selected when the query was initially created. This will be displayed under the “Define Fields” and “Define Filters” tabs, respectively.
