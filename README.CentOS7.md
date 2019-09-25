# LORIS CentOS 7.x Notes

This document contains supplemental details on how to perform a basic CentOS 7.x install of LORIS.
Note that the main README in LORIS assumes that LORIS is being run on Ubuntu.

This Readme assumes you already understand basic UNIX, MariaDB (MySQL) and Apache setup and
settings. If you're not already comfortable troubleshooting system administration issues,
you should not follow this guide.

For further details on the install process, please see the LORIS GitHub Wiki CentOS Install page.  

# System Requirements - Install dependencies

Default dependencies installed by CentOS 7.x may not meet the version requirements for LORIS deployment or development:
* MariaDB 10.2 is supported for LORIS 21.* 
* PHP 7.2 is supported for LORIS 21.*

In addition to the above, the following packages should be installed with `yum` and may also differ from the packages referenced in the main (Ubuntu) [LORIS Readme](./README.md). Detailed command examples are provided below.
 * Apache2.4
 * Node
 * PHP Composer

## Apache2
```
sudo yum install httpd 
sudo systemctl enable httpd
sudo systemctl start httpd
```
## PHP 7.2
```
sudo yum install epel-release
sudo yum install http://rpms.remirepo.net/enterprise/remi-release-7.rpm
sudo yum install yum-utils
sudo yum-config-manager --enable remi-php72
sudo yum update
sudo yum install php72
sudo yum install php72-php-fpm php72-php-gd php72-php-json php72-php-mbstring php72-php-mysqlnd php72-php-xml php72-php-xmlrpc php72-php-opcache php72-php-pdo php72-php-mysql
```
## MariaDB

MySQL is not recommended/supported on CentOS, see [paragraph 2 here](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-7) for background). MySQL and MariaDB are nearly identical in operation.

*Note:* LORIS developers (those NOT working with a .zip release codebase) should skip steps relating to hosting their database locally. Contact your sysadmin for database credentials.

```
sudo yum install MariaDB-client MariaDB-server
```

By default in CentOS 7, the MariaDB version is 10.2
Check what version you have installed by running:
```
mysql -v
```

Upgrade your MariaDB to version 10.3 (LORIS 21 does not support MariaDB 10.2.27)
Then, 
```
sudo service mariadb start
sudo service mariadb status
```

To finalise the MySQL/MariaDB installation: 
```
mysql_secure_installation
```
Then follow instructions to create a password for the root user.

## NodeJS
```
sudo yum install nodejs
```

## PHP Composer
```
sudo curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```
# Get the Code

Download the latest release from the [releases page](https://github.com/aces/Loris/releases) to the home directory (~/), unzip it, and copy the contents to your project directory, `/var/www/loris` (we recommend naming your project directory `loris`, although you can use a different naming convention if you prefer). 
```
wget https://github.com/aces/Loris/archive/v$VERSION.zip
unzip Loris-%VERSION%.zip
cp -r Loris-%VERSION%/* /var/www/loris
```

Alternatively the latest development branch can be obtained by forking the [LORIS repository](http://github.com/aces/Loris) for development purposes. We do not support unstable dev branches. 

# Configure Apache

A sample apache configuration file is in `docs/config/apache2-site`. 
The install script will ask if you want to automatically create/install apache config files.
It is recommended to perform this step **manually** --: copy our sample file to the apache configuration directory (`/etc/httpd/conf.d/`) and add the `.conf` file extension:

```bash
cp docs/config/apache-site /etc/httpd/conf.d/apache-site.conf
```

Customize and Verify your settings: 
* Paths and settings in `/etc/httpd/conf.d/apache-site.conf` should be populated appropriately for your server. Replace placeholders such as `%LORISROOT%` with `/var/www/loris`, `%PROJECTNAME%` with `loris`, `%LOGDIRECTORY%` with `/var/log/httpd/loris-error.log` 
 * DocumentRoot should point to `/var/www/loris/htdocs`
 * The `smarty/templates_c/` directory must be writable by Apache (e.g. by running: `chmod 775 /var/www/loris/smarty/templates_c)

Finally, restart apache:
```
sudo service httpd restart
sudo service httpd status
```
# Install LORIS

For the purpose of following LORIS conventions and easy understanding of all LORIS documentation, we recommend the following account names: 

* `lorisadmin` unix user with sudo permission who will setup and manage the LORIS back-end
* `lorisuser` MySQL database user with limited (insert, delete, update, select...) permissions, for database transactions requested by the Loris front-end
* `admin` default front-end username for LORIS administrator account (login via browser)

## Run the LORIS install script to set up directories

```
cd /var/www/loris/tools
./install.sh
```
Run the makefile (use `make dev` if you are setting up a development sandbox)
```
cd /var/www/$projectname
make
```
## Install your database
Open your browser and go to: `http://%IPADDRESS%/installdb.php`

(%IPADDRESS% will likely be the IP address of the VM you are ssh'ed into)

The web page will prompt you for the following information: 

 * `Server Hostname` localhost if your database if hosted on your VM or the IP address of your database server

 * `Admin Username` should be `root` or a MariaDB user with permission to create databases and tables

 * `Admin Password` The password you set for `root` user when running the `mysql_secure_installation` step

 * `Database Name` set to "LORIS" by default, can be customised

Click submit, and on the next screen that is presented, follow instructions to enter the username and password of your LORIS database user (`lorisuser`), and front-end `admin` user. 

If you encounter issues creating/generating your config file, you may have to manually paste the xml output that appears on the screen into the file `/var/www/loris/project/config.xml`

Your LORIS instance should now be accessible by pointing your browser URL to `http://%IPADDRESS%`

If there are any errors or you get a blank page, troubleshoot the errors in your apache error log - by default 
 `/var/log/httpd/loris-error.log`

**Next:** Follow the [**Setup Guide** in the LORIS wiki](https://github.com/aces/Loris/wiki/Setup) for all post-install steps and troubleshooting.  
Config settings can be accessed via the front-end Config module under the Admin drop-down menu.
