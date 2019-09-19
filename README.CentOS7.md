# LORIS CentOS 7.x Notes

This document contains supplemental details on how to perform a basic CentOS 7.x install of LORIS.
Note that the main README in LORIS assumes that LORIS is being run on Ubuntu.

This Readme assumes you already understand basic UNIX, MySQL and Apache setup and
settings. If you're not already comfortable troubleshooting sysadmin issues,
you should not follow this guide.

For further details on the install process, please see the LORIS GitHub Wiki CentOS Install page.  

# System Requirements

Default dependencies installed by CentOS 7.x may not meet the version requirements LORIS deployment or development.
* MySQL 5.7 is supported for LORIS 21.*
* PHP 7.2 is supported for LORIS 21.* - upgrade your PHP manually

The yum packages to be installed vary from any Ubuntu packages referenced in the LORIS README.

The following should be installed with yum:
 * Apache2
 * PHP
 * MySQL
 * Node
 * PHP Composer

**Apache2:**
```
sudo yum install httpd 
sudo service httpd start
```
**PHP:**
```
sudo yum install epel-release
sudo yum install http://rpms.remirepo.net/enterprise/remi-release-7.rpm
sudo yum install yum-utils
sudo yum-config-manager --enable remi-php72
sudo yum update
sudo yum install php72
sudo yum install php72-php-fpm php72-php-gd php72-php-json php72-php-mbstring php72-php-mysqlnd php72-php-xml php72-php-xmlrpc php72-php-opcache php72-php-pdo php72-php-mysql
```
**MySQL:**

*Note:* Loris developers (those NOT working with a .zip release codebase) should skip steps relating to hosting mysql locally. Contact your sysadmins for database credentials directly.
``` 
sudo yum install mysql mysql-server
```
The above command will download MariaDB by default in CentOS7 [(see paragraph2)](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-7).

Check what version you have installed by running:
```
mysql -v
```
If you have MySQL:
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
**NodeJS:**
```
sudo yum install nodejs
```
**PHP Composer:**
```
sudo curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```
# LORIS codebase

Download the latest release from the [releases page](https://github.com/aces/Loris/releases) to the home directory (~/), unzip it, and copy the contents to your project directory, `/var/www/loris` (we recommend naming your project directory `loris`, although you can use a different naming convention if you prefer). 
```
wget https://github.com/aces/Loris/archive/v$VERSION.zip
unzip Loris-%VERSION%.zip
cp -r Loris-%VERSION%/* /var/www/loris
```

Alternatively the latest development branch can be obtained by forking the [LORIS repository] (http://github.com/aces/Loris) for development purposes. We do not support unstable dev branches. 

# Setup:

**Composer:**

Composer will download all of LORIS's library requirements, assuming an active internet connection.
This must be done from the LORIS project directory `/var/www/loris`. There may be additional packages
to install at this setp for composer to exist successfully, be sure to install the php 7 compatible 
versions of these packages, if necessary. 

```bash
# It may be necessary to create the project/libraries/ directory before running composer install 
composer install --no-dev
```

**Apache2:**

A sample apache configuration file is in `docs/config/apache2-site`. 
The install script will ask if you want to automatically create/install apache config files.
To perform this step manually, copy the sample file to the apache configuration directory (`/etc/httpd/conf.d/`), and add the `.conf` file extension:

```bash
cp docs/config/apache-site /etc/httpd/conf.d/apache-site.conf
```

Ensure the following: 

 * Paths and settings in `/etc/heepd/conf.d/apache-site.conf` are populated appropriately for your server, (replacing placeholders such as `%LORISROOT% --> /var/www/loris`, `%PROJECTNAME% --> loris`, `%LOGDIRECTORY% --> /var/log/httpd/loris-error.log`. 
 * DocumentRoot is pointing to `/var/www/loris/htdocs`.
 * The `smarty/templates_c/` directory under the LORIS root is writable by Apache.
 (This can be done by running: `chmod 775 /var/www/loris/smarty/templates_c)

`
Finally, restart apache:
```
sudo service httpd restart
sudo service httpd status
```
# Install LORIS

For the purpose of following LORIS conventions and easy understanding of all LORIS documentation, we recommend the following account names: 

* lorisadmin : Linux user with sudo permission who will setup and manage Loris
* lorisuser : MySQL user with limited (insert, delete, update, select...) permissions on the Loris database, for database transactions requested by the Loris front end
* admin : default username for Loris front-end admin account (browser login)

**Run the LORIS install script to set up directories:**

```
cd /var/www/loris/tools
./install.sh
```
Run the makefile (use `make dev` if you are setting up a development sandbox)
```
cd /var/www/$projectname
make
```
**Install your database:**
Open your browser and go to: `http://%IPADDRESS%/installdb.php`

(%IPADDRESS% will likely be the IP address of the VM you are ssh'ed into)

The web page will prompt you for the following information: 

 * `Server Hostname`: localhost if your database if hosted on your VM or the IP address of your database server

 * `Admin Username`: should be "root" 

 * `Admin Password`: whatever password you set when running the `mysql_secure_installation` step

 * `Database Name`: set to "LORIS" by default, can be customised

Click submit, and follow the instructions to enter the username and password of your backend user, and front end admin user. 

You may have to manually paste the xml output to `/var/www/loris/project/config.xml`

Your Loris instance should now be accessible by pointing your url to `http://%IPADDRESS%`

If there are any errors or you get a blank page, troubleshoot the errors in your apache error log (by default
 `/var/log/httpd/loris-error.log`) 

Follow the Setup Guide in the LORIS wiki for all post-install steps and troubleshooting.  
Config settings can be accessed via the front-end Config module under the Admin drop-down menu.
