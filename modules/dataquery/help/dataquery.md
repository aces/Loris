# Data Query Tool (DQT)

This module provides a simple and easy-to-use interface for querying and exporting data from LORIS.

There are several tabs within this module, including the default **Info** tab, which provides explanations for the other tabs.

## Define Fields

This tab allows you to select the data categories and fields to add to your query. You can add fields via the Instrument dropdown menu, the *Search within Instrument* search bar, or the *Add All* function. You can also use the *Load Saved Query* function to load a previously saved query, rather than generating a new one from scratch. Note: once you select a category, its field names and descriptions will appear in a table for you to select from. You can also specify visits. 

Once you have your fields properly defined, you can continue on to the **Define Filters** tab, or directly to the **View Data** tab if your query does not require filters. 

## Define Filters

This is where you define the criteria to filter the data for your query. You can apply filters on any field in order to limit the set of results returned by a query, such as filtering for a specific site or visit.

You can apply multiple filters, and layer them with "And/Or" conditional logic. Filters are applied at the level of the candidate. The data fields are grouped by category.

To add a filter, select a category using the dropdown. A secondary dropdown will appear, listing all data fields in that category. Once a data field is selected, additional dropdowns to specify the “Operator” and “Value” will appear.  The Operators are:

•  = equal to<br>
•  != does not equal<br>
•  <= less than or equal to<br>
•  >= greater than or equal to<br>
•  startsWith: filter for values starting with a specific character or string<br>
•  contains: filter for values containing a specific character or string<br>

To add more filters, click **Add Rule** and follow the instructions above. To delete any unwanted filters, click **Delete** within the specific filter.

Filters can be combined using "And" and "Or" logic - “And” requires that all filter conditions are true before the data record is selected. "Or" requires that only one filter condition is true.

**Note:** by default the filters are set to “And” logic -- click "Or" to switch the operator, which will apply to the whole group of filters.

To create nested filters with multiple And/Or filter conditions, click **Add Group**.

## View Data

This tab executes queries, displays query results, and allows you to download data. Select how you want the data to be arranged using the Data dropdown (cross-sectional or longitudinal). Click **Run Query** to execute the current query on the database, based on the defined fields and filters.

## Manage Saved Queries tab

This tab organizes new or previously saved queries. If you want to save your current query, click **Save Current Query**. Then, enter a name for your query, and specify whether you want it to be saved publicly or not. Click **Save Changes**. Saved queries will show up in the **Load Saved Queries** feature. 
