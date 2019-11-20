# Instrument Manager

This module allows you to view the status of instruments that are installed in LORIS. If configured, the module will contain an **Upload** tab, where you can install new instruments created with the Instrument Builder. 

## View Status of Installed Instruments

In the **Browse** tab, use the *Selection Filter* section to search for a specific instrument or instruments. The resulting table will display details on the instrument, including whether or not the instrument SQL table exists and is valid. The columns are defined as follows:

*Instrument*: provides the instrument name as given in the `test_names` table.
*Instrument Type*: contains either "PHP" or "Instrument Builder", depending on whether the instrument was created using the insturment builder or coded in PHP. 
*Table Installed*: displays either "Exists" or "Missing", depending on whether the instrument table exists in the LORIS SQL database.
*Table Valid*: displays whether the SQL database is properly configuredm with respect to the instrument installed in the LORIS `project/instruments` directory. 
*Pages Valid* displays whether the `instrument_subtests` table in LORIS is properly populated

**Note**: the *Table Valid* and *Pages Valid* columns can only be determined for LINST instruments (those created in the instrument builder), as there is no way to extract the “proper” values from instruments coded in PHP. The *Instrument Type* column displays whether the instrument was created in the instrument builder or coded in PHP. 

## Upload New Instrument

If configured, the **Upload** tab will display an *Upload Instrument* section. Click **Browse** to select a LINST file from your computer. Click **Install Instrument** to install the instrument into LORIS. 

**Note**: Once installed, you’ll still need to manually insert the instrument into a study-specific test battery. 
