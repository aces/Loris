For easy understanding of LORIS conventions and documentation, we recommend using the following account names: 

* lorisadmin : Linux user with sudo permission who will setup and manage Loris
* lorisuser : MySQL user with limited (insert, delete, update, select...) permissions on the Loris database, for database transactions requested by the Loris front end
* admin : default username for Loris front-end admin account (browser login)

### System Requirements

Before continuing to the subsequent sections ensure that the following tools are installed.  Sudo permission is required.  This section covers installation and recommended versions of:

 * Apache2
 * PHP
 * MySQL
 * PHP Composer

**Apache2:**
```
sudo yum install httpd 
sudo service httpd start
```
**PHP:**
```
sudo yum install php php-pdo php-mysql 
```

*NOTE:* As of Loris 18.0 php7 is required (but not yet officially supported by CentOS). To upgrade php follow the following instructions
``` 
# update php5 -> php7
curl 'https://setup.ius.io/' -o setup-ius.sh
sudo bash setup-ius.sh

# update php7 specific packages
sudo yum remove php-cli mod_php php-common
sudo yum install php70u-json php70-xml mod_php70u php70u-cli php70u-mysqlnd php70u-mbstring
``` 
**MySQL:**

*Note:* Loris developers (those NOT working with a .zip release codebase) should skip steps relating to hosting mysql locally. Contact sysadmins for database credentials directly.
``` 
sudo yum install mysql mysql-server
```
The above command will download MariaDB by default in CentOS7 [(see paragraph2)](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-7).

Check what version you have installed by running:
```
mysql -v
```
If you have MySQL start the server:
```
sudo service mysqld start
sudo service mysqld status
```
If you have MariaDB:
```
sudo service mariadb start
sudo service mariadb status
```
The two versions should act nearly identically in all other respects. 

To finalise the MySQL/MariaDB installation: 
```
mysql_secure_installation
```
(follow instructions to create a password the root user):

**PHP Composer:**
```
sudo curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```
# LORIS code base

Download the latest release from the [releases page](https://github.com/aces/Loris/releases) to the home directory (~/), unzip it, and copy the contents to the project directory, `/var/www/loris` (we recommend naming your project directory `loris`, although you can use a different naming convention). 
```
wget https://github.com/aces/Loris/archive/v%VERSION%.zip
unzip Loris-%VERSION%.zip
cp -r Loris-%VERSION%/* /var/www/loris
```

Alternatively the latest development branch can be cloned directly [from github] (http://github.com/aces/Loris.git), for development purposes. We do not support unstable dev branches. 

# Setup
**Composer:**

Composer will download LORIS's library requirements, assuming an active internet
connection. There may be additional packages to install at this step for composer to exit successfully, be sure to install the php 7 compatible versions of these packages, if necessary.
```
# Must be run from /var/www/loris
# It may be necessary to create the project/libraries/ directory before running  this command
composer install --no-dev
```
**Apache2**:

A sample apache configuration file is in `docs/config/apache2-site`. 
The install script will ask if you want to automatically create/install apache config files.
To perform this step manually, copy the sample file to the apache configuration directory (`/etc/httpd/conf.d/`), and add the `.conf` file extension:
```
cp docs/config/apache-site /etc/httpd/conf.d/apache-site.conf
```
Ensure that paths and settings in this new file are populated appropriately for your server, e.g. replacing placeholders such as `%LORISROOT% -> /var/www/loris` , `%PROJECTNAME% -> loris`, `%LOGDIRECTORY%-> /var/log/httpd/loris-error.log`. Ensure that the DocumentRoot is pointing to `/var/www/loris/htdocs`.

Also ensure that your new `smarty/templates_c/` directory under the LORIS
root is writable by Apache.
```
chmod 775 /var/www/loris/smarty/templates_c
```
Finally, restart Apache:
```
service httpd restart
service httpd status
```
# Install LORIS
```
cd /var/www/loris/tools
./install.sh
```
point your URL to: `http://%IPADDRESS%/installdb.php`

(%IPADDRESS% will likely be the IP address of the VM you are ssh'ed into)

The web page will prompt you for the following information: 

 * `Server Hostname`: localhost if your database if hosted on your VM or the IP address of your database server

 * `Admin Username`: should be "root" 

 * `Admin Password`: whatever password you set when running the `mysql_secure_installation` step

 * `Database Name`: already set to "LORIS", can be customised

Click submit, and follow the instructions to enter the username and password of your backend user, and front end admin user. 

You may have to manually paste the xml output to `/var/www/loris/project/config.xml`

Your Loris instance should now be accessible by pointing your url to `http://%IPADDRESS%`

Further configuration can be done using the LORIS configuration module.

If there are any errors or you get a blank page, you'll have to troubleshoot
based on the errors in your apache error log (by default
 `/var/log/httpd/loris-error.log`) 