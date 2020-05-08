# Troubleshooting Common Installation Errors

This guide assumes installation on any supported OS.  

This guide offers support for common issues faced when first installing LORIS. It is assumed that all installation steps provided have been 
correctly followed and that all required dependencies have been installed.

## Frontend Not Loading
This could be because the Config table in the database is not pointing to the correct values. In this case, follow the following steps. 
1. Check the following values in the Config table via the MySQL backend.

| Name | Label          | Value          |  
| ---- | ----------- | ---------- |
| base | Base           | /var/www/loris |
| host | Host           | $yourHostName  | 

These values can be viewed by running the following commands:

```sql
SELECT c.configID, cs.Name, cs.Label, c.value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base');
SELECT c.configID, cs.Name, cs.Label, c.value, cs.Description FROM Config c LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
   ```

2. If they do not match the above format, update these values with the following commands on the MySQL command-line.

```sql
UPDATE Config SET Value='$yourBasePath' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base');
UPDATE Config SET Value='$yourHostName' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host');
```
