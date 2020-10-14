# Web configuration

## Create front-end Users  

The installation script adds admin user/password, associated with a dummy email address which should be changed. Additional users and permissions are added in the User Accounts page. For clarity and uniqueness, it is recommended to use an email address as username.  

* To set/reset a user password, use the script [tools/resetpassword.php](https://github.com/aces/Loris/blob/master/tools/resetpassword.php)  


## Create back-end accounts  

Two types of back-end accounts are useful for administering Loris: MySQL accounts and Unix account.  

It is good practice to create a new MySQL user for developer purposes (e.g. lorisDBadmin) to execute all back-end transactions, both in configuration and in day-to-day operations (i.e. not MySQL root). This account should be distinct from the MySQL root user as well as distinct from the lorisuser account which the install script created with limited permissions for executing all transactions coming from Loris' PHP code (i.e. from front-end users' activity).  

```SQL
GRANT ALTER, DROP, CREATE, UPDATE, INSERT, SELECT, DELETE, CREATE TEMPORARY TABLES, LOCK TABLES  on $dbname.* to 'lorisDBadmin'@'$dbhost' IDENTIFIED BY '$newpassword' WITH GRANT OPTION ;
```  

lorisadmin is the Loris administrator Unix account. Developers may wish to have their own individual accounts.  

## Security: Enabling SSL  

*Note: SSL is not fully supported for the Data Querying Tool. Individual Loris instances should set up their own SSL for their DQT couchapp hosting.*  

### Enable SSL module in apache  
`sudo a2enmod ssl`  

### Edit `/etc/apache2/sites-available/<project-name>`  
VirtualHost port: change to *:443 (ssl) instead of *:80 (http)  
Verify: SSL Engine On  
SSL certificate: ensure that you have an SSL certificate (contact us if you have questions)  

### Restart Apache  
`sudo /etc/init.d/apache2 restart`  