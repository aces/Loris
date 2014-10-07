#Configuration Module

The Configuration Module allows you to edit configuration settings from the front end. The configuration values are stored in the database, instead of in the config.xml file. Any settings that are not currently in the Configuration Module can still be found and edited from the config.xml file.

###Migrating configuration data from the config.xml to the database
1. Add the config permission to the permissions table by running [this patch](https://github.com/aces/Loris-Trunk/blob/master/SQL/2014-08-20-Config_Permissions.sql)
2. Create the ConfigSettings and Config table by running [this patch](https://github.com/aces/Loris-Trunk/blob/master/SQL/2014-08-29-ConfigSettings.sql)
3. Fill the ConfigSettings table by running [this patch](https://github.com/aces/Loris-Trunk/blob/master/SQL/2014-09-25-ConfigToDB.sql)
4. Fill the Config table with default values by running [this patch](https://github.com/aces/Loris-Trunk/blob/master/SQL/2014-09-26-DefaultConfig.sql)
5. Run the config migration script, which moves values from your project's config.xml to the database. From the tools directory, run `php config_to_db.php`
6. Add the configuration module to the LORIS menu by running [this patch](https://github.com/aces/Loris-Trunk/blob/master/SQL/2014-10-02-ConfigMenu.sql)