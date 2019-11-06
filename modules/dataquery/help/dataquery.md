# Data Query Tool

The Data Query Tool (DQT) is a simple and easy-to-use interface for querying and exporting data from LORIS.<br>

The DQT module contains the following tabs:<br>

• **Info** : View timestamp of last data update and general information <br>
• **Define Fields** : Select fields for your query<br>
• **Define Filters** : Select criteria for your search based on field values<br>
• **View Data** : See the results of your query<br>
• **Statistical Analysis** : Visualize data and see basic statistical measures for your query results<br>
• **Load Saved Query** : Load a previously stored query<br>

### Manage Saved Queries tab

Either save your current query or see the criteria of previously saved queries here.

### Define Fields tab

This is where you select the data categories and fields to add to your query. By default, all categories are displayed in a list when you first enter the tab.<br>

If you click on any category, its field names and descriptions will appear in a table.<br>

If the number of fields in the chosen category exceeds the display limit per page, the results may be displayed on subsequent pages within the table. Navigating using the page number buttons toward the bottom of the page. <br>

Any fields that are defined for the current query are listed on the right-hand side (subject to change). If there are no fields defined for the current query, this list is not shown. Time points can be specified within the field in the **Define Fields** tab or in the **Define Filters** tab.<br>

The options to add fields to your query are as follows:<br>

**Option 1: Add Using Dropdown Fields** - Seach for fields using the list of categories. After clicking the desired instrument, a list of fields are displayed. Click on a field row to highlight it and add it to the list of selected fields for your current query. <br>

**Option 2: Search Within Instrument Fields** - Search for fields using the search bar. Once you start typing, all matches will be displayed in an active list. Click the desired field to add it to the query. <br>

**Option 3: Add All** - Use this option to add all fields from a category to the query. To do so, click **Add All** above the list of categories. <br>

**Option 4: Load fields from a previously saved query** - Click on the **Load Saved Query** tab. User Saved Queries and Shared Saved Queries will appear in a dropdown. (*User Saved Queries* are queries that you have previously saved, and are listed according to Query Name. *Shared Saved Queries* are publicly shared, and are listed according to the user who created it and the Query Name.) <br>

Once a query is selected, the DQT will retrieve and load both the fields and filters defined in the saved query, displayed in the **Define Fields** and **Define Filters** tabs. To remove fields from your query, find the field from the list (using the Search Within Instrument search bar or in the instrument list of fields) and click on the highlighted field, to de-select it. Confirm its removal by checking that the field no longer appears in your list of selected fields. <br>

To remove *all* currently selected fields, click **Clear Query** in the list of Fields.<br>

To remove only fields from a specific *category*, click the **Remove All** above the list of categories. <br>

When ready, continue to the **Define Filters** tab to add filters to your query, or go directly to the **View Data** tab if your query does not require filters.<br>

### Define Filters tab

This is where you define the criteria to filter the data for your query. You can apply filters on any field in order to limit the set of results returned by a query. For example, you can extract data collected at a specific site or from a particular visit. <br>

You can apply multiple filters, and layer them with "And/Or" conditional logic. Filters are applied at the level of the candidate. The data fields are grouped by category. <br>

To add a filter, select a category using the dropdown. A secondary dropdown will appear, listing all data fields in that category. Once a data field is selected, additional dropdowns to specify the “Operator” and “Value” will appear.  The Operators are: <br>

•  = equal to <br>
•  != does not equal<br> 
•  <= less than or equal to <br>
•  >= greater than or equal to <br>
•  startsWith: filter for values starting with a specific character or string <br> 
•  contains: filter for values containing a specific character or string <br>

To add more filters, click **Add Rule** and follow the instructions above. <br>

To delete any unwanted filters, click **Delete** within the specific filter. <br>

Filters can be combined using "And" and "Or" logic - “And” requires that all filter conditions are true before the data record is selected. "Or" requires that only one filter condition is true.<br>

**Note:** by default the filters are set to “And” logic -- click "Or" to switch the operator, which will apply to the whole group of filters.<br> 

To create nested filters with multiple And/Or filter conditions, click **Add Group**.

## View Data tab

This tab executes queries, displays query results, and allows you to download data. Select how you want the data to be arranged using the Data dropdown (cross-sectional or longitudinal). Click **Run Query** to execute the current query on the database based on the defined fields and filters. Sort your results as desired by clicking on the table's column headers. Modify the number of results displayed per page using the “Maximum rows per page” dropdown at the bottom of the results table. 

After running a query and viewing the results, click **Download Table Data as CSV** to save the query output dataset to your computer as a comma-separated value file (csv). If any files are included in the query output, click **Download Data as ZIP** to save compressed packages of the files and data to your computer. 

You can also save the query for future reuse. In the **Manage Saved Queries** tab, click **Save Query**. In the pop-up, enter a descriptive query name. If you would like the query to be publicly shared, click on the appropriate checkbox. Then click **Save query**. This will save the currently defined fields and filters under the specified query name. This saved query should now appear under the **Manage Saved Queries** tab in the **Your currently saved queries** table. This allows you to easily revisit saved queries to make necessary updates. <br>

### Manage Saved Queries tab

This tab organizes new or previously saved queries. The query name, along with selected fields and filters for each saved query are displayed in the table. Clicking on any column header (e.g. **Query Name**) will sort the list by that column. To reload a saved query, click the **Load Saved Query** tab. User Saved Queries and Shared Saved Queries will appear in a dropdown. <br>

Once a query is selected, the DQT will retrieve and load the query fields and filters that were selected when the query was initially created. This will be displayed under the **Define Fields** and **Define Filters** tabs, respectively.
