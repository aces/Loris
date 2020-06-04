# Data Query Tool (DQT)

This module provides a simple and easy-to-use interface for querying and exporting data from LORIS.

There are several tabs within this module, including the default **Info** tab, which provides explanations for the other tabs.

## Define Fields

This tab allows you to select a data category or instrument, then add specific fields to your query, as well as specifying which visit or timepoint should be queried. To run a previously saved query, use the *Load Saved Query* tab in this module.

Once you select an instrument or category (such as `mri_data`) from the _Instrument_ dropdown, field names and descriptions will appear in a table for you to select from, or you can start typing in the *Search within Instrument* search bar to find the right field.

After selecting a field, you'll notice that all applicable visits are selected - you can unselect any visits you don't want to query. This visit selection will be suggested for the next fields selected in this category or instrument. 

As you add fields to your query, you'll notice they are listed on the right side of the page under "Fields". 
Once you have your fields defined, you can continue on to the **Define Filters** tab, or directly to the **View Data** tab if your query does not require filters. 

## Define Filters

This is where you define the criteria to filter the data for your query. You can apply filters on any field in order to narrow the set of data records returned by a query, such as filtering for a specific value, e.g. `Sex` = `Female`.

Filters are applied at the level of the candidate. You can apply multiple filters using "And/Or" logic, and organize them in multiple levels.

To add a filter, select an instrument or category using the dropdown. A secondary dropdown will appear, listing all data fields in that category. Once a data field is selected, additional dropdowns to specify the “Operator” and “Value”, and then a "Visits" dropdown will appear. These _Operators_ are:

   = equal to<br>
   != does not equal<br>
   <= less than or equal to<br>
   \>= greater than or equal to<br>
   _startsWith_ : must begin with a specific character or string<br>
   _contains_ : must contain a specific character or string<br>
   _isNull_ : no value is stored in this field<br>
   _isNotNull_ : any value is stored in this field<br>

Click **Add Rule** to define your next rule, and then define how your filters will work together using "And" and "Or" conditional logic. Select "And" if both filters must be true, "Or" if only one must be true for a data record to be selected. (The default is "And".)  Click **Add Group** to add filters in layers with different And/Or conditions. 

## View Data

This tab executes your query, displays the query results, and allows you to download data. 
Use the "Data" dropdown to organize the results table: _cross-sectional_ by timepoint, or _longitudinal_ across all timepoints. Click **Run Query** to execute the current query on the database, based on the defined fields and filters.

## Statistical Analysis

This tab shows basic statistical calculations and scatterplot visualizations of data from your query. 

## Load Saved Query

This tab lists all previously saved queries. Hover over the tab to reveal the list, and then select your query. 

## Manage Saved Queries

This tab lets you review and edit saved queries. If you want to save your current query, click **Save Current Query**, then enter your new query name. Specify that it should be saved publicly if you want it to be visible to other users. Click **Save Changes**. Saved queries will show up in the **Load Saved Query** tab. 
