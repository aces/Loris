#Configuration Module

The Configuration Module allows you to edit configuration settings from the front end. The configuration values are stored in the database, instead of in the config.xml file. Any settings that are not currently in the Configuration Module can still be found and edited from the config.xml file.

###How to use the module
To edit any configuration settings, navigate to the field that you'd like to edit in the module, and edit or insert a new value.

Some configuration settings can accept multiple values. For these settings, you can add additional fields by pressing the "Add Field" button. This will create an empty form area where you can insert new values. You can delete any of the settings by pressing the red delete button attached to the form.

Press the submit button at the bottom of the page to save your changes. You must press the submit button that is on the page where you are making the changes for the changes to be stored in the database. If you press the submit button on another configuration page, it will not store any changes made on other pages.

Care should be taken when editing the fields as there is currently no way to "undo" changes. You can reset the form to its values on page load by pressing the reset button. However, this will not undo any changes made before the submit button has been pressed.

###Migrating configuration data from the config.xml to the database
1. Add the config permission to the permissions table by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/Pre-14.10/2014-08-20-Config_Permissions.sql)
2. Create the ConfigSettings and Config table by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/Pre-14.10/2014-08-29-ConfigSettings.sql)
3. Update a data type in the Config table by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/Pre-14.10/2014-09-24-Config_Value_Datatype.sql)
4. Fill the ConfigSettings table by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/Pre-14.10/2014-09-25-ConfigToDB.sql)
5. Add the configuration module to the LORIS menu by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/Pre-14.10/2014-10-02-ConfigMenu.sql)
6. Add the configuration help text by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/Pre-14.10/2014-10-15-ConfigHelp.sql)
7. Run the config migration script, which moves values from your project's config.xml to the database. From the tools directory, run `php config_to_db.php`

###Moving from 14.10:
1. Remove the ColumnThreshold setting by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/14.12/2014-10-24-RemoveColumnThreshold.sql)
2. Update some of the setting descriptions by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/14.12/2014-10-24-UpdateConfigDescriptions.sql)
3. Apply the upgrade [patch](https://github.com/aces/Loris/blob/master/SQL/Archive/14.12/2014-11-21-ConfigurationVersionTwo.sql)
