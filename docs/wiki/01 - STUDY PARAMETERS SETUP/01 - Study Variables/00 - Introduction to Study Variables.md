
# Study Variables Setup

### Overview
This page covers how to set up LORIS with basic parameters for research data. 

Most configuration settings are managed via LORIS's front-end Configuration Module 
(accessible via the Admin menu item). These configuration settings are stored and 
loaded from the Database `Config` and `ConfigSettings` tables. Some other 
configuration settings are also found in the file `project/config.xml`. Finally, 
some configurations require direct database access and insertions through SQL queries.

  > Note: Settings found in _config.xml_ take precedence over the 
  _Configuration Module_.  Older projects should ensure there is no overlap in 
  settings between this file and the _ConfigSettings_ table.
