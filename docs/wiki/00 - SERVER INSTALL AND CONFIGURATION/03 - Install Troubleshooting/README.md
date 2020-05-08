# Troubleshooting Common Installation Errors

This guide assumes installation on any supported OS.  

This guide offers support for common issues faced when first installing LORIS. It is assumed that all installation steps provided have been 
correctly followed and that all required dependencies have been installed.

## Frontend Not Loading
This could be because the Config table in the database is not pointing to the correct values. In this case, follow the following steps. 
1. Check the following values in the Config table via the MySQL backend.  

| ConfigID | Name | Label          | Value          |  
| --- | ---- | ----------- | ---------- |
| 28       | base | Base           | /var/www/loris |
| 44       | host | Host           | $yourHostName  | 
| 45       | url  | Main LORIS URL | $yourURL       | 

These values can be viewed by running the following commands:

```sql
SELECT c.configID, cs.Name, cs.Label, c.value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base');
SELECT c.configID, cs.Name, cs.Label, c.value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
SELECT c.configID, cs.Name, cs.Label, c.value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url');
   ```

2. If they do not match the above format, update these values with the following commands on the MySQL command-line.
***Note:** The url should have the format `https://` and not `http://`*

```sql
UPDATE Config SET Value='$yourBasePath' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base');
UPDATE Config SET Value='$yourHostName' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
UPDATE Config SET Value='$yourURL' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url');
```
