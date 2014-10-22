#Configuration Module

The Configuration Module allows you to edit configuration settings from the front end. The configuration values are stored in the database, instead of in the config.xml file. Any settings that are not currently in the Configuration Module can still be found and edited from the config.xml file.

###How to use the module
To edit any configuration settings, navigate to the field that you'd like to edit in the module, click in the form area and edit/insert a value. Pressing enter while the edited form area is selected will save any changes that you make.

You should not edit more than two fields at a time as the submit function only saves the data in the form area that you have currently selected. Therefore, if you edit two different fields, only the one that is selected at the time you press enter will be saved. It is recommended to save any changes you make in one field by pressing enter, before moving on to other fields. This will prevent losing any changes that you make.

Some configuration settings can accept multiple values. For these settings, you can add additional fields by pressing the "Add Field". This will create an empty form area where you can insert new values. You must press enter while the new area is selected to save the new value. You can remove a field by pressing the remove button below the form area.

Care should be taken when editing the fields as there is currently no way to "undo" changes.

###Migrating configuration data from the config.xml to the database
1. Add the config permission to the permissions table by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/Pre-14.10/2014-08-20-Config_Permissions.sql)
2. Create the ConfigSettings and Config table by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/Pre-14.10/2014-08-29-ConfigSettings.sql)
3. Update a data type in the Config table by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/Pre-14.10/2014-09-24-Config_Value_Datatype.sql)
4. Fill the ConfigSettings table by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/Pre-14.10/2014-09-25-ConfigToDB.sql)
5. Fill the Config table with default values by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/Pre-14.10/2014-09-26-DefaultConfig.sql)
6. Add the configuration module to the LORIS menu by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/Pre-14.10/2014-10-02-ConfigMenu.sql)
7. Add the configuration help text by running [this patch](https://github.com/aces/Loris/blob/master/SQL/Archive/Pre-14.10/2014-10-15-ConfigHelp.sql)
8. Run the config migration script, which moves values from your project's config.xml to the database. From the tools directory, run `php config_to_db.php`
