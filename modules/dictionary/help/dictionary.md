# Data Dictionary

This module houses definitions or descriptions for the data fields in LORIS.

Use the *Selection Filter* section to search for specific fields. Your results will be displayed in the data table below. 

Click on the pencil icon to override the *Description* of a field - this should be done with caution. When a field description is modified, the new description is used in the Data Query Tool (after it is refreshed), by users who are selecting data fields to analyze or download. The modified field description will not be visible in the instrument form into which a user or survey participant enters data.

The *Data Scope* column represents the scope that the dictionary item corresponds to and can be
either "candidate" or "session".

The *Data Cardinality* describes how many items of the dictionary type may exist per scope.
It may be one of:
- **Unique** -- there is a single value across all entities of the scope (ie. an unique candidate identifier for a candidate or a visit label for a session)
- **Single** -- There is exactly one value per entity of the scope
- **Optional**  -- There may be one or zero values per entity of the scope
- **Many** -- There may be zero or more values associated with entities of the scope
